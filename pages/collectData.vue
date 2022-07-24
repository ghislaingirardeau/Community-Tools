<template>
  <div>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-form v-if="userAuth" ref="form" v-model="valid" lazy-validation>
      <v-container>
        <h3>Data collection Form</h3>
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="dataCollection.borrowerName"
              label="សដថដសថរ៊ / (Name)"
              placeholder="សដថដសថរ៊"
              :rules="[(value) => !!value || 'Required']"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="px-2">
            <v-select
              v-model="dataCollection.village"
              :items="userAuth.village"
              label="Village"
              :rules="[(value) => !!value || 'Required']"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-checkbox
              v-model="dataCollection.shareAgreement"
              dense
              label="Give my consent to share my loan details : use for private analysis"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" sm="6">
            <v-checkbox
              v-model="dataCollection.consentShareData"
              dense
              label="Give my consent to share the amount, rate and fee for the simulator database"
            ></v-checkbox>
          </v-col>
        </v-row>
        <v-row v-if="dataCollection.shareAgreement" class="form__block my-1">
            <span class="px-3 form__block--title"
              >Header loan data</span
            >
          <v-col cols="6" sm="4" class="px-2">
            <v-select
              v-model="dataCollection.loanType"
              :items="loanTypeList"
              label="Loan Type"
              :rules="[(value) => !!value || 'Required']"
            ></v-select>
          </v-col>
          <v-col
            v-if="dataCollection.loanType === 'Microfinance'"
            cols="6"
            sm="4"
            class="px-2"
          >
            <v-select
              v-model="dataCollection.bank"
              :items="bankList"
              label="Bank"
              :rules="[(value) => !!value || 'Required']"
            ></v-select>
          </v-col>
          <v-col v-else cols="6" sm="4" class="px-2">
            <v-select
              v-model="dataCollection.bank"
              :items="['inside', 'outside']"
              label="From community"
              :rules="[(value) => !!value || 'Required']"
            ></v-select>
          </v-col>
          <v-col v-if="dataCollection.bank === 'Other'" cols="6" sm="4">
            <v-text-field
              v-model="dataCollection.newBank"
              label="bank name / (Name)"
              placeholder="ABA"
              :rules="[(value) => !!value || 'Required']"
            ></v-text-field>
          </v-col>

          <v-col cols="6" sm="4">
            <v-text-field
              id="loanAmountInput"
              v-model.number="dataCollection.loanAmount"
              :hint="convertNumberInput(dataCollection.loanAmount)"
              persistent-hint
              label="Principle amount"
              type="number"
              :rules="[(value) => !!value || 'Required a number']"
              :step="dataCollection.loanAmount < 100000 ? 500 : 500000"
              min="0"
              :prefix="dataCollection.loanAmount < 100000 ? '$' : '៛'"
            ></v-text-field>
          </v-col>
          <v-col
            v-if="dataCollection.loanType === 'Microfinance'"
            cols="6"
            sm="2"
          >
            <v-text-field
              v-model.number="dataCollection.loanRate"
              label="Interest Rate / month"
              suffix="%"
              type="number"
              :rules="[(value) => !!value || 'Required a number']"
              step="0.01"
              min="0.5"
              :max="dataCollection.loanType === 'private' ? 10 : 3"
            ></v-text-field>
          </v-col>
          <v-col v-else cols="6" sm="2">
            <v-text-field
              v-model.number="dataCollection.loanRate"
              label="Interest amount"
              type="number"
              :rules="[(value) => !!value || 'Required a number']"
              min="0"
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="1">
            <v-text-field
              v-model.number="dataCollection.loanYear"
              label="Year"
              type="number"
              :rules="[(value) => !!value || 'Required a number']"
              min="1"
            ></v-text-field>
          </v-col>
          <v-col
            v-if="dataCollection.loanType === 'Microfinance'"
            cols="6"
            sm="2"
          >
            <v-text-field
              v-model="dataCollection.noPenaltyPeriod"
              label="Payment penalty period"
              type="number"
              min="0"
            ></v-text-field>
          </v-col>
          <v-col
            v-if="dataCollection.loanType === 'Microfinance'"
            cols="6"
            sm="2"
          >
            <v-text-field
              v-model.number="dataCollection.penaltyRate"
              label="Penalty Rate"
              suffix="%"
              type="number"
              step="0.01"
              min="0"
              max="2.5"
            ></v-text-field>
          </v-col>
          <v-col
            v-if="dataCollection.loanType === 'Microfinance'"
            cols="6"
            sm="2"
          >
            <v-text-field
              v-model.number="dataCollection.serviceFee"
              label="Service Fee"
              type="number"
              min="0"
              step="10000"
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="5">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="dataCollection.dateStart"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="dataCollection.dateStart"
                  label="Started Loan"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dataCollection.dateStart"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="updateDate"> OK </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6" sm="4">
            <v-text-field
              :value="endLoan"
              label="Ended Loan"
              prepend-icon="mdi-calendar-remove-outline"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="dataCollection.purpose"
              dense
              label="Loan Purpose"
              :rules="[(value) => !!value || 'Required a number']"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="dataCollection.shareAgreement" class="form__block my-3">
            <span class="px-3 form__block--title"
              >Data from Repayment table</span
            >
          <v-col cols="6" sm="4">
            <v-text-field
              v-model="dataCollection.remainingLoan"
              label="Principle remaining"
              type="number"
              :rules="[(value) => !!value || 'Required a number']"
              min="0"
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="4">
            <v-text-field
              v-model="dataCollection.interestRemain"
              label="Interest amount remaining"
              type="number"
              :rules="[(value) => !!value || 'Required a number']"
              min="0"
            ></v-text-field>
          </v-col>
          <v-col cols="8" sm="4">
            <v-text-field
              v-model="dataCollection.interestLast12Months"
              label="Interest amount last 12 months"
              type="number"
              :rules="[(value) => !!value || 'Required a number']"
              min="0"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="dataCollection.shareAgreement" class="form__block my-1">
            <span class="px-3 form__block--title"
              >Photo to upload</span
            >
          <v-col cols="12" sm="6">
            <v-file-input
              id="photoInput"
              accept="image/*"
              label="Borrower Picture"
              @change="getFilePhoto"
            ></v-file-input>
            <img v-show="photo.file" id="showPhotoUpload" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-file-input accept="image/*" label="Loan Picture"></v-file-input>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn @click="SendLoan">Save</v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn @click="writeFB">write FS</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <sign-form v-else :sign-type="true" @overlay-active="overlayShow" />
    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" height="60px">
        <div
          class="py-2"
          :class="{
            'message--success': infoMessage.success,
            'message--failed': !infoMessage.success,
          }"
        >
          {{ infoMessage.text }}
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CollectPage',
  data() {
    return {
      overlay: false,
      valid: true,
      sheet: false,
      infoMessage: {
        success: false,
        text: '',
      },
      dataCollection: {
        loanType: 'Microfinance',
        village: '',
        bank: 'អិលអូអិលស៊ី',
        newBank: '',
        borrowerName: 'ron',
        loanAmount: 2500,
        loanRate: 1.6,
        loanYear: 2,
        serviceFee: 0,
        dateStart: new Date().toISOString().substr(0, 10),
        remainingLoan: 1000,
        interestRemain: 0,
        interestLast12Months: 0,
        penaltyRate: 0,
        noPenaltyPeriod: 0,
        consentShareData: false,
        shareAgreement: false,
        purpose: '',
        fillByname: '',
        fillByOn: undefined,
      },
      loanTypeList: ['Microfinance', 'private'],
      bankList: [
        'មីក្រូ. មហានគរ ម.ក',
        'អិលអូអិលស៊ី',
        'មីក្រូ. អេអឹមខេ',
        'មីក្រូ. ប្រាសាក់ ម.ក',
        'ធនាគារ ស្ថាបនា',
        'ហត្ថាកសិករ',
        'ធនាគារ ហត្ថា ម.ក',
        'ធនាគារ ហត្ថ ម.ក',
        'មីក្រូ. ហ្វូណន',
        'ធនាគារ ភីលីព',
        'មីក្រូ ដាប់ប៊ែលយូប៊ី',
        'មីក្រូ. ដាប់ប៉ែលយូប៊ី',
        'Other',
      ],
      menu: false,
      photo: {
        file: undefined,
        name: '',
        metadata: {
          contentType: undefined,
        },
      },
    }
  },
  computed: {
    ...mapState(['userAuth']),
    endLoan() {
      const parseDate = new Date(this.dataCollection.dateStart)
      parseDate.setMonth(
        parseDate.getMonth() + this.dataCollection.loanYear * 12
      )
      return parseDate.toISOString().substr(0, 10)
    },
  },
  watch: {
    'userAuth.village': {
      handler(after, before) {
        this.dataCollection.village = this.userAuth.village[0]
      },
    },
  },
  methods: {
    /* calculateRemainingInterest() {
                const getMonthDifference = (startDate, endDate) => {
                    return (
                        endDate.getMonth() -
                        startDate.getMonth() +
                        12 * (endDate.getFullYear() - startDate.getFullYear())
                    )
                }
                const parseDate = new Date(this.dataCollection.dateStart)
                parseDate.setMonth(parseDate.getMonth() + (this.dataCollection.loanYear * 12))
                const now = new Date()
                const interestRemain = this.dataCollection.loanAmount * ((getMonthDifference(now, parseDate) * this.dataCollection.loanRate) / 100) 
                this.dataCollection.interestRemain = parseInt(interestRemain)
                this.dataCollection.interestLast12Months = parseInt(this.dataCollection.loanAmount * ((12 * this.dataCollection.loanRate) / 100))
            }, */
    getFilePhoto() {
      this.photo.file = document.querySelector('#photoInput').files[0]
      if (this.photo.file) {
        this.photo.name =
          Date.now() +
          '-' +
          this.dataCollection.borrowerName +
          '-' +
          this.photo.file.name
        this.photo.metadata.contentType = this.photo.file.type
        const image = document.querySelector('#showPhotoUpload')
        image.src = URL.createObjectURL(this.photo.file)
      }
    },
    overlayShow(payload) {
      this.overlay = payload.message
    },
    updateDate() {
      this.$refs.menu.save(this.dataCollection.dateStart)
    },
    async SendLoan() {
      if (this.$refs.form.validate()) {
        try {
          if (this.dataCollection.loanAmount < 100000) {
            this.dataCollection.loanAmount =
              this.dataCollection.loanAmount * 4050
          }
          /* this.calculateRemainingInterest() */
          this.overlay = true
          this.dataCollection.fillByname = this.userAuth.displayName
          this.dataCollection.dateEnd = this.endLoan
          this.dataCollection.fillByOn = new Date().toISOString().substr(0, 16)
          const res = await this.$fire.firestore
            .collection(this.dataCollection.village)
            .add(this.dataCollection)
          if (res) {
            const upload = this.$fire.storage
              .ref(res.id)
              .child(this.photo.name)
              .put(this.photo.file, this.photo.metadata)
            upload
              .then((snapshot) => snapshot.ref.getDownloadURL())
              .then((url) => {
                const loanRef = this.$fire.firestore
                  .collection(this.dataCollection.village)
                  .doc(res.id)
                loanRef.update({
                  imageURL: url,
                  id: `${res.id}/${Date.now()}`,
                })
                this.overlay = false
                this.sheet = true
                setTimeout(() => {
                  this.sheet = false
                  this.$refs.form.reset()
                  this.photo.file = undefined
                }, 2000)
                this.infoMessage.text = 'Form send successfully'
                this.infoMessage.success = true
              })
          }
        } catch (error) {
          console.log(error, 'Error during the sending process')
        }
      } else {
        this.sheet = true
        setTimeout(() => {
          this.sheet = false
        }, 3000)
        this.infoMessage.text = 'Fill all the required form'
        this.infoMessage.success = false
      }
    },
    convertNumberInput(value) {
      const tostring = value.toString()
      const currency = this.dataCollection.loanAmount < 100000 ? '$' : '៛'
      if (tostring.length > 3 && tostring.length < 7) {
        const a = tostring.slice(-3)
        const b = tostring.slice(0, -3)
        return b.concat(' ', a, ' ', currency)
      } else if (tostring.length > 6) {
        const a = tostring.slice(-3)
        const b = tostring.slice(0, -6)
        const c = tostring.slice(-6, -3)
        return b.concat(' ', c, ' ', a, ' ', currency)
      } else {
        return `${tostring} ${currency}`
      }
    },
    async writeFB() {
      // UPDATE
      const cityRef = this.$fire.firestore
        .collection('village A')
        .doc('66Je1VKKUCy1emDC2yP2')
      const res = await cityRef.update({
        imageURL: 'image URL here',
      })
      console.log(res)
      // CHANGE A VALUE : this.$fireModule.firestore.FieldValue.increment(50)
      // DELETE
      // const res = await this.$fire.firestore.collection('debtVillage').doc('LA').delete();
    },

    // watch loantype = if private, change v-model accordingly
    // if not agree = simple form
  },
}
</script>

<style lang="scss" scoped>
.message--success {
  color: green;
  font-weight: bold;
}
.message--failed {
  color: red;
  font-weight: bold;
}
#showPhotoUpload {
  width: 150px;
  height: 150px;
}
.form__block {
  border: 2px solid gray;
  position: relative;
  &--title{
    background-color: white;
    font-style: italic;
    font-weight: bold;
    position: absolute;
    top: -13px;
    left: 5px;
  }
}
</style>