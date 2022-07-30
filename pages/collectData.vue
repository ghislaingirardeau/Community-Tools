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
              label="ឈ្មោះ / (borrower Name)"
              placeholder="ឈ្មោះ / (borrower Name)"
              :rules="[(value) => !!value || 'ត្រូវបំពេញ / (Required)']"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="dataCollection.householdId"
              label="'លេខកូដគ្រួសារ/ (Family Id)'"
              placeholder="1B"
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
          <v-col cols="12" sm="6" class="px-2">
            <v-select
              v-model="dataCollection.loanSource"
              :items="loanSourceList"
              item-text="type"
              label="(Source of loan)"
              :rules="[(value) => !!value || 'ត្រូវបំពេញ / (Required)']"
              return-object
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" class="px-2">
            <v-select
              v-model="dataCollection.loanType"
              :items="['group loan','collateral loan']"
              label="/ (Type of loan)"
              :rules="[(value) => !!value || 'ត្រូវបំពេញ / (Required)']"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" class="px-2">
            <v-text-field
              v-model.number="dataCollection.loanCycle"
              label="Loan cycle"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col v-if="dataCollection.loanSource" cols="10" class="mb-4">
            <v-checkbox
              v-model="dataCollection.shareAgreement"
              dense
              label="យល់ព្រមអនុញ្ញតអោយពត៌មានរបស់ខ្ញុំយកទៅប្រើប្រាស់ក្នុងការចែករំលែកនិងការវិភាគផ្សេងៗ"
            ></v-checkbox>
          </v-col>
          <v-col cols="2">
            <v-tooltip v-model="tooltips.agreement" top min-width="300">
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon color="primary" class="tooltips--float" @click="tooltips.agreement = !tooltips.agreement" >
                    mdi-help-circle
                  </v-icon>
                </v-btn>
              </template>
              <span
                >Give my consent to share my loan details : use for private analysis
              </span
              >
            </v-tooltip>
          </v-col>
        </v-row>

        <v-row v-if="dataCollection.shareAgreement && (dataCollection.loanSource.value === 1)" align="center" class="form__block my-1 pt-3">
          <span class="px-3 form__block--title">តារាងកម្ចីសង្ខេប/ (Loan summary)</span>
          <v-col
            cols="12"
            sm="6"
            class="px-2"
          >
            <v-select
              v-model="dataMFI.bank"
              :items="bankList"
              label="ឈ្មោះស្ថាប័នឥណទាន/ (Bank)"
              :rules="[(value) => !!value || 'ត្រូវបំពេញ / (Required)']"
            ></v-select>
          </v-col>
          <v-col v-if="dataMFI.bank === 'ប្រសិនបើគ្មានឈ្មោះក្នុងបញ្ជីខាងលើសូមចុចដើម្បីសរសេរ/ (Other)'" cols="12" sm="6">
            <v-text-field
              v-model="dataMFI.newBank"
              label="ឈ្មោះស្ថាប័នឥណទាន/ (bank name)"
              placeholder="ABA"
              :rules="[(value) => !!value || 'ត្រូវបំពេញ / (Required)']"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="dataMFI.loanAmount"
              :hint=" dataMFI.loanAmount ? convertNumberInput(dataMFI.loanAmount, dataMFI.loanAmount): '' "
              persistent-hint
              label="ចំនួនប្រាក់កម្ចី/ (Principle amount)"
              type="number"
              :rules="[
                (value) => !!value || 'លេខត្រូវបំពេញ / (Required a number)',
              ]"
              :step="dataMFI.loanAmount < 100000 ? 500 : 500000"
              min="0"
              :prefix="dataMFI.loanAmount < 100000 ? '$' : '៛'"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model.number="dataMFI.loanRate"
              label="អត្រា​ការ​ប្រាក់ / (Interest Rate / month)"
              suffix="%"
              type="number"
              :rules="[
                (value) => !!value || 'លេខត្រូវបំពេញ / Required a number',
              ]"
              step="0.01"
              min="0.5"
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="6">
            <!-- duration : day / month/ year possibility -->
            <!-- TRANSLATE -->
            <v-select
              v-model="loanDuration"
              :items="['ថ្ងៃទី / days', 'ខែ / months', 'ឆ្នាំ/ years']"
              label='Duration period'
            ></v-select>
          </v-col>
          <v-col cols="6" sm="6">
            <v-text-field
              v-model.number="dataMFI.loanYear"
              label="រយៈពេល / (Duration)"
              type="number"
              :rules="[
                (value) => !!value || 'លេខត្រូវបំពេញ / Required a number',
              ]"
              min="1"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model.number="dataMFI.noPenaltyPeriod"
              label="រយៈពេលនៃការពិន័យចំពោះការសងមុនពេលកំណត់/ (Payment penalty period)"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <!-- make it as field not a number -->
            <v-text-field
              v-model.number="dataMFI.penaltyRate"
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
            sm="6"
          >
            <!-- currency ? and tooltip for translation -->
            <v-text-field
              v-model.number="dataMFI.serviceFee"
              label="ថ្លៃសេវា / (Service Fee)"
              :hint=" dataMFI.serviceFee ? convertNumberInput(dataMFI.serviceFee, dataMFI.loanAmount): '' "
              persistent-hint
              type="number"
              min="0"
              step="10000"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model.number="dataMFI.cbc"
              label="ថ្លៃឆែកសេវាឥណទាន / (CBC service)"
              :hint=" dataMFI.cbc ? convertNumberInput(dataMFI.cbc, dataMFI.loanAmount): '' "
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
            <span class="mr-3 d-block d-sm-inline date--title">ថ្ងៃខែឆ្នាំចាប់ផ្តើម :</span>
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
              :items="['01-មករា', '02-គុម្ភៈ', '03-មិនា', '04-មេសា', '05-ឧសភា', '06-មិថុនា', '07-កក្កដា', '08-សីហា', '09-កញ្ញា', '10-តុលា', '11-វិច្ចិកា', '12-ធ្នូ']"
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
            <span class="mr-3 d-block d-sm-inline date--title">ថ្ងៃខែឆ្នាំបញ្ចប់ប្រាក់កម្ចី :</span>
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
              :items="['01-មករា', '02-គុម្ភៈ', '03-មិនា', '04-មេសា', '05-ឧសភា', '06-មិថុនា', '07-កក្កដា', '08-សីហា', '09-កញ្ញា', '10-តុលា', '11-វិច្ចិកា', '12-ធ្នូ']"
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
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="dataCollection.comment"
              dense
              label="/ (Comment or difficulties)"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- FOR THE PRIVATE FORM -->
        <v-row v-if="dataCollection.shareAgreement && (dataCollection.loanSource.value === 2)" align="center" class="form__block my-1 pt-3">
          <span class="px-3 form__block--title">តារាងកម្ចីសង្ខេប/ (Loan summary)</span>
          <v-col cols="12" sm="6" class="px-2">
            <v-select
              v-model="dataPrivate.from"
              :items="['ខ្ចីពីអ្នកក្នុងសហគមន៍ខ្លួនឯង/ (inside or relative)', 'ខ្ចីពីអ្នកក្រៅសហគមន៍/ (outside not relative)']"
              label="ខ្ចីពីអ្នកណាគេ/ (From community)"
              :rules="[(value) => !!value || 'ត្រូវបំពេញ / (Required)']"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="dataPrivate.loanAmount"
              :hint=" dataPrivate.loanAmount ? convertNumberInput(dataPrivate.loanAmount, dataPrivate.loanAmount): '' "
              persistent-hint
              label="ចំនួនប្រាក់កម្ចី/ (Amount debt)"
              type="number"
              :rules="[
                (value) => !!value || 'លេខត្រូវបំពេញ / (Required a number)',
              ]"
              :step="dataPrivate.loanAmount < 100000 ? 500 : 500000"
              min="0"
              :prefix="dataPrivate.loanAmount < 100000 ? '$' : '៛'"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="px-2">
            <v-select
              v-model="dataPrivate.interestPeriod"
              :items="interestPeriodList"
              item-text="type"
              label="ប្រភេទកម្ចី/ (Period interest)"
              :rules="[(value) => !!value || 'ត្រូវបំពេញ / (Required)']"
              return-object
            ></v-select>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model.number="dataPrivate.interestRate"
              label="អត្រា​ការ​ប្រាក់ / Interest Rate"
              suffix="%"
              type="number"
              :rules="[
                (value) => !!value || 'លេខត្រូវបំពេញ / Required a number',
              ]"
              step="0.01"
              min="0.5"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="dataPrivate.totalInterest"
              label="ចំនួនការប្រាក់ក្នុងមួយឆ្នាំ / (Interest amount)"
              :hint=" dataPrivate.totalInterest ? convertNumberInput(dataPrivate.totalInterest, dataPrivate.loanAmount): '' "
              persistent-hint
              type="number"
              :rules="[
                (value) => !!value || 'លេខត្រូវបំពេញ / Required a number',
              ]"
              min="0"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model.number="dataPrivate.serviceFee"
              label="ថ្លៃសេវា/ (fees)"
              :hint=" dataPrivate.serviceFee ? convertNumberInput(dataPrivate.serviceFee, dataPrivate.loanAmount): '' "
              persistent-hint
              type="number"
              min="0"
              step="10000"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <span class="mr-3 d-block d-sm-inline date--title">ថ្ងៃខែឆ្នាំចាប់ផ្តើម :</span>
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
              :items="['01-មករា', '02-គុម្ភៈ', '03-មិនា', '04-មេសា', '05-ឧសភា', '06-មិថុនា', '07-កក្កដា', '08-សីហា', '09-កញ្ញា', '10-តុលា', '11-វិច្ចិកា', '12-ធ្នូ']"
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
            <v-text-field
              v-model="dataCollection.purpose"
              dense
              label="គោលបំណងកម្ចី/ (Loan Purpose)"
              :rules="[
                (value) => !!value || 'ត្រូវបំពេញ / (Required)',
              ]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="dataCollection.comment"
              dense
              label="/ (Comment or difficulties)"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row v-if="dataCollection.shareAgreement && (dataCollection.loanSource.value === 1)" class="form__block my-3 pt-3">
          <span class="px-3 form__block--title">តារាងសងប្រាក់/ (Repayment table)</span>
          <v-col cols="12" sm="6">
            <span style="font-size: 13px;">(Cutoff date) : 07-កក្កដា 2022</span>
            <v-text-field
              v-model.number="dataMFI.remainingLoan"
              label="ប្រាក់ដើមដែលនៅសល់/ (Principle remaining)"
              :hint=" dataMFI.remainingLoan ? convertNumberInput(dataMFI.remainingLoan, dataMFI.loanAmount): '' "
              persistent-hint
              type="number"
              :rules="[
                (value) => !!value || 'លេខត្រូវបំពេញ / Required a number',
              ]"
              min="0"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.number="dataMFI.totalInterest"
              label="ចំនួនការប្រាក់សរុប/ (Total interest)"
              :hint=" dataMFI.totalInterest ? convertNumberInput(dataMFI.totalInterest, dataMFI.loanAmount): '' "
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
          <!-- tooltips take pictures first -->
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
            <v-btn color='primary' @click="SaveLoan">រក្សាទុក / (Save)</v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn color='warning' @click="resetForm">ចាប់ផ្ដើមសារជាថ្មី / (Reset)</v-btn>
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
      tooltips: {
        agreement: false
      },
      infoMessage: {
        success: false,
        text: '',
      },
      date: {
        dayStart: new Date().getDate(),
        monthStart: '07-កក្កដា',
        yearStart: new Date().getFullYear(),
        dayEnd: new Date().getDate(),
        monthEnd: '07-កក្កដា',
        yearEnd: new Date().getFullYear() + 2
      },
      dataCollection: {
        loanSource: { type: 'ស្ថាប័នឥណទាន/ (Microfinance)', value: 1 },
        loanCycle: 0,
        loanType: '',
        village: '',
        borrowerName: '',
        householdId: '',
        dateStart: undefined,
        dateEnd: undefined,
        shareAgreement: false,
        purpose: '',
        comment: '',
        fillByname: '',
        fillByOn: undefined,
      },
      dataMFI: {
        bank: '',
        newBank: '',
        loanAmount: 0,
        loanRate: 0,
        loanYear: 0,
        serviceFee: 0,
        cbc: 0,
        remainingLoan: 0,
        totalInterest: 0,
        interestLast12Months: 0,
        penaltyRate: 0,
        noPenaltyPeriod: 0,
      },
      dataPrivate: {
        from: '',
        loanAmount: 0,
        interestPeriod: { type: 'រៀងរាល់ខែ/(Every Months)', value: 1 },
        interestLast12Months: 0,
        totalInterest: 0,
        interestRate: 0,
        serviceFee: 0,
      },
      loanDuration: 'ឆ្នាំ/ years',
      interestPeriodList: [
        { type: 'រៀងរាល់ខែ/(Every Months)', value: 1 },
        { type: 'រៀងរាល់ឆ្នាំ/(Every Year)', value: 2 },
      ],
      loanSourceList: [
        { type: 'ស្ថាប័នឥណទាន/ (Microfinance)', value: 1 },
        { type: '្នកចងការឯកជន/ (private)', value: 2 },
      ],
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
      showTipsConsent: false
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
      const dateMonthStart = parseInt(this.date.monthStart.slice(0, 2))
      startOn.setDate(this.date.dayStart)
      startOn.setMonth(dateMonthStart - 1)
      startOn.setFullYear(this.date.yearStart)

      const endOn = new Date()
      const dateMonthEnd = parseInt(this.date.monthEnd.slice(0, 2))
      endOn.setDate(this.date.dayEnd)
      endOn.setMonth(dateMonthEnd - 1)
      endOn.setFullYear(this.date.yearEnd)

      this.dataCollection.dateStart = startOn.toUTCString().substr(4, 12)
      this.dataCollection.dateEnd = endOn.toUTCString().substr(4, 12)
    },
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
    convertCurrency(data, array) {
      if (data.loanAmount < 100000) {
        array.forEach(e => {
          data[e] = data[e] * 4000
        })
      }
    },
    async SaveLoan() {
      this.dataCollection.fillByname = this.userAuth.displayName
      this.dataCollection.fillByOn = new Date().toISOString().substr(0, 16)

      if(!this.dataCollection.shareAgreement){ // if we dont have the agreement
        const res = await this.$fire.firestore
          .collection(this.dataCollection.village)
          .add(this.dataCollection)
        if (res) {
          this.infoMessage.text = 'ការបំពេញទំរង់បែបបទនេះបានបញ្ជូនដោយជោគជ័យ/ (Form send successfully)'
          this.infoMessage.success = true
          this.$refs.form.reset()
        }
      } else if (this.$refs.form.validate()) { // if we dont have the agreement && form valid
        try {
          this.convertDate() // add the date
          console.log(this.dataCollection);
          this.overlay = true
          let dataToSend = {}
          if(this.dataCollection.loanSource.value === 1) {
            this.convertCurrency(this.dataMFI, ['loanAmount', 'totalInterest', 'remainingLoan', 'serviceFee', 'cbc'])
            this.dataMFI.interestLast12Months = parseInt(this.dataMFI.remainingLoan * ((12 * this.dataMFI.loanRate) / 100))
            dataToSend = {...this.dataCollection, ...this.dataMFI}
          } else if (this.dataCollection.loanSource.value === 2) {
            this.convertCurrency(this.dataPrivate, ['loanAmount', 'totalInterest', 'serviceFee'])
            dataToSend = {...this.dataCollection, ...this.dataPrivate}
          }
          
          const res = await this.$fire.firestore
            .collection(this.dataCollection.village)
            .add(dataToSend)
          if (res) {
            const resetForm = () => {
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
            if (this.loanFiles.length > 0) { // check if there is image to upload
              const imagePaths = []
              this.loanFiles.map(async img => {
                  const fileRef = this.$fire.storage.ref(res.id).child(img.name);
                  await fileRef.put(img);
                  const singleImgPath = await fileRef.getDownloadURL();
                  imagePaths.push(singleImgPath);

                  if(imagePaths.length === this.loanFiles.length){
                      const loanRef = this.$fire.firestore
                          .collection(this.dataCollection.village)
                          .doc(res.id)
                      loanRef.update({
                          imageURL: imagePaths,
                          id: res.id,
                      })
                      resetForm()
                  }
              })
            } else { // if 0 image
              const loanRef = this.$fire.firestore
                .collection(this.dataCollection.village)
                .doc(res.id)
              loanRef.update({
                  id: res.id,
              })
              resetForm()
            }
          }
        } catch (error) {
          this.overlay = false
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
    convertNumberInput(value, amount) {
      const tostring = value.toString()
      const currency = amount < 100000 ? '$' : '៛'
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
.tooltips--float{
  position: absolute;
}
</style>