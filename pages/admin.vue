<template>
  <v-row align="center">
    <v-col v-if="userAuth && admin" cols="12" class="controller">
      <v-btn color="primary" @click="showSignUp = !showSignUp">{{
        showSignUp ? 'Hide' : 'Add user'
      }}</v-btn>
      <v-btn color="primary" @click="getCollectors">{{
        showUsers ? 'Hide users' : 'Show users'
      }}</v-btn>
      <sign-in-form v-if="showSignUp" :villages-list="villagesList" />
    </v-col>
    <v-col cols="6" sm="3" class="px-2 controller">
      <v-select
        v-model="village"
        :items="villagesToShow"
        label="village"
        @change="resetDatasArray"
      ></v-select>
    </v-col>
    <v-col cols="6" sm="6" class="px-2 controller">
      <v-select
        v-model="loanSource"
        :items="loanSourceList"
        item-text="type"
        label="Source of loan"
        return-object
        @change="resetDatasArray"
      ></v-select>
    </v-col>
    <v-col cols="6" class="controller">
      <v-btn
        :loading="loading"
        :disabled="loading"
        color="success"
        @click="ReadVillage"
      >
        Load data
      </v-btn>
    </v-col>
    <p v-if="infoMessage" class="ml-2">{{ infoMessage }}</p>

    <user-table
      v-if="showUsers"
      :users-list="usersList"
      :villages-list="villagesList"
    />

    <v-col v-if="listOfLoan.length > 0 && loanSource.value === 1" cols="12">
      <datas-table
        :village-datas="listOfLoan"
        :source-mfi="true"
        @refresh-table="onRefresh"
      />
    </v-col>
    <v-col v-if="listOfLoan.length > 0 && loanSource.value === 2" cols="12">
      <datas-table
        :village-datas="listOfLoan"
        :source-mfi="false"
        @refresh-table="onRefresh"
      />
    </v-col>
    <v-col v-if="totalDatas.length > 0" cols="12">
      <total-table
        :total-datas="totalDatas"
        :source-loan="loanSource.value"
        :loans-collected="listOfLoan.length"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AdminPage',
  data() {
    return {
      loading: false,
      listOfLoan: [],
      usersList: [],
      showUsers: false,
      showSignUp: false,
      village: '',
      villagesToShow: undefined,
      infoMessage: undefined,
      admin: false,
      loanSource: { type: 'ស្ថាប័នឥណទាន/ (Microfinance)', value: 1 },
      loanSourceList: [
        { type: 'ស្ថាប័នឥណទាន/ (Microfinance)', value: 1 },
        { type: 'អ្នកចងការឯកជន/ (private)', value: 2 },
      ],
      totalDatas: [],
    }
  },
  computed: {
    ...mapState(['userAuth', 'villagesList']),
  },
  mounted() {
    if (
      this.userAuth &&
      (this.userAuth.role === process.env.roleThree ||
        this.userAuth.role === process.env.roleTwo)
    ) {
      switch (this.userAuth.role) {
        case process.env.roleThree:
          this.villagesToShow = this.villagesList
          this.admin = true
          break
        case process.env.roleTwo:
          this.villagesToShow = this.userAuth.village
          break
      }
    } else {
      this.$router.push('/')
    }
  },
  methods: {
    onRefresh(payload) {
      this.listOfLoan = []
      this.totalDatas = []
      const refreshTable = (params) => {
        return new Promise((resolve, reject) => {
          this.ReadVillage()
          resolve(true)
        })
      }
      refreshTable().then(() => {
        this.totalsTable(payload)
      })
    },
    resetDatasArray() {
      this.listOfLoan = []
      this.totalDatas = []
    },
    async getCollectors() {
      this.showUsers = !this.showUsers
      if (this.showUsers) {
        const messageRef = this.$fire.firestore.collection('authId')
        try {
          const messageDoc = await messageRef
            .where('role', '!=', process.env.roleThree)
            .get()
          messageDoc.forEach((doc) => {
            this.usersList.push({ ...doc.data(), id: doc.id })
          })
        } catch (e) {
          console.log(e)
        }
      } else {
        this.usersList = []
      }
    },
    async ReadVillage() {
      this.listOfLoan = []
      this.totalDatas = []
      this.loading = true
      if (this.villagesToShow.includes(this.village)) {
        this.infoMessage = undefined
        const messageRef = this.$fire.firestore.collection(this.village)
        try {
          const day = 60 * 60 * 24 * 365 * 1000
          const messageDoc = await messageRef
            .where('shareAgreement', '==', true)
            .where('loanSource.value', '==', this.loanSource.value)
            .get()
          messageDoc.forEach((doc) => {
            const datas = doc.data()
            // calculate interestLast12Months here
            datas.interestLast12Months = parseInt(
              datas.remainingLoan * ((12 * datas.loanRate) / 100)
            )
            datas.duration = (
              new Date(
                Date.parse(datas.dateEnd) - Date.parse(datas.dateStart)
              ).getTime() / day
            ).toFixed(2)
            this.listOfLoan.push(datas)
          })
          console.log(this.listOfLoan)

          // GET THE TOTAL
          if (!messageDoc.empty) {
            if (this.loanSource.value === 1) {
              await this.totalsTable(true)
                .then(() => {
                  /* convert inside table */
                  this.listOfLoan.forEach((e) => {
                    e.interestLast12Months = this.convertToNumber(
                      e.interestLast12Months
                    )
                    e.loanAmount = this.convertToNumber(e.loanAmount)
                    e.remainingLoan = this.convertToNumber(e.remainingLoan)
                    e.totalInterest = this.convertToNumber(e.totalInterest)
                    e.serviceFee = this.convertToNumber(e.serviceFee)
                    e.cbc = this.convertToNumber(e.cbc)
                    e.loanRate = e.loanRate.toString().concat('%')
                  })
                })
                .catch((e) => {
                  console.log('error get total', e)
                })
            } else {
              await this.totalsTable(false)
                .then(() => {
                  /* convert inside table */
                  this.listOfLoan.forEach((e) => {
                    e.loanAmount = this.convertToNumber(e.loanAmount)
                    e.totalInterest = this.convertToNumber(e.totalInterest)
                    e.serviceFee = this.convertToNumber(e.serviceFee)
                    e.loanRate = e.loanRate.toString().concat('%')
                  })
                })
                .catch((e) => {
                  console.log('error get total', e)
                })
            }
            this.loading = false
          }

          // RESPONSE
          if (this.listOfLoan.length === 0) {
            this.loading = false
            this.infoMessage = 'No datas collected yet'
          }
        } catch (e) {
          console.log(e)
          this.infoMessage = 'Check your internet connection'
          this.loading = false
        }
      } else {
        this.infoMessage = 'Select a village or access to this village denied'
        this.loading = false
      }
    },
    totalsTable(params) {
      return new Promise((resolve, reject) => {
        try {
          const total = {
            loan: 0,
            totalInterest: 0,
            interestLastOneYear: 0,
            fee: 0,
            cbc: 0,
          }
          const getTotal = (e, i) => {
            const result = this.listOfLoan
              .map((e) => e[i])
              .reduce((a, b) => a + b)
            total[e] = this.convertToNumber(result)
          }
          if (this.listOfLoan.length > 0) {
            if (params) {
              getTotal('loan', 'loanAmount')
              getTotal('totalInterest', 'totalInterest')
              getTotal('interestLastOneYear', 'interestLast12Months')
              getTotal('fee', 'serviceFee')
              getTotal('cbc', 'cbc')
            } else {
              getTotal('loan', 'loanAmount')
              getTotal('totalInterest', 'totalInterest')
              getTotal('fee', 'serviceFee')
            }
            this.totalDatas.push(total)
          }
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@media print {
  .controller {
    display: none;
  }
}
</style>
