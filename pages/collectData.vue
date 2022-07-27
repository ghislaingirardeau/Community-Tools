<template>
  <div>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-form v-if="userAuth" ref="form" v-model="valid" lazy-validation>
      <v-container>
        <h3 style="display: inline-block">តារាងប្រមូលទិន្នន័យ </h3>
        <span class="text--translated">/ Data collection Form</span>
        <v-row dense>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="dataCollection.borrowerName"
              label="ឈ្មោះ / (Name)"
              placeholder="ឈ្មោះ / (Name)"
              :rules="[(value) => !!value || 'ត្រូវបំពេញ / (Required)']"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="dataCollection.householdId"
              label="'លេខកូដគ្រួសារ/ (householdId)'"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="px-2">
            <v-select
              v-model="dataCollection.village"
              :items="userAuth.village"
              label="ភូមិ/ (Village)"
              :rules="[(value) => !!value || 'ត្រូវបំពេញ / (Required)']"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" class="mb-4">
            <v-checkbox
              v-model="dataCollection.shareAgreement"
              dense
              label="យល់ព្រមអនុញ្ញតអោយពត៌មានរបស់ខ្ញុំយកទៅប្រើប្រាស់ក្នុងការចែករំលែកនិងការវិភាគផ្សេងៗ"
            ></v-checkbox>
            <span class="text--translated">(Give my consent to share my loan details : use for private analysis)</span>
          </v-col>
        </v-row>
        <v-row v-if="dataCollection.shareAgreement" align="center" class="form__block my-1">
          <span class="px-3 form__block--title">តារាងកម្ចីសង្ខេប/ (Loan summary)</span>
          <v-col cols="12" sm="3" class="px-2">
            <v-select
              v-model="dataCollection.loanType"
              :items="loanTypeList"
              label="ប្រភេទកម្ចី/ (Loan Type)"
              :rules="[(value) => !!value || 'ត្រូវបំពេញ / (Required)']"
            ></v-select>
          </v-col>
          <v-col
            cols="12"
            sm="3"
            class="px-2"
          >
            <v-select
              v-model="dataCollection.bank"
              :items="bankList"
              label="ឈ្មោះស្ថាប័នឥណទាន/ (Bank)"
              :rules="[(value) => !!value || 'ត្រូវបំពេញ / (Required)']"
            ></v-select>
          </v-col>
            <!-- FOR THE PRIVATE FORM -->
          <!-- <v-col v-else cols="12" sm="3" class="px-2">
            <v-select
              v-model="dataCollection.bank"
              :items="['ខ្ចីពីអ្នកក្នុងសហគមន៍ខ្លួនឯង/ (inside)', 'ខ្ចីពីអ្នកក្រៅសហគមន៍/ (outside)']"
              label="ខ្ចីពីអ្នកណាគេ/ (From community)"
              :rules="[(value) => !!value || 'ត្រូវបំពេញ / (Required)']"
            ></v-select>
          </v-col> -->
          <v-col v-if="dataCollection.bank === 'ប្រសិនបើគ្មានឈ្មោះក្នុងបញ្ជីខាងលើសូមចុចដើម្បីសរសេរ/ (Other)'" cols="12" sm="3">
            <v-text-field
              v-model="dataCollection.newBank"
              label="ឈ្មោះស្ថាប័នឥណទាន/ (bank name)"
              placeholder="ABA"
              :rules="[(value) => !!value || 'ត្រូវបំពេញ / (Required)']"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="3">
            <v-text-field
              id="loanAmountInput"
              v-model.number="dataCollection.loanAmount"
              :hint=" dataCollection.loanAmount ? convertNumberInput(dataCollection.loanAmount): '' "
              persistent-hint
              label="ចំនួនប្រាក់កម្ចី/ (Principle amount)"
              type="number"
              :rules="[
                (value) => !!value || 'លេខត្រូវបំពេញ / (Required a number)',
              ]"
              :step="dataCollection.loanAmount < 100000 ? 500 : 500000"
              min="0"
              :prefix="dataCollection.loanAmount < 100000 ? '$' : '៛'"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="3"
          >
            <v-text-field
              v-model.number="dataCollection.loanRate"
              label="អត្រា​ការ​ប្រាក់ / (Interest Rate / month)"
              suffix="%"
              type="number"
              :rules="[
                (value) => !!value || 'លេខត្រូវបំពេញ / Required a number',
              ]"
              step="0.01"
              min="0.5"
              :max="dataCollection.loanType === 'private' ? 10 : 3"
            ></v-text-field>
          </v-col>
          <!-- FOR THE PRIVATE FORM -->
          <!-- <v-col v-else cols="6" sm="3">
            <v-text-field
              v-model.number="dataCollection.loanRate"
              label="ចំនួនការប្រាក់ក្នុងមួយឆ្នាំ/ (Interest amount)"
              type="number"
              :rules="[
                (value) => !!value || 'លេខត្រូវបំពេញ / Required a number',
              ]"
              min="0"
            ></v-text-field>
          </v-col> -->
          <v-col cols="12" sm="2">
            <v-text-field
              v-model.number="dataCollection.loanYear"
              label="រយៈពេល / (Year)"
              type="number"
              :rules="[
                (value) => !!value || 'លេខត្រូវបំពេញ / Required a number',
              ]"
              min="1"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="3"
          >
            <v-text-field
              v-model="dataCollection.noPenaltyPeriod"
              label="រយៈពេលនៃការពិន័យចំពោះការសងមុនពេលកំណត់/ (Payment penalty period)"
              type="number"
              min="0"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="2"
          >
            <v-text-field
              v-model.number="dataCollection.penaltyRate"
              label="អត្រាពិន័យនៃប្រាក់ដើមដែលនៅសល់/ (Penalty Rate)"
              suffix="%"
              type="number"
              step="0.01"
              min="0"
              max="2.5"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="2"
          >
            <v-text-field
              v-model.number="dataCollection.serviceFee"
              label="ថ្លៃសេវា/ (Service Fee)"
              :hint=" dataCollection.serviceFee ? convertNumberInput(dataCollection.serviceFee): '' "
              persistent-hint
              type="number"
              min="0"
              step="10000"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="2"
          >
            <v-text-field
              v-model.number="dataCollection.cbc"
              label="ថ្លៃឆែកសេវាឥណទាន/ (CBC service)"
              :hint=" dataCollection.cbc ? convertNumberInput(dataCollection.cbc): '' "
              persistent-hint
              type="number"
              min="0"
              step="10000"
              required
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            sm="6"
          >
            <span class="mr-3 d-block d-sm-inline date--title">ថ្ងៃខែចាប់ផ្តើម :</span>
            <v-text-field
              v-model.number="date.dayStart"
              label="ថ្ងៃទី/ (day)"
              type="number"
              min="1"
              max='31'
              step="1"
              style="width:90px; display:inline-block;"
            ></v-text-field>
            <v-select
              v-model="date.monthStart"
              :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
              label="ខែ/ (month)"
              style="width:110px; display:inline-block;"
            ></v-select>
            <v-text-field
              v-model.number="date.yearStart"
              label="ឆ្នាំ/ (year)"
              type="number"
              placeholder="2022"
              min="2010"
              max='2050'
              step="1"
              style="width:100px; display:inline-block;"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <span class="mr-3 d-block d-sm-inline date--title">កាលបរិច្ឆេទបញ្ចប់ប្រាក់កម្ចី :</span>
            <v-text-field
              v-model.number="date.dayEnd"
              label="ថ្ងៃទី/ (day)"
              type="number"
              min="1"
              max='31'
              step="1"
              style="width:90px; display:inline-block;"
            ></v-text-field>
            <v-select
              v-model="date.monthEnd"
              :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
              label="ខែ/ (month)"
              style="width:110px; display:inline-block;"
            ></v-select>
            <v-text-field
              v-model.number="date.yearEnd"
              label="ឆ្នាំ/ (year)"
              type="number"
              placeholder="2022"
              min="2010"
              max='2050'
              step="1"
              style="width:100px; display:inline-block;"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="dataCollection.purpose"
              dense
              label="គោលបំណងកម្ចី/ (Loan Purpose)"
              :rules="[
                (value) => !!value || 'ត្រូវបំពេញ / (Required)',
              ]"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row v-if="dataCollection.shareAgreement" class="form__block my-3">
          <span class="px-3 form__block--title">តារាងសងប្រាក់/ (Repayment table)</span>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="dataCollection.remainingLoan"
              label="ប្រាក់ដើមដែលនៅសល់/ (Principle remaining)"
              :hint=" dataCollection.remainingLoan ? convertNumberInput(dataCollection.remainingLoan): '' "
              persistent-hint
              type="number"
              :rules="[
                (value) => !!value || 'លេខត្រូវបំពេញ / Required a number',
              ]"
              min="0"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="dataCollection.totalInterest"
              label="ចំនួនការប្រាក់សរុប/ (Total interest)"
              :hint=" dataCollection.totalInterest ? convertNumberInput(dataCollection.totalInterest): '' "
              persistent-hint
              type="number"
              :rules="[
                (value) => !!value || 'លេខត្រូវបំពេញ / Required a number',
              ]"
              min="0"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="dataCollection.shareAgreement" class="form__block my-1">
          <span class="px-3 form__block--title">ចុចបញ្ចូលរូបភាព/ (Photo to upload)</span>
          <v-col cols="12">
            <v-file-input
              id="LoanInput"
              multiple
              :clearable="false"
              accept="image/*"
              label="រូបភាព និង ឯកសារកម្ចី/ (Documents)"
              @change="getFilesLoan"
            ></v-file-input>
          </v-col>
          <v-col v-for="(item, i) of loanFilesURL" :key="item" cols="4" sm="3" >
            <v-icon color="warning" @click="removeImage(i)">
              mdi-close-circle-outline
            </v-icon>
            <v-img
                :lazy-src="item"
                max-height="150"
                max-width="250"
                :src="item"
            ></v-img>
          </v-col>
        </v-row>

        <v-row > 
          <v-col cols="12">
            <v-btn color='primary' @click="SaveLoan">រក្សាទុក/ (Save)</v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn color='warning' @click="resetForm">ចាប់សារជាថ្មី/ (Reset)</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <log-in-form v-else @overlay-active="overlayShow" />

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
      date: {
        dayStart: new Date().getDate(),
        monthStart: new Date().getMonth() + 1,
        yearStart: new Date().getFullYear(),
        dayEnd: new Date().getDate(),
        monthEnd: new Date().getMonth() + 1,
        yearEnd: new Date().getFullYear() + 2
      },
      dataCollection: {
        loanType: 'ស្ថាប័នឥណទាន/ (Microfinance)',
        village: '',
        bank: 'មីក្រូ. ប្រាសាក់ ម.ក/ (Prasac)',
        newBank: '',
        borrowerName: 'ron',
        householdId: '1A',
        loanAmount: 2500,
        loanRate: 1.6,
        loanYear: 2,
        serviceFee: 0,
        cbc: 0,
        dateStart: undefined,
        dateEnd: undefined,
        remainingLoan: 1000,
        totalInterest: 200,
        interestLast12Months: 0,
        penaltyRate: 0,
        noPenaltyPeriod: 0,
        shareAgreement: false,
        purpose: 'tractors',
        fillByname: '',
        fillByOn: undefined,
      },
      loanTypeList: ['ស្ថាប័នឥណទាន/ (Microfinance)', 'អ្នកចងការឯកជន/ (private)'],
      bankList: [
        'មីក្រូ. មហានគរ ម.ក/ (Mohanokor)',
        'អិលអូអិលស៊ី/ (LOLC)',
        'មីក្រូ. អេអឹមខេ/ (AMK)',
        'មីក្រូ. ប្រាសាក់ ម.ក/ (Prasac)',
        'ធនាគារ ស្ថាបនា/ (Sathapana)',
        'ធនាគារ ហត្ថា ម.ក/ (Hattha)',
        'មីក្រូ. ហ្វូណន/ (Funan)',
        'ធនាគារ ភីលីព/ (Phillip)',
        'ធនាគារ អ៊ូរី/ (Woori)',
        'ប្រសិនបើគ្មានឈ្មោះក្នុងបញ្ជីខាងលើសូមចុចដើម្បីសរសេរ/ (Other)',
      ],
      menu: false,
      loanFiles: [],
      loanFilesURL: [],
    }
  },
  computed: {
    ...mapState(['userAuth']),
  },
  watch: {
    'userAuth.village': {
      handler(after, before) {
        this.dataCollection.village = this.userAuth.village[0]
      },
    },
  },
  methods: {
    convertDate() {
      const startOn = new Date()
      startOn.setDate(this.date.dayStart)
      startOn.setMonth(this.date.monthStart - 1)
      startOn.setFullYear(this.date.yearStart)

      const endOn = new Date()
      endOn.setDate(this.date.dayEnd)
      endOn.setMonth(this.date.monthEnd - 1)
      endOn.setFullYear(this.date.yearEnd)

      this.dataCollection.dateStart = startOn.toUTCString().substr(4, 12)
      this.dataCollection.dateEnd = endOn.toUTCString().substr(4, 12)
    },
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
        const totalInterest = this.dataCollection.loanAmount * ((getMonthDifference(now, parseDate) * this.dataCollection.loanRate) / 100) 
        this.dataCollection.totalInterest = parseInt(totalInterest)
        return parseInt(this.dataCollection.remainingLoan * ((12 * this.dataCollection.loanRate) / 100))
    }, */
    getFilesLoan() {
      this.loanFiles = []
      this.loanFilesURL = []
      this.loanFiles.push(...Object.values(document.querySelector('#LoanInput').files))
      this.loanFiles.forEach(element => {
        this.loanFilesURL.push(URL.createObjectURL(element))
      });
    },
    removeImage(index) {
      this.loanFiles.splice(index, 1);
      this.loanFilesURL.splice(index, 1);
    },
    overlayShow(payload) {
      this.overlay = payload.message
    },
    async SaveLoan() {
      this.dataCollection.fillByname = this.userAuth.displayName
      this.dataCollection.fillByOn = new Date().toISOString().substr(0, 16)

      if(!this.dataCollection.shareAgreement){
        const res = await this.$fire.firestore
          .collection(this.dataCollection.village)
          .add(this.dataCollection)
        if (res) {
          this.infoMessage.text = 'ការបំពេញទំរង់បែបបទនេះបានបញ្ជូនដោយជោគជ័យ/ (Form send successfully)'
          this.infoMessage.success = true
          this.$refs.form.reset()
        }
      } else if (this.$refs.form.validate()) {
        try {
          this.convertDate()
          if (this.dataCollection.loanAmount < 100000) {
            this.dataCollection.loanAmount =
              this.dataCollection.loanAmount * 4000
            this.dataCollection.totalInterest = 
              this.dataCollection.totalInterest * 4000
            this.dataCollection.remainingLoan = 
              this.dataCollection.remainingLoan * 4000
            this.dataCollection.serviceFee = 
              this.dataCollection.serviceFee * 4000
            this.dataCollection.cbc = 
              this.dataCollection.cbc * 4000
          }
          this.overlay = true
          this.dataCollection.interestLast12Months = parseInt(this.dataCollection.remainingLoan * ((12 * this.dataCollection.loanRate) / 100))
          const res = await this.$fire.firestore
            .collection(this.dataCollection.village)
            .add(this.dataCollection)
          if (res) {
            const imagePaths = []
            console.log(this.loanFiles)
            this.loanFiles.map(async img => {
                const fileRef = this.$fire.storage.ref(res.id).child(img.name);
                await fileRef.put(img);
                const singleImgPath = await fileRef.getDownloadURL();
                imagePaths.push(singleImgPath);

                if(imagePaths.length === this.loanFiles.length){
                    console.log("got all paths here now: ", imagePaths);
                    const loanRef = this.$fire.firestore
                        .collection(this.dataCollection.village)
                        .doc(res.id)
                    loanRef.update({
                        imageURL: imagePaths,
                        id: `${res.id}/${Date.now()}`,
                    })
                    this.overlay = false
                    this.sheet = true
                    setTimeout(() => {
                      this.sheet = false
                      this.$refs.form.reset()
                      this.loanFiles = []
                      this.loanFilesURL = []
                    }, 2000)
                    this.infoMessage.text = 'ការបំពេញទំរង់បែបបទនេះបានបញ្ជូនដោយជោគជ័យ/ (Form send successfully)'
                    this.infoMessage.success = true
                }
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
        this.infoMessage.text = 'ត្រូវត្រឡប់ទៅបំពេញប្រអប់ដែលភ្លេចបំពេញ/ (Fill all the required form)'
        this.infoMessage.success = false
      }
    },
    resetForm(){
      this.$refs.form.reset()
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
      // CHANGE A VALUE : this.$fireModule.firestore.FieldValue.increment(50)
      // const res = await this.$fire.firestore.collection('debtVillage').doc('LA').delete();
    },
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
  &--title {
    background-color: #121212;
    color: white;
    font-style: italic;
    font-weight: bold;
    position: absolute;
    top: -13px;
    left: 5px;
  }
}
.date--title{
  font-size: 12px;
  color: white;
}
.text--translated{
  font-size: 14px;
  font-style: italic;
}
</style>