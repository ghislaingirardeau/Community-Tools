<template>
  <v-row align="center">
    <v-col v-if="userAuth && admin" cols="12">
      <v-btn color="primary" @click="showSignUp = !showSignUp">{{
        showSignUp ? 'Hide' : 'Add user'
      }}</v-btn>
      <v-btn color="primary" @click="getCollectors">{{
        showUsers ? 'Hide users' : 'Show users'
      }}</v-btn>
      <sign-in-form v-if="showSignUp" :villages-datas="villagesDatas"/>
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
      <datas-table :village-datas="listOfLoan" />
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
    }
  },
  computed: {
    ...mapState(['userAuth', 'villagesDatas']),
  },
  mounted() {
    if (
      this.userAuth &&
      (this.userAuth.role === process.env.roleThree ||
        this.userAuth.role === process.env.roleTwo)
    ) {
      switch (this.userAuth.role) {
        case process.env.roleThree:
          this.villagesToShow = this.villagesDatas
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
          this.listOfLoan.length === 0
            ? (this.infoMessage = 'No datas collected yet')
            : console.log('datas loads')
        } catch (e) {
          console.log(e)
        }
      } else {
        this.infoMessage = "You don't have access to this village"
      }
      /* const citiesRef = this.$fire.firestore.collection('village B');
                const snapshot = await citiesRef.where('shareAgreement', '==', true).get();
                if (snapshot.empty) {
                console.log('No matching documents.');
                return;
                }  

                snapshot.forEach(doc => {
                    this.listOfLoan.push(doc.data())
                }); */
      // admin : list of users
      // check table with data from private or microfinance
    },
  },
}
</script>

<style lang="scss" scoped>
</style>