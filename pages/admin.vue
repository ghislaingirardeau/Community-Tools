<template>
  <v-row align="center" justify="center">
    <v-col cols="11" sm="8" class="controller user_block">
      <v-row v-if="userAuth && admin" class="text-center" justify="center">
        <v-col cols="10">
          <h2>Manage collectors and users</h2>
        </v-col>
        <v-col cols="6">
          <v-btn color="info" class="mr-5" @click="showSignUp = !showSignUp">{{
            showSignUp ? 'Hide' : 'Add user'
          }}</v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            :loading="loadingUser"
            :disabled="loadingUser"
            color="info"
            @click="getCollectors"
            >{{ showUsers ? 'Hide users' : 'Show users' }}</v-btn
          >
        </v-col>
        <v-expand-transition>
          <sign-in-form v-if="showSignUp" :villages-list="villagesList" />
        </v-expand-transition>

        <v-expand-transition>
          <user-table
            v-if="showUsers"
            :users-list="usersList"
            :villages-list="villagesList"
          />
        </v-expand-transition>
      </v-row>
    </v-col>

    <v-col cols="11" sm="8" class="controller user_block">
      <v-row>
        <v-col cols="12" sm="5" class="px-2">
          <v-select
            v-model="village"
            :items="villagesToShow"
            label="village"
            @change="resetDatasArray"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4" class="px-2">
          <v-select
            v-model="loanSource"
            :items="loanSourceList"
            item-text="type"
            label="Source of loan"
            return-object
            @change="resetDatasArray"
          ></v-select>
        </v-col>
        <v-col cols="6" sm="2" class="text-center">
          <v-btn
            :loading="loading"
            :disabled="loading"
            color="info"
            @click="ReadVillage"
          >
            Load data
          </v-btn>
        </v-col>
        <p v-if="infoMessage" class="ml-2 infoMessage">{{ infoMessage }}</p>

        <!-- DISABLE CHART ON ADMIN PAGE -->
        <!-- <v-col cols="12" sm="12" class="bar-chart-container">
          <span v-if="loadProgress != '100.00%'"
            >Loading the charts : wait... {{ loadProgress }}</span
          >

          <bar-chart
            v-else
            :chart-data="barChartData"
            :chart-options="barChartOptions"
          />
        </v-col> -->
      </v-row>
    </v-col>
    <v-col
      v-if="listOfLoan.length > 0 && loanSource.value === 1"
      id="tables"
      cols="12"
    >
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
  middleware: 'auth',
  data() {
    return {
      loading: false,
      loadingUser: false,
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
      collectSummary: {},
      loadProgress: 0,
      barChartData: {
        /* labels: ['January', 'February', 'March'], */
        datasets: [
          {
            label: 'Data collected / village',
            data: {},
            backgroundColor: 'rgba(0, 128, 128, 0.2)',
            borderColor: 'rgba(0, 128, 128, 1)',
            borderWidth: 4,
          },
        ], // DATA SET WITH OBJECTS => BUT NOT POSSIBLE TO DYNAMICLY CHANGE/RENDER
      },
      barChartOptions: {
        responsive: true,
        legend: {
          display: true,
        },
        onClick: (event, clickedElements) => {
          const { dataIndex } = clickedElements[0].element.$context
          const barLabel = event.chart.data.labels[dataIndex]
          this.village = barLabel
          this.ReadVillage()
        },
        onHover: (event, chartElement) => {
          event.native.target.style.cursor = chartElement[0]
            ? 'pointer'
            : 'default'
        },
        layout: {
          /* padding: 40, */
        },
        plugins: {
          title: {
            display: true,
            text: 'Data collected / village',
            color: 'white',
            font: {
              size: 24,
            },
          },
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'white',
            titleColor: 'black',
            boxPadding: 10,
            bodyColor: 'black',
            callbacks: {
              labelColor: (context) => {
                return {
                  backgroundColor: context.dataset.borderColor, // RETURN THE SAME COLOR BOX AS THE LINE COLOR
                }
              },
              label: (context) => {
                return 'Datas : ' + context.formattedValue
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: 'white',
            },
          },
          y: {
            ticks: {
              color: 'white',
            },
          },
        },
      },
    }
  },
  computed: {
    ...mapState(['userAuth', 'villagesList']),
    // eslint-disable-next-line vue/return-in-computed-property
  },
  mounted() {
    switch (this.userAuth.role) {
      case process.env.roleThree:
        this.villagesToShow = this.villagesList
        this.admin = true
        break
      case process.env.roleTwo:
        this.villagesToShow = this.userAuth.village
        break
    }
    this.collectionSummary()
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
      if (!this.showUsers) {
        this.usersList = []
        return
      }

      this.loadingUser = true
      const messageRef = this.$fire.firestore.collection('authId')
      try {
        const messageDoc = await messageRef
          .where('role', '!=', process.env.roleThree)
          .get()
        messageDoc.forEach((doc) => {
          this.usersList.push({ ...doc.data(), id: doc.id })
        })
        this.loadingUser = false
      } catch (e) {
        console.log(e)
        this.loadingUser = false
      }
      /* if (this.showUsers) {
        this.loadingUser = true
        const messageRef = this.$fire.firestore.collection('authId')
        try {
          const messageDoc = await messageRef
            .where('role', '!=', process.env.roleThree)
            .get()
          messageDoc.forEach((doc) => {
            this.usersList.push({ ...doc.data(), id: doc.id })
          })
          this.loadingUser = false
        } catch (e) {
          console.log(e)
          this.loadingUser = false
        }
      } else {
        this.usersList = []
      } */
    },
    async ReadVillage() {
      this.listOfLoan = []
      this.totalDatas = []
      this.loading = true
      if (this.villagesToShow.includes(this.village)) {
        this.infoMessage = undefined
        const messageRef = this.$fire.firestore.collection(this.village)
        try {
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
            datas.duration = this.$moment(datas.dateEnd)
              .diff(datas.dateStart, 'years', true)
              .toFixed(2)
            this.listOfLoan.push(datas)
          })

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
            const element = document.getElementById('tables')
            element.scrollIntoView({ behavior: 'smooth' })
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
    async collectionSummary() {
      if (sessionStorage.getItem('communityDataCollection')) {
        this.collectSummary = JSON.parse(
          sessionStorage.getItem('communityDataCollection')
        )
        this.barChartData.datasets[0].data = this.collectSummary
        this.loadProgress = '100.00%'
      } else {
        let count = 0
        const numberVillage = this.villagesList.length
        for (const index of this.villagesList) {
          count++
          const messageRef = this.$fire.firestore.collection(index)
          try {
            const messageDoc = await messageRef
              .where('shareAgreement', '==', true)
              .get()
            if (messageDoc.docs.length > 0) {
              this.collectSummary[index] = messageDoc.docs.length
            }
            this.loadProgress = ((count / numberVillage) * 100)
              .toFixed(2)
              .toString()
              .concat('%')
          } catch (error) {
            console.log(error)
          }
        }
        this.barChartData.datasets[0].data = this.collectSummary
        sessionStorage.setItem(
          'communityDataCollection',
          JSON.stringify(this.collectSummary)
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.bar-chart-container {
  border-top: 2px solid rgba(0, 128, 128, 1);
  width: 800px;
  min-height: 200px;
}
.user_block {
  border: 2px solid #008080;
  margin-top: 12px;
  border-radius: 15px 0px 15px 0px;
}
.infoMessage {
  color: red;
}
@media print {
  .controller {
    display: none;
  }
}
</style>
