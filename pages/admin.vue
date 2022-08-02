<template>
  <v-row align="center">
    <v-col v-if="userAuth && admin" cols="12">
      <v-btn color="primary" @click="showSignUp = !showSignUp">{{
        showSignUp ? 'Hide' : 'Add user'
      }}</v-btn>
      <v-btn color="primary" @click="getCollectors">{{
        showUsers ? 'Hide users' : 'Show users'
      }}</v-btn>
      <sign-in-form v-if="showSignUp" :villages-list="villagesList" />
    </v-col>
    <v-col cols="6" sm="3" class="px-2">
      <v-select
        v-model="village"
        :items="villagesToShow"
        label="village"
        @change="resetDatasArray"
      ></v-select>
    </v-col>
    <v-col cols="6" sm="6" class="px-2">
      <v-select
        v-model="loanSource"
        :items="loanSourceList"
        item-text="type"
        label="Source of loan"
        return-object
        @change="resetDatasArray"
      ></v-select>
    </v-col>
    <v-col cols="6">
      <v-btn color="success" @click="ReadVillage">Load data</v-btn>
    </v-col>
    <p v-if="infoMessage" class="ml-2">{{ infoMessage }}</p>

    <user-table v-if="showUsers" :users-list="usersList" />

    <v-col v-if="listOfLoan.length > 0" cols="12">
      <datas-table :village-datas="listOfLoan" :total-datas="totalDatas" />
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AdminPage',
  data() {
    return {
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
        { type: '្នកចងការឯកជន/ (private)', value: 2 },
      ],
      totalDatas : []
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
            this.usersList.push(doc.data())
          })
        } catch (e) {
          console.log(e)
        }
      } else {
        this.usersList = []
      }
    },
    async ReadVillage() {
      if (this.villagesToShow.includes(this.village)) {
        this.infoMessage = undefined
        const messageRef = this.$fire.firestore.collection(this.village)
        try {
          const messageDoc = await messageRef
            .where('shareAgreement', '==', true)
            .where('loanSource.value', '==', this.loanSource.value)
            .get()
          messageDoc.forEach((doc) => {
            this.listOfLoan.push(doc.data())
          })

          // GET THE TOTAL
          await this.totalsTable()
            .then(() => {
              /* convert inside table */
              this.listOfLoan.forEach(e => {
                console.log(e.loanAmount);
                e.loanAmount = this.convertToNumber(e.loanAmount)
                e.remainingLoan = this.convertToNumber(e.remainingLoan)
                e.totalInterest = this.convertToNumber(e.totalInterest)
                e.interestLast12Months = this.convertToNumber(e.interestLast12Months)
                e.serviceFee = this.convertToNumber(e.serviceFee)
                e.cbc = this.convertToNumber(e.cbc)
                e.loanRate = e.loanRate.toString().concat('%')
              })
            }).catch((e) => {
              console.log('error get total', e)
            });

          // RESPONSE
          this.listOfLoan.length === 0
            ? (this.infoMessage = 'No datas collected yet')
            : console.log('datas loads')
        } catch (e) {
          console.log(e)
        }
      } else {
        this.infoMessage = "You don't have access to this village"
      }
    },
    totalsTable() {
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
              const result = this.listOfLoan.map((e) => e[i]).reduce((a, b) => a + b)
              total[e] = this.convertToNumber(result)
            }
            getTotal('loan', 'loanAmount')
            getTotal('totalInterest', 'totalInterest')
            getTotal('interestLastOneYear', 'interestLast12Months')
            getTotal('fee', 'serviceFee')
            getTotal('cbc', 'cbc')
            this.totalDatas.push(total)
            resolve(true)
            
          } catch (error) {
            reject(error)
          }
      });
    }
  },
}
</script>

<style lang="scss" scoped>
</style>