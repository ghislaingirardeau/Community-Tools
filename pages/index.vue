<template>
  <v-row justify="space-around">
    <v-col cols="12" sm="5" class="block__simulation">
      <v-row justify="space-around">
        <v-col cols="12">
          <h2>Simulation</h2>
        </v-col>
        <v-col cols="6" class="px-2">
          <v-select
            v-model="paymentType"
            :items="paymentList"
            item-text="state"
            item-value="value"
            return-object
            label="Payment Type"
            @change="changePayment"
          ></v-select>
        </v-col>
        <v-col cols="6" class="px-2">
          <v-select
            v-model="currency"
            :items="currencyList"
            label="Currency"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field
            id="loanAmountInput"
            v-model.number="loan.amount"
            label="Loan amount"
            type="number"
            :step="currency === 'Dollars' ? 500 : 500000"
            min='0'
            :prefix="currency === 'Dollars' ? '$' : '៛'"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model.number="loan.rate"
            label="Interest Rate / year"
            suffix="%"
            type="number"
            step="0.5"
            min='0'
            required
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model.number="loan.year"
            label="Year"
            type="number"
            min='1'
            required
          ></v-text-field>
        </v-col>
        <v-col v-if="paymentType.value === 3" cols="6">
          <v-select
            v-model.number="loan.term"
            :items="[6, 12]"
            label="Payment every"
            suffix="months"
          ></v-select>
        </v-col>
        <v-col v-else cols="6">
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
        </v-col>
      </v-row>

      <p v-if="paymentTable">Ended loan : {{ endLoan }}</p>
    </v-col>
    <v-col cols="12" sm="5" class="block__simulation">
      <h2>Loan Summary</h2>
      <v-select
        v-if="paymentType.value != 3"
        v-model="periodicity"
        :items="periodicityList"
        label="Payment Periodicity"
        item-text="state"
        item-value="value"
        return-object
      ></v-select>

      <div class="highlight">
        <p>
          Interest : {{ getPayment.interest }}
          {{ currency === 'Dollars' ? ' $' : ' ៛' }} 
        </p>
        <p v-if="paymentType.value === 1">Capital : {{ loan.year * periodicity.value }} payment of
          {{ getPayment.capital }}
          {{ currency === 'Dollars' ? ' $' : ' ៛' }}
        </p>
        <p v-else>
          {{getPayment.endTerm}}
        </p>
      </div>
      <p class="important">
        Total interest :
        {{ parseInt(interestTotal) }}
        {{ currency === 'Dollars' ? ' $' : ' ៛' }}
      </p>
      <p class="important">
        Total Loan: {{ totalLoan }}
        {{ currency === 'Dollars' ? ' $' : ' ៛' }}
      </p>
      <h2 class="title--border mb-3">Expected Outcome</h2>
      <v-text-field
        v-model="income"
        label="My expected income / year"
        required
        hint="Base on revenu, is at least 50% of your loan"
        persistent-hint
        type="number"
        step="500"
        min='0'
        outlined
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
        { state: 'End', value: 2 },
        { state: 'Custom', value: 3 },
      ],
      paymentType: { state: 'Constant', value: 1 },
      date: new Date().toISOString().substr(0, 7),
      menu: false,
      loan: {
        amount: 10000,
        rate: 5,
        year: 2,
        term: 3
      },
      loanMensuality: 0,
      periodicity: { state: 'Every Months', value: 12 },
      periodicityList: [
        { state: 'Every Months', value: 12 },
        { state: 'Every 6 Months', value: 2 },
        { state: 'Every Year', value: 1 },
      ],
      interestTotal: 0,
      income: 0,
      paymentTable: undefined,
    }
  },
  computed: {
    endLoan() {
      return this.paymentTable[this.paymentTable.length - 1].date
    },
    totalLoan() {
      const total = parseInt(this.loan.amount) + parseFloat(this.interestTotal)
      const totalFormated = parseInt(total)
      if (totalFormated !== 'NaN') {
        return totalFormated
      } else {
        return 0
      }
    },
    getPayment() {
      const object = {
        interest: 0,
        capital: 0,
        endTerm: false
      }
      const paymentObject = (period, capital) => {
          object.interest = this.paymentType.value === 2 ?
            (this.interestTotal / this.loan.year / period).toFixed(2)
            : `average ${(this.interestTotal / this.loan.year / 12).toFixed(2)}`
          object.capital = this.paymentType.value === 2 ? 0 
            : capital
          object.endTerm = this.paymentType.value === 2 ? 
            `On ${this.endLoan}, you have to pay ${this.loan.amount} ${this.currency === 'Dollars' ? ' $' : ' ៛'}` 
            : false
      }
      switch (this.periodicity.value) { 
        // CONSTANT ON SEMESTRE SIMILAR TO CUSTOM LOAN ???
        case 12:
          {
            const paramsCapital = this.paymentTable ?
             (this.paymentTable[0].capital + this.paymentTable[0].interest).toFixed(2) 
             : console.log('not load')
            paymentObject(12, paramsCapital)
          }
          break
        case 1: // year
          {
            const paramsCapital = (this.loan.amount / this.loan.year).toFixed(2)
            paymentObject(1, paramsCapital)
          }
          break
        case 2:
          {
            const paramsCapital = (this.loan.amount / this.loan.year / 2).toFixed(2)
            paymentObject(2, paramsCapital)
          }
          break
      }
      return object
    },
    adviceMessage() {
      const result = ((this.loanMensuality * 12) / this.income) * 100
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
          this.mensualite()
          this.amortissement()
        },
        deep: true
    },
    'loan.rate': {
        handler (after, before) {
          this.mensualite()
          this.amortissement()
        },
        deep: true
    },
    'loan.amount': {
        handler (after, before) {
          this.mensualite()
          this.amortissement()
        },
        deep: true
    },
    'loan.term': {
        handler (after, before) {
          this.updateCustomTermPeriod()
        },
        deep: true
    }
  },

  mounted () {
    this.mensualite()
    this.amortissement()
  },
  methods: {
    updateCustomTermPeriod() {
      this.periodicity.value = 12 / this.loan.term 
    },
    changePayment() {
      this.mensualite()
      this.amortissement()
      const resetPeriod = () => {
        this.periodicity = { state: 'Every Months', value: 12 }
      }
      this.paymentType.value === 3 ? this.updateCustomTermPeriod() : resetPeriod()
    },
    amortissement() {
      this.paymentTable = new Array(this.loan.year * 12)
      this.interestTotal = 0

      const paymentConstant = (i, amountMonthly, dateParams) => {
        this.paymentTable[i] = {
          date: dateParams.toISOString().substr(0, 7),
          loanBegin: amountMonthly,
          capital:
            this.loanMensuality - ((this.loan.rate / 12) * amountMonthly) / 100,

          interest: ((this.loan.rate / 12) * amountMonthly) / 100,
          loanFinal:
            amountMonthly -
            (this.loanMensuality - ((this.loan.rate / 12) * amountMonthly) / 100),
        }
      }

      const paymentEndTerm = (i, amountMonthly, dateParams) => {
        this.paymentTable[i] = {
          date: dateParams.toISOString().substr(0, 7),
          capital: 0,
          interest:
            (this.loan.amount * (this.loan.rate / 100) * this.loan.year) /
            (this.loan.year * 12),
          loanFinal: parseFloat(amountMonthly),
        }
      }

      const paymentCustomTerm = (i, amountMonthly, dateParams) => {
        this.paymentTable[i] = {
          date: dateParams.toISOString().substr(0, 7),
          loanBegin: amountMonthly,
          capital:
            this.loanMensuality - ((this.loan.rate / 12) * amountMonthly) / 100,

          interest: ((this.loan.rate / 12) * amountMonthly) / 100,
          loanFinal:
            amountMonthly -
            (this.loanMensuality - ((this.loan.rate / 12) * amountMonthly) / 100),
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
          case 3:
            if (index === 0) {
              const amount = this.loan.amount
              paymentCustomTerm(index, amount, today)
            } else {
              const solde = this.paymentTable[index - 1].loanFinal
              paymentCustomTerm(index, solde, today)
            }
            this.interestTotal = this.interestTotal + parseFloat(this.paymentTable[index].interest)
            break

        }
      }
      switch (this.paymentType.value) {
        case 2:
          this.paymentTable[this.paymentTable.length - 1].capital = parseFloat(
            this.loan.amount)
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
            this.loanMensuality = this.currency === 'Dollars'
              ? parseFloat(calcul).toFixed(2)
              : parseInt(calcul)
          } else {
            this.loanMensuality = 0
          }
          break
        case 2:
          calcul =
            (this.loan.amount * (this.loan.rate / 100) * this.loan.year) /
            (this.loan.year * 12)
          this.loanMensuality = parseFloat(calcul).toFixed(2)
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
.highlight{
  font-weight: 600;
  color: rgb(194, 43, 43);
}
.important {
  font-weight: 600;
  color: rgb(28, 97, 201);
}
.title--border{
  border-top: 2px solid grey;
}
</style>