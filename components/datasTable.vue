<template>
  <v-card>
    <v-card-title>
      ភូមិ / village: {{ villageDatas[0].village }}
      
      <v-icon v-show="!printMedia && $vuetify.breakpoint.width > 1200" color="primary" class="ml-3" @click="printTable">
        mdi-printer
      </v-icon>

      <v-switch
        v-show="!printMedia"
        v-model="switchExpand"
        label="Expand all"
        class="mx-3"
        @change="expandAll"
      ></v-switch>

      <modal-image
        :dialog="dialog"
        :image-src="imgSrcDisplay"
        @close-modal="closeModal"
      />
      <v-spacer></v-spacer>

      <v-text-field
        v-show="!printMedia"
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
        :show-expand='!printMedia'
        :search="search"
        :single-expand="false"
      >
        <template #header="{}">
          <thead>
            <tr>
              <th v-for="(i, l) in subheader" :key="l">{{ i }}</th>
            </tr>
          </thead>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon small @click="editItemModal(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItemModal(item)"> mdi-delete </v-icon>
        </template>
        <template #expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="py-2">
            <div class="d-flex flex-row text-center">
              <v-card v-show="printMedia && sourceMfi" outlined>
                <v-card-subtitle >
                  Loan type
                </v-card-subtitle>
                <v-card-text>
                  {{ item.loanType }}
                </v-card-text>
              </v-card>
              <v-card v-show="printMedia && sourceMfi" outlined>
                <v-card-subtitle >
                  loan Cycle
                </v-card-subtitle>
                <v-card-text>
                  {{ item.loanCycle }}
                </v-card-text>
              </v-card>
              <v-card v-show="printMedia && sourceMfi" outlined>
                <v-card-subtitle >
                  Penalty Period
                </v-card-subtitle>
                <v-card-text>
                  {{ item.noPenaltyPeriod }}
                </v-card-text>
              </v-card>
              <v-card v-show="printMedia && sourceMfi" outlined>
                <v-card-subtitle >
                  Penalty rate
                </v-card-subtitle>
                <v-card-text>
                  {{ item.penaltyRate }}
                </v-card-text>
              </v-card>

              <v-card outlined>
                <v-card-subtitle>
                  គោលបំណងកម្ច / Purpose
                </v-card-subtitle>
                <v-card-text>
                  {{ item.purpose }}
                </v-card-text>
              </v-card>

              <v-card v-if="item.comment && item.comment.length > 0" outlined>
                <v-card-subtitle>
                  Comment
                </v-card-subtitle>
                <v-card-text>
                  {{ item.comment }}
                </v-card-text>
              </v-card>

              <div
                v-for="i in item.imageURL"
                :key="i"
                class="mx-1"
                style="border: 2px solid rgb(0, 255, 149)"
              >
                <v-btn height="100" width="100" @click="showPicture(i)">
                  <v-img
                    :src="i"
                    :lazy-src="i"
                    max-height="90"
                    max-width="90"
                  ></v-img>
                </v-btn>
              </div>

            </div>
          </td>
        </template>
      </v-data-table>
    </v-card-text>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this loan?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDelete = false"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="deleteItem"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-if="editedItem" v-model="dialogEdit" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col v-for="(i, l) in datasEditable" :key="l" cols="12" sm="6" md="4" >
                <v-text-field
                  v-model="editedItem[i]"
                  :label="i"
                  :hint="numberHelper(editedItem[i])"
                  persistent-hint
                  @change="dataToUpdate(i)"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-text v-if="updateMessage.text">
          <span :class="{successMessage : updateMessage.success, failMessage : !updateMessage.success}">{{updateMessage.text}}</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelEditing"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="saveEditItem"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  props: {
    villageDatas: {
      type: Array,
      default: Array,
    },
    sourceMfi: {
      type: Boolean,
      default: Boolean,
    },
  },
  data() {
    return {
      expanded: [],
      switchExpand: false,
      search: '',
      subheader: undefined,
      datasHeaders: undefined,
      dialog: false,
      imgSrcDisplay: undefined,
      dialogDelete: false,
      dialogEdit: false,
      editedItem : undefined,
      itemToDelete: {},
      datasEditable: ['householdId', 'dateStart', 'dateEnd', 'loanYear', 'loanCycle', 'loanAmount', 'remainingLoan', 'totalInterest', 'serviceFee', 
        'cbc', 'loanRate', 'noPenaltyPeriod', 'penaltyRate'
      ],
      itemsToUpdate : [],
      updateMessage: {
        text: undefined,
        success: false
      },
      printMedia: false,
    }
  },
  mounted () {
    if (this.sourceMfi) {
      this.datasHeaders = [
        {
          text: 'ឈ្មោះ',
          align: 'start',
          sortable: false,
          value: 'borrowerName',
          width: '100px',
        },
        { text: 'លេខកូដគ្រួសារ', value: 'householdId', width: '20px' },
        { text: 'ខែឆ្នាំចាប់ផ្តើម', value: 'dateStart', width: '50px' },
        { text: 'ខែឆ្នាំបញ្ចប់ប្រាក់កម្ចី', value: 'dateEnd', width: '50px' },
        { text: 'ឯកតានៃរយៈពេលខ្ចី', value: 'duration', width: '50px' },
        { text: 'ឯកតានៃរយៈពេលខ្ចី', value: 'loanYear', width: '50px' },
        { text: '្រភេទកម្ចី', value: 'loanType', width: '120px' },
        { text: 'កម្ចីទី/វគ្គទី', value: 'loanCycle', width: '20px' },
        { text: 'ឈ្មោះស្ថាប័នឥណទាន', value: 'bank', width: '120px' },
        { text: 'ចំនួនប្រាក់កម្ចី', value: 'loanAmount', width: '120px' },
        { text: 'ប្រាក់ដើមដែលនៅសល់', value: 'remainingLoan', width: '120px' },
        { text: 'ចំនួនការប្រាក់សរុប', value: 'totalInterest', width: '120px' },
        { text: 'អត្រា​ការ​ប្រាក់', value: 'loanRate', width: '50px' },
        {
          text: 'ចំនួនការប្រាក់សម្រាប់រយៈពេល 12ខែ',
          value: 'interestLast12Months',
          width: '120px',
        },
        { text: 'ថ្លៃសេវា', value: 'serviceFee', width: '120px' },
        { text: 'ថ្លៃឆែកសេវាឥណទាន', value: 'cbc', width: '120px' },
        { text: 'Penalty Period', value: 'noPenaltyPeriod' },
        { text: 'Penalty Rate', value: 'penaltyRate' },
        { text: 'Collect On', value: 'fillByOn' },
        { text: 'Collect By', value: 'fillByname' },
        { text: 'actions', value: 'actions' },
      ]
      this.subheader = [
        '',
        'Name',
        'Id',
        'Start',
        'End',
        'Year',
        'Duration',
        'Loan type',
        'Loan cycle',
        'MFI',
        'Amount',
        'Remaining loan',
        'Total interest',
        'Interest Rate monthly',
        'Last 12 months interest',
        'Fee',
        'Cbc',
        'Penalty period',
        'Penalty Rate',
        'Fill on',
        'Fill by',
      ]
      this.datasEditable = ['householdId', 'dateStart', 'dateEnd', 'loanYear', 'loanCycle', 'loanAmount', 'remainingLoan', 'totalInterest', 'serviceFee', 
        'cbc', 'loanRate', 'noPenaltyPeriod', 'penaltyRate'
      ]

    } else {
      this.datasHeaders = [
        {
          text: 'ឈ្មោះ',
          align: 'start',
          sortable: false,
          value: 'borrowerName',
          width: '150px',
        },
        { text: 'លេខកូដគ្រួសារ', value: 'householdId', width: '20px' },
        { text: 'ខែឆ្នាំចាប់ផ្តើម', value: 'dateStart', width: '100px' },
        { text: '្រភេទកម្ចី', value: 'loanType', width: '140px' },
        { text: 'កម្ចីទី/វគ្គទី', value: 'loanCycle', width: '20px' },
        { text: 'ខ្ចីពីអ្នកណាគេ', value: 'from', width: '150px' },
        { text: 'ចំនួនប្រាក់កម្ចី', value: 'loanAmount', width: '130px' },
        { text: 'ចំនួនការប្រាក់សរុប', value: 'totalInterest', width: '130px' },
        { text: '្រភេទនៃការសងប្រាក់ការ', value: 'interestPeriod.type', width: '130px' }, 
        { text: 'អត្រា​ការ​ប្រាក់', value: 'loanRate', width: '100px' },
        { text: 'ថ្លៃសេវា', value: 'serviceFee', width: '100px' },
        { text: 'Collect On', value: 'fillByOn' },
        { text: 'Collect By', value: 'fillByname' },
        { text: 'actions', value: 'actions' },
      ]
      this.subheader = [
        '',
        'Name',
        'House Id',
        'Start',
        'Loan type',
        'Loan cycle',
        'From',
        'Amount',
        'Total interest',
        'Interest Period',
        'Interest Rate',
        'Fee',
        'Fill on',
        'Fill by',
      ]
      this.datasEditable = ['householdId', 'dateStart', 'loanCycle', 'loanAmount', 'totalInterest', 'serviceFee', 
        'loanRate'
      ]
    }
  },
  methods: {
    numberHelper(i) {
      return i && /^[0-9]+$/.test(i) && i.length > 4 ? 
        this.convertToNumber(i) : ''
    },
    showPicture(src) {
      this.imgSrcDisplay = src
      this.dialog = true
    },
    closeModal(payload) {
      this.dialog = payload
      this.imgSrcDisplay = undefined
    },
    expandAll() {
      this.switchExpand ? this.expanded = this.villageDatas : this.expanded = []
    },
    editItemModal(item) {
      this.dialogEdit = true
      this.editedItem = Object.assign({}, item)
      const convertToNumber = (params) => {
        if (typeof this.editedItem[params] === 'string' && this.editedItem[params].includes('៛')) {
          this.editedItem[params] = parseInt(this.editedItem[params].replaceAll(',', ''))
        } else if (typeof this.editedItem[params] === 'string' && this.editedItem[params].includes('%')) {
          this.editedItem[params] = parseFloat(this.editedItem[params])
        }
      }
      this.datasEditable.forEach(e => {
        convertToNumber(e)
      })
    },
    saveEditItem() {
      const dataToUpdate = {}
      this.itemsToUpdate.forEach(elt => {
        dataToUpdate[elt] = this.editedItem[elt]
      })
      const loanRef = this.$fire.firestore
          .collection(this.editedItem.village)
          .doc(this.editedItem.id)
      loanRef.update(dataToUpdate)
        .then((result) => {
          this.updateMessage.text = "Updated successfully"
          this.updateMessage.success = true

          setTimeout(() => {
            this.dialogEdit = false
            this.editedItem = undefined
            this.updateMessage.text = undefined
            this.updateMessage.success = false
            this.$emit('refresh-table', this.sourceMfi)
          }, 1000);
        }).catch((err) => {
          this.updateMessage.text = err
          this.updateMessage.success = false
        });
    },
    dataToUpdate(i) {
      if(!this.itemsToUpdate.includes(i)) this.itemsToUpdate.push(i) 
      if(/^[0-9]+$/.test(this.editedItem[i])) this.editedItem[i] = parseInt(this.editedItem[i])
      else if(i === 'loanRate') this.editedItem[i] = parseFloat(this.editedItem[i])
    },
    cancelEditing() {
      this.dialogEdit = false
      this.editedItem = undefined
    },
    deleteItemModal(item) {
      this.itemToDelete.id = item.id
      this.itemToDelete.village = item.village
      this.dialogDelete = true
    },
    async deleteItem() {
      await this.$fire.firestore.collection(this.itemToDelete.village).doc(this.itemToDelete.id).delete()
        .then(() => {
          console.log('deleted');
          this.dialogDelete = false
          this.itemToDelete = {}
          this.$emit('refresh-table', this.sourceMfi)
        })
    },
    printTable() {
      this.printMedia = true
      let headers = {}
      let subheader = {}
      if (this.sourceMfi) {
        headers = {
          old: this.datasHeaders,
          new: [...this.datasHeaders.slice(0, 5), ...this.datasHeaders.slice(8, 15)]
        }
        subheader = {
          old: this.subheader,
          new: [...this.subheader.slice(1, 6), ...this.subheader.slice(9, 16)]
        }
        this.datasHeaders = headers.new
        this.subheader = subheader.new
      } else {
        headers = {
          old: this.datasHeaders,
          new: [...this.datasHeaders.slice(0, 11), 
            { text: 'គោលបំណងកម្ច', value: 'purpose' },
          ]
        }
        subheader = {
          old: this.subheader,
          new: [...this.subheader.slice(1, 12), 'Purpose']
        }
        this.datasHeaders = headers.new
        this.subheader = subheader.new
      }

      this.$vuetify.theme.dark = false
      window.onafterprint = (event) => {
        this.$vuetify.theme.dark = true
        this.printMedia = false
        if (this.sourceMfi) {
          this.datasHeaders = headers.old
          this.subheader = subheader.old
        } else {
          this.subheader = subheader.old
        }
      }
      setTimeout(() => {
        window.print()
      }, 300); 
    }
  },
}
</script>

<style lang="scss" scoped>
.table-photo {
  width: 90px;
  height: 90px;
}
.successMessage{
  color: green;
}
.failMessage{
  color: red;
}
img {
    -webkit-print-color-adjust: exact;
}
</style>