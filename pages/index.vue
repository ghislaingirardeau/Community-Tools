<template>
  <v-row justify="space-around">
    <v-col cols="12" sm="5" class="block__simulation">
      <v-row justify="space-around">
        <v-col cols="12">
          <h2 style="display: inline-block">កម្ចីសាកល្បង</h2>
          <span>/(Simulation)</span>
        </v-col>
        <v-col cols="6" class="px-2">
          <v-select
            v-model="paymentType"
            :items="paymentList"
            item-text="state"
            item-value="value"
            return-object
            label="របៀបសងប្រាក់/(Type)"
            @change="changePayment"
          ></v-select>
        </v-col>
        <v-col cols="6" class="px-2">
          <v-select
            v-model="currency"
            :items="currencyList"
            label="រូបិយប័ណ្ណ/(Currency)"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field
            id="loanAmountInput"
            v-model.number="loan.amount"
            label="ចំនួនប្រាក់កម្ចី/(Amount)"
            type="number"
            :rules="[(value) => !!value || 'លេខត្រូវបំពេញ / Required a number']"
            :step="currency === 'ប្រាក់ដុល្លារ/(Dollars)' ? 500 : 500000"
            min="0"
            :prefix="currency === 'ប្រាក់ដុល្លារ/(Dollars)' ? '$' : '៛'"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model.number="loan.rate"
            label="អត្រា​ការ​ប្រាក់/(Rate)"
            suffix="%"
            type="number"
            :rules="[(value) => !!value || 'លេខត្រូវបំពេញ / Required a number']"
            step="0.01"
            min="0.5"
            max="2.5"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
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
                label="ខែឆ្នាំចាប់ផ្តើម / start"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              :allowed-dates="disablePastMonths"
              type="month"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">
                ការលុបចោល
              </v-btn>
              <v-btn text color="primary" @click="updateDate">
                យល់ព្រម
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model.number="loan.year"
            label="រយៈពេលកម្ចី/(Duration)"
            type="number"
            :rules="[(value) => !!value || 'លេខត្រូវបំពេញ / Required a number']"
            min="1"
          ></v-text-field>
        </v-col>
        
      </v-row>

      <p v-if="paymentTable">
        ខែឆ្នាំបញ្ចប់ប្រាក់កម្ចី/(End) : {{ endLoan }}
      </p>
    </v-col>
    <v-col v-show="validForm" cols="12" sm="5" class="block__simulation">
      <h2>តារាងសង្ខេបប្រាក់កម្ចី</h2>
      <v-select
        v-model="periodicity"
        :items="periodicityList"
        label="របៀបនៃការទូទាត់សងប្រាក់/(Period)"
        item-text="state"
        item-value="value"
        return-object
      ></v-select>

      <div class="highlight">
        <div>
          <span v-if="paymentType.value === 1">
            ប្រាក់ដើម :
            {{ loan.year * periodicity.value }} ដងនៃ
            {{ getPayment.capital }}
            {{ currency === 'ប្រាក់ដុល្លារ/(Dollars)' ? ' $' : ' ៛' }}
          </span>
          <span v-if="paymentType.value === 1" style="font-size: 10px">
            (Capital :
            {{ loan.year * periodicity.value }} payment of
            {{ getPayment.capital }}
            {{ currency === 'ប្រាក់ដុល្លារ/(Dollars)' ? ' $' : ' ៛' }})
          </span>
          <p v-else>
            {{ getPayment.endTerm }}
          </p>
        </div>
        <div>
          <p>ចំនួនការប្រាក់ប្រចាំខែ :</p>
          <span
            >{{ getPayment.interest }}
            {{ currency === 'ប្រាក់ដុល្លារ/(Dollars)' ? ' $' : ' ៛' }}</span
          >
          <span v-if="paymentType.value === 1" class="text--small"
            >គិតជាមធ្យមក្នុងមួយខែ/(average)</span
          >
          <span style="font-size: 10px">(Interest every months)</span>
        </div>
      </div>
      <div class="my-2">
        <span class="important title--border pt-3">
          ចំនួនការប្រាក់សរុប
          {{ convertNumberInput(parseInt(interestTotal)) }}
          {{ currency === 'ប្រាក់ដុល្លារ/(Dollars)' ? ' $' : ' ៛' }}
        </span>
        <span style="font-size: 10px">(Total interest)</span>
      </div>
      <div class="my-2">
        <span class="important">
          ចំនួនត្រូវសងសរុប {{ convertNumberInput(totalLoan) }}
          {{ currency === 'ប្រាក់ដុល្លារ/(Dollars)' ? ' $' : ' ៛' }}
        </span>
        <span style="font-size: 10px">/(Total Loan)</span>
      </div>
      <h2 class="title--border mb-3" style="display: inline-block">
        លទ្ធផលរំពឹងទុក
      </h2>
      <span>/(Outcome)</span>
      <v-tooltip v-model="showTipsOutcome" top min-width="300">
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon color="primary" @click="showTipsOutcome = !showTipsOutcome">
              mdi-help-circle
            </v-icon>
          </v-btn>
        </template>
        <span
          >ការសងប្រចាំឆ្នាំបូកទាំងការបង់រំលួសប្រាក់ដើម និងប្រាក់ការត្រូវស្មើនឹង
          ៥០% នៃប្រាក់ចំណូលដែលរំពឹងទុក
          ប្រសិនបើការសងត្រឡប់ប្រចាំឆ្នាំលើសពី៥០%​នៃប្រាក់ចំណួល
          អ្នកនឹងអាចជាប់ក្នុងបំណុលវ័ណ្ឌក/(Base on revenu, is at least 50% of
          your loan)</span
        >
      </v-tooltip>

      <v-text-field
        v-model="income"
        label="ប្រាក់ចំណូលរំពឹងទុកក្នុងមួយឆ្នាំ/(Expect income / year)"
        required
        type="number"
        step="500"
        min="0"
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
    <v-col cols="11">
      <v-btn color="primary" @click="compareTables">{{
        showCompareDatas
          ? 'ចុចលាក់តារាង/(Hide)'
          : 'ចុចប្រៀបធៀបដើម្បីរកការប្រាក់ទាប'
      }}</v-btn>
    </v-col>
    <best-bank-table
      v-if="showCompareDatas"
      :top-best-bank="topBestBank.rate"
      title="អត្រាការប្រាក់ទាបជាងគេបង្អស់/(Top Interest)"
    />
    <best-bank-table
      v-if="showCompareDatas"
      :top-best-bank="topBestBank.fee"
      title="ថ្លៃសេវាទាបជាងគេបង្អស់/(Top Fee)"
    />

    <payment-table
      v-show="validForm"
      :payment-table="paymentTable"
      :loan="loan"
      :currency="currency"
    />
  </v-row>
</template>

<script>
import datas from '@/assets/public/data'

export default {
  name: 'SimulationPage',
  data() {
    return {
      currencyList: ['ប្រាក់រៀល/(Riels)', 'ប្រាក់ដុល្លារ/(Dollars)'],
      currency: 'ប្រាក់រៀល/(Riels)',
      paymentList: [
        { state: 'បង់រំលួសប្រាក់ដើម និងប្រាក់ការប្រចាំខែ/(Constant)', value: 1 },
        { state: 'ឡើងដើមមួយតែដងគត់/(End)', value: 2 },
      ],
      paymentType: {
        state: 'បង់រំលួសប្រាក់ដើម និងប្រាក់ការប្រចាំខែ/(Constant)',
        value: 1,
      },
      date: new Date().toISOString().substr(0, 7),
      menu: false,
      loan: {
        amount: 1000000,
        rate: 1.5,
        year: 2,
      },
      loanMensuality: 0,
      periodicity: { state: 'រៀងរាល់ខែ/(Every Months)', value: 12 },
      periodicityList: [
        { state: 'រៀងរាល់ខែ/(Every Months)', value: 12 },
        { state: 'រៀងរាល់៦ខែម្ដង/(Every 6 Months)', value: 2 },
        { state: 'រៀងរាល់ឆ្នាំ/(Every Year)', value: 1 },
      ],
      interestTotal: 0,
      income: 0,
      paymentTable: undefined,
      showCompareDatas: false,
      topBestBank: {
        rate: undefined,
        fee: undefined,
      },
      showTipsOutcome: false,
    }
  },
  computed: {
    validForm() {
      const values = Object.values(this.loan)
      const allNumbers =
        values.map((e) => typeof e === 'number').filter((e) => e === false)
          .length === 0
      const notZero =
        Object.values(this.loan).filter((e) => e === 0).length === 0
      return allNumbers && notZero
    },
    endLoan() {
      return this.loan.year
        ? this.paymentTable[this.paymentTable.length - 1].date
        : ''
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
        endTerm: 'បំពេញបែបបទ/(filled the form !)',
      }
      const paymentObject = (period, capital) => {
        const endTermInterestByPeriod =
          period === 12
            ? (this.interestTotal / this.loan.year / 12).toFixed(2)
            : `${(this.interestTotal / this.loan.year / 12).toFixed(2)} ${
                this.currency === 'ប្រាក់ដុល្លារ/(Dollars)' ? ' $' : ' ៛'
              } so ${(this.interestTotal / this.loan.year / period).toFixed(2)}`
        object.interest =
          this.paymentType.value === 2
            ? endTermInterestByPeriod
            : (this.interestTotal / this.loan.year / 12).toFixed(2)
        object.capital =
          this.paymentType.value === 2
            ? 0 // on endterms
            : capital
        object.endTerm =
          this.paymentType.value === 2
            ? `${this.endLoan}, ចំនួនដែលត្រូវសង/(You have to pay) ${
                this.loan.amount
              } ${this.currency === 'ប្រាក់ដុល្លារ/(Dollars)' ? ' $' : ' ៛'}`
            : 'បំពេញបែបបទ/(filled the form !)'
      }
      if (typeof this.loan.year === 'number' && this.loan.year > 0) {
        switch (this.periodicity.value) {
          // CONSTANT ON SEMESTRE SIMILAR TO CUSTOM LOAN ???
          case 12:
            {
              const paramsCapital = this.paymentTable
                ? (
                    this.paymentTable[0].capital + this.paymentTable[0].interest
                  ).toFixed(2)
                : console.log('not load')
              paymentObject(12, paramsCapital)
            }
            break
          case 1: // year
            {
              const paramsCapital = (this.loan.amount / this.loan.year).toFixed(
                2
              )
              paymentObject(1, paramsCapital)
            }
            break
          case 2:
            {
              const paramsCapital = (
                this.loan.amount /
                this.loan.year /
                2
              ).toFixed(2)
              paymentObject(2, paramsCapital)
            }
            break
        }
      }
      return object
    },
    adviceMessage() {
      const result =
        this.paymentType.value === 1
          ? ((this.loanMensuality * 12) / this.income) * 100
          : ((this.loan.amount / this.loan.year + this.loanMensuality * 12) /
              this.income) *
            100
      if (result < 50) {
        return {
          message: 'ល្អ/(Good)',
          response: true,
        }
      } else {
        return {
          message: 'គ្រោះថ្នាក់/(Dangerous)',
          response: false,
        }
      }
    },
  },
  watch: {
    'loan.year': {
      handler(after, before) {
        this.mensualite()
        this.amortissement()
        this.showCompareDatas = false
      },
      deep: true,
    },
    'loan.rate': {
      handler(after, before) {
        this.mensualite()
        this.amortissement()
        this.showCompareDatas = false
      },
      deep: true,
    },
    'loan.amount': {
      handler(after, before) {
        this.mensualite()
        this.amortissement()
        this.showCompareDatas
          ? (this.showCompareDatas = false)
          : console.log(true)
      },
      deep: true,
    },
  },

  mounted() {
    this.mensualite()
    this.amortissement()
  },
  methods: {
    disablePastMonths(val) {
      return val >= new Date().toISOString().substr(0, 10)
    },
    changePayment() {
      this.mensualite()
      this.amortissement()
    },
    amortissement() {
      this.paymentTable = new Array(this.loan.year * 12)
      this.interestTotal = 0

      const paymentConstant = (i, amountMonthly, dateParams) => {
        this.paymentTable[i] = {
          date: dateParams.toISOString().substr(0, 7),
          loanBegin: amountMonthly,
          capital: this.loanMensuality - (this.loan.rate * amountMonthly) / 100,

          interest: (this.loan.rate * amountMonthly) / 100,
          loanFinal:
            amountMonthly -
            (this.loanMensuality - (this.loan.rate * amountMonthly) / 100),
        }
      }

      const paymentEndTerm = (i, amountMonthly, dateParams) => {
        this.paymentTable[i] = {
          date: dateParams.toISOString().substr(0, 7),
          capital: 0,
          interest:
            (this.loan.amount *
              ((this.loan.rate * 12) / 100) *
              this.loan.year) /
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
            this.interestTotal =
              this.interestTotal + parseFloat(this.paymentTable[index].interest)
            break
          case 2:
            paymentEndTerm(index, this.loan.amount, today)
            break
        }
      }
      switch (this.paymentType.value) {
        case 2:
          if (typeof this.loan.year === 'number') {
            this.paymentTable[this.paymentTable.length - 1].capital =
              parseFloat(this.loan.amount)
            this.paymentTable[this.paymentTable.length - 1].loanFinal = 0
            this.interestTotal =
              this.loan.amount * ((this.loan.rate * 12) / 100) * this.loan.year
          }
          break
      }
    },
    mensualite() {
      let calcul
      switch (this.paymentType.value) {
        case 1:
          calcul =
            (this.loan.amount * (this.loan.rate / 100)) /
            (1 - (1 + this.loan.rate / 100) ** (-12 * this.loan.year))
          if (calcul) {
            this.loanMensuality =
              this.currency === 'ប្រាក់ដុល្លារ/(Dollars)'
                ? parseFloat(calcul).toFixed(2)
                : parseInt(calcul)
          } else {
            this.loanMensuality = 0
          }
          break
        case 2:
          calcul =
            (this.loan.amount *
              ((this.loan.rate * 12) / 100) *
              this.loan.year) /
            (this.loan.year * 12)
          this.loanMensuality = parseFloat(calcul).toFixed(2)
      }
    },
    updateDate() {
      this.$refs.menu.save(this.date)
      this.mensualite()
      this.amortissement()
    },
    compareTables() {
      this.showCompareDatas = !this.showCompareDatas
      if (this.showCompareDatas) {
        this.compareDatas()
      }
    },
    compareDatas() {
      const listOfPrinciple = datas.loan.map((e) =>
        parseInt(e.principle.slice(0, -3).split(',').join(''))
      )
      const index = []
      listOfPrinciple.forEach((item, i) => {
        if (
          (item > this.loan.amount && item <= this.loan.amount + 1000000) ||
          item === this.loan.amount ||
          (item < this.loan.amount && item >= this.loan.amount - 1000000)
        ) {
          index.push({
            bank: datas.loan[i].bank,
            rate: parseFloat(datas.loan[i].interest.slice(0, -1)),
            fee: parseInt(datas.loan[i].fee.slice(0, -3).split(',').join('')),
          })
        }
      })

      const bestFee = () => {
        return index
          .sort((a, b) => {
            return a.fee - b.fee
          })
          .slice(0, 3)
      }
      const bestRate = () => {
        return index
          .sort((a, b) => {
            return a.rate - b.rate
          })
          .slice(0, 3)
      }
      this.topBestBank.rate = bestRate()
      this.topBestBank.fee = bestFee()
    },
    convertNumberInput(value) {
      const tostring = value.toString()
      if (tostring.length > 3 && tostring.length < 7) {
        const a = tostring.slice(-3)
        const b = tostring.slice(0, -3)
        return b.concat(' ', a)
      } else if (tostring.length > 6) {
        const a = tostring.slice(-3)
        const b = tostring.slice(0, -6)
        const c = tostring.slice(-6, -3)
        return b.concat(' ', c, ' ', a)
      } else {
        return tostring
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
.highlight {
  font-weight: 600;
  color: rgb(194, 43, 43);
  & > div {
    margin-bottom: 15px;
  }
}
.important {
  font-weight: 600;
  color: rgb(28, 97, 201);
}
.title--border {
  border-top: 2px solid grey;
}
.text--small {
  font-size: 12px;
}
</style>