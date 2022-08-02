<template>
  <v-card>
    <v-card-title>
      ភូមិ : {{ villageDatas[0].village }}
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="datasHeaders"
        :items="villageDatas"
        hide-default-footer
        disable-pagination
        :expanded.sync="expanded"
        item-key="id"
        show-expand
        :search="search"
        :single-expand="false"
      >
        <template #header="{}" >
          <thead>
            <tr>
              <th v-for="(i, l) in subheader" :key="l">{{i}}</th>
            </tr>
          </thead>
        </template>
        <template #expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="py-2">
            <div class="d-flex flex-row">
              <div v-for="i in item.imageURL" :key="i">
                <v-img
                    :src="i"
                    :lazy-src="i"
                    max-height="90"
                    max-width="90"
                    @click="showPicture(i)"
                ></v-img>
              </div>
              
              <v-card>
                <v-card-subtitle style="color: rgb(0, 255, 149);">
                  Purpose
                </v-card-subtitle>
                <v-card-text>
                  {{ item.purpose }}
                </v-card-text>
              </v-card>

              <v-card>
                <v-card-subtitle style="color: rgb(0, 255, 149);">
                  Comment
                </v-card-subtitle>
                <v-card-text>
                  {{item.comment}}
                </v-card-text>
              </v-card>
            </div>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-text class="table-border">
      <v-simple-table dense>
        <template #default>
          <thead>
            <tr>
              <th class="text-left" style="color: red">Total Loan</th>
              <th class="text-left" style="color: red">
                Total Interest Remain
              </th>
              <th class="text-left" style="color: red">
                Total Interest last 12 months
              </th>
              <th class="text-left" style="color: red">Total Fee</th>
              <th class="text-left" style="color: red">Total Cbc</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in totalDatas" :key="item.loan">
              <td style="color: red">{{ item.loan }}</td>
              <td style="color: red">{{ item.totalInterest }}</td>
              <td style="color: red">{{ item.interestLastOneYear }}</td>
              <td style="color: red">{{ item.fee }}</td>
              <td style="color: red">{{ item.cbc }}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    villageDatas: {
      type: Array,
      default: Array,
    },
    totalDatas: {
      type: Array,
      default: Array,
    }
  },
  data() {
    return {
      expanded: [],
      search: '',
      subheader: ['', 'Name', 'House Id', 'Start', 'End', 'Duration', 'Loan type', 'Loan cycle', 'MFI',  'Amount', 
      'Remaining loan', 'Total interest', 'Interest Rate monthly', 'Last 12 months interest', 'Fee', 'Cbc', 
      'Penalty period', 'Penalty Rate', 'Fill on', 'Fill by'],
      datasHeaders: [
        {
          text: 'ឈ្មោះ',
          align: 'start',
          sortable: false,
          value: 'borrowerName', 
          width: '100px'
        },
        { text: 'លេខកូដគ្រួសារ', value: 'householdId', width: '20px'},
        { text: 'ខែឆ្នាំចាប់ផ្តើម', value: 'dateStart', width: '100px'},
        { text: 'ខែឆ្នាំបញ្ចប់ប្រាក់កម្ចី', value: 'dateEnd', width: '100px'},
        { text: 'ឯកតានៃរយៈពេលខ្ចី', value: 'loanYear' },
        { text: '្រភេទកម្ចី', value: 'loanType', width: '140px' },
        { text: 'កម្ចីទី/វគ្គទី', value: 'loanCycle', width: '20px' },
        { text: 'ឈ្មោះស្ថាប័នឥណទាន', value: 'bank', width: '150px' },
        { text: 'ចំនួនប្រាក់កម្ចី', value: 'loanAmount', width: '130px' },
        { text: 'ប្រាក់ដើមដែលនៅសល់', value: 'remainingLoan', width: '130px' },
        { text: 'ចំនួនការប្រាក់សរុប', value: 'totalInterest', width: '130px' },
        { text: 'អត្រា​ការ​ប្រាក់', value: 'loanRate' },
        { text: 'ចំនួនការប្រាក់សម្រាប់រយៈពេល 12ខែ', value: 'interestLast12Months', width: '130px' },
        { text: 'ថ្លៃសេវា', value: 'serviceFee', width: '100px' },
        { text: 'ថ្លៃឆែកសេវាឥណទាន', value: 'cbc', width: '100px' },
        { text: 'Penalty Period', value: 'noPenaltyPeriod' },
        { text: 'Penalty Rate', value: 'penaltyRate' },
        { text: 'Collect On', value: 'fillByOn' },
        { text: 'Collect By', value: 'fillByname' },
      ],
    }
  },
  methods: {
    showPicture(i) {
      console.log(i);
    },
  },
}
</script>

<style lang="scss" scoped>
.table-photo {
  width: 90px;
  height: 90px;
}
.table-border {
  border-top: 2px solid grey;
}
</style>