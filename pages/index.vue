<template>
  <v-row justify="space-around">
    <v-col cols="12" sm="5" class="block__simulation">
      <h2>Simulation</h2>
      <v-select
        v-model="paymentType"
        :items="paymentList"
        item-text="state"
        item-value="value"
        return-object
        label="Payment Type"
        single-line
        @change="changePayment"
      ></v-select>
      <v-select
        v-model="currency"
        :items="currencyList"
        label="currency"
        single-line
      ></v-select>
      <v-text-field
        id="loanAmountInput"
        v-model.number="loan.amount"
        label="Loan amount"
        :prefix="currency === 'Dollars' ? '$' : '៛'"
      ></v-text-field>
      <v-text-field
        v-model.number="loan.rate"
        label="Interest Rate"
        suffix="%"
        required
      ></v-text-field>
      <v-text-field
        v-model.number="loan.year"
        label="Year"
        type="number"
        required
      ></v-text-field>

      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            label="Started Loan"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" type="month" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(date)">
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
      <p v-if="paymentTable">Ended loan : {{ paymentTable[paymentTable.length - 1].date }}</p>
    </v-col>
    <v-col cols="12" sm="5" class="block__simulation">
      <h2>Loan Summary</h2>
      <v-select
        v-model="periodicity"
        :items="items"
        label="Payment Periodicity"
        item-text="state"
        item-value="value"
        return-object
        single-line
      ></v-select>

      <p>Number of payment : {{ loan.year * periodicity.value }}</p>
      <div>
        <p>To pay {{ periodicity.state }}:</p>
        <p v-if="periodicity.value === 12">
          {{ mensualite() }} {{ currency === 'Dollars' ? ' $' : ' ៛' }}
        </p>
        <p v-else>
          interest : {{ parseInt(interestTotal / loan.year) }}
          {{ currency === 'Dollars' ? ' $' : ' ៛' }} Capital :
          {{ parseInt(loan.amount / loan.year) }}
          {{ currency === 'Dollars' ? ' $' : ' ៛' }}
        </p>
      </div>
      <p>
        Total interest :
        {{ parseInt(interestTotal) }}
        {{ currency === 'Dollars' ? ' $' : ' ៛' }}
      </p>
      <p>
        Total Loan: {{ totalLoan }}
        {{ currency === 'Dollars' ? ' $' : ' ៛' }}
      </p>
      <h2>Outcome expected</h2>
      <v-text-field
        v-model="income"
        label="My expected income / year"
        required
        hint="Base on revenu, is at least 50% of your loan"
        persistent-hint
      ></v-text-field>
      <h3
        v-if="income > 0"
        :class="{
          'advice-green': adviceMessage.response,
          'advice-red': !adviceMessage.response,
        }"
        class="mt-3"
      >
        {{ adviceMessage.message }}
      </h3>
    </v-col>
    <payment-table :payment-table="paymentTable" :loan="loan" :currency="currency" />
  </v-row>
</template>

<script>
export default {
  name: 'SimulationPage',
  data() {
    return {
      currencyList: ['Riels', 'Dollars'],
      currency: 'Dollars',
      paymentList: [
        { state: 'Constant', value: 1 },
        { state: 'End terms', value: 2 },
        { state: 'Custom terms', value: 3 },
      ],
      paymentType: { state: 'Constant', value: 1 },
      date: new Date().toISOString().substr(0, 7),
      menu: false,
      loan: {
        amount: 10000,
        rate: 5,
        year: 2,
      },
      periodicity: { state: 'Monthly', value: 12 },
      items: [
        { state: 'Monthly', value: 12 },
        { state: 'Yearly', value: 1 },
      ],
      interestTotal: 0,
      income: 0,
      paymentTable: undefined
    }
  },
  computed: {
    totalLoan() {
      const total = parseInt(this.loan.amount) + parseFloat(this.interestTotal)
      const totalFormated = parseInt(total)
      if (totalFormated !== 'NaN') {
        return totalFormated
      } else {
        return 0
      }
    },
    adviceMessage() {
      const result = ((this.mensualite() * 12) / this.income) * 100
      if (result < 50) {
        return {
          message: 'Your loan is good balance',
          response: true,
        }
      } else {
        return {
          message: 'Your loan is dangerous',
          response: false,
        }
      }
    },
  },
  watch: {
    'loan.year': {
        handler (after, before) {
            this.amortissement()   
        },
        deep: true
    },
    'loan.rate': {
        handler (after, before) {
            this.amortissement()   
        },
        deep: true
    },
    'loan.amount': {
        handler (after, before) {
            this.amortissement()   
        },
        deep: true
    }


  },

  mounted () {
    this.amortissement()
  },
  methods: {
    changePayment() {
      this.amortissement()
    },
    amortissement() {
      this.paymentTable = new Array(this.loan.year * 12)
      this.interestTotal = 0

      const paymentConstant = (i, amountMonthly, dateParams) => {
        this.paymentTable[i] = {
          date: dateParams.toISOString().substr(0, 7),
          loanBegin: amountMonthly,
          capital:
            this.mensualite() - ((this.loan.rate / 12) * amountMonthly) / 100,

          interest: ((this.loan.rate / 12) * amountMonthly) / 100,
          loanFinal:
            amountMonthly -
            (this.mensualite() - ((this.loan.rate / 12) * amountMonthly) / 100),
        }
      }

      const paymentEndTerm = (i, amountMonthly, dateParams) => {
        this.paymentTable[i] = {
          date: dateParams.toISOString().substr(0, 7),
          loanBegin: amountMonthly,
          capital: 0,
          interest:
            (this.loan.amount * (this.loan.rate / 100) * this.loan.year) /
            (this.loan.year * 12),
          loanFinal: parseFloat(amountMonthly),
        }
      }
      for (let index = 0; index < this.paymentTable.length; index++) {
        const today = new Date(this.date)
        today.setMonth(today.getMonth() + index)

        switch (this.paymentType.value) {
          case 1:
            if (index === 0) {
              const amount = this.loan.amount
              paymentConstant(index, amount, today)
            } else {
              const solde = this.paymentTable[index - 1].loanFinal
              paymentConstant(index, solde, today)
            }
            this.interestTotal = this.interestTotal + parseFloat(this.paymentTable[index].interest)
            break
          case 2:
            paymentEndTerm(index, this.loan.amount, today)
            break
        }
      }
      switch (this.paymentType.value) {
        case 2:
          this.paymentTable[this.paymentTable.length - 1].capital = parseFloat(
            this.loan.amount +
              (this.loan.amount * (this.loan.rate / 100) * this.loan.year) /
                (this.loan.year * 12)
          )
          this.paymentTable[this.paymentTable.length - 1].loanFinal = 0
          this.interestTotal =
            this.loan.amount * (this.loan.rate / 100) * this.loan.year
          break
      }
    },
    mensualite() {
      let calcul
      switch (this.paymentType.value) {
        case 1:
          calcul =
            (this.loan.amount * (this.loan.rate / 100)) /
            12 /
            (1 - (1 + this.loan.rate / 100 / 12) ** (-12 * this.loan.year))
          if (calcul) {
            return this.currency === 'Dollars'
              ? parseFloat(calcul).toFixed(2)
              : parseInt(calcul)
          } else {
            return 0
          }
        case 2:
          calcul =
            (this.loan.amount * (this.loan.rate / 100) * this.loan.year) /
            (this.loan.year * 12)
          return parseFloat(calcul).toFixed(2)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.advice-green {
  color: green;
}
.advice-red {
  color: red;
}
.block__simulation {
  border: 2px solid rgb(131, 120, 120);
  padding: 12px;
  margin-top: 10px;
}
</style>