<template>
  <div>
    <p v-if="!errorMessage">
      Export to CSV file, type the new file name to download it
    </p>
    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>

    <v-form v-else ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="fileName"
        :counter="20"
        :rules="fileNameRules"
        label="File name"
        required
      ></v-text-field>
    </v-form>
    <v-spacer></v-spacer>
    <v-btn
      v-if="!errorMessage"
      :disabled="!valid"
      color="primary"
      class="mr-4"
      @click="convertMyJson"
    >
      Save
    </v-btn>
  </div>
</template>

<script>
import dataJson from '@/assets/public/collect';
export default {
  /* props: {
    dataJson: {
      type: Object,
      default: Object,
    },
  }, */
  data: () => ({
    valid: true,
    errorMessage: undefined,
    fileName: '',
    fileNameRules: [
      (v) => !!v || 'A file name is required',
      (v) => (v && v.length <= 20) || 'Name must be less than 20 characters',
    ],
  }),
  methods: {
    convertMyJson() {
      function convertToCSV(objArray) {
        const array =
          typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
        let str = ''
        for (let i = 0; i < array.length; i++) {
          let line = ''
          for (const index in array[i]) {
            if (line !== '') line += ','

            line += array[i][index]
          }

          str += line + '\r\n'
        }

        return str
      }

      function exportCSVFile(headers, items, fileTitle) {
        if (headers) {
          items.unshift(headers)
        }

        // Convert Object to JSON
        const jsonObject = JSON.stringify(items)
        const csv = convertToCSV(jsonObject)

        const exportedFilename = fileTitle + '.csv' || 'export.csv'

        const blob = new Blob([csv], { type: 'data:application/vnd.ms-excel;base64,' })
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, exportedFilename)
        } else {
          const link = document.createElement('a')
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', exportedFilename)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        }
      }

      const download = (jsonToConvert) => {
        const headers = {
            loanType: "loanType",
            village: "village",
            bank: "bank",
            currency: "currency",
            borrowerName: "borrowerName",
            principle: "principle",
            rate: "rate",
            year: "year",
            serviceFee: "serviceFee",
            date: "date",
        }

        const itemsNotFormatted = jsonToConvert

        const itemsFormatted = []

        // format the data

        itemsNotFormatted.forEach((item) => {
            console.log(item);
          itemsFormatted.push({
            loanType: item.loanType,
            village : item.village,
            bank : item.bank,
            currency : item.currency,
            borrowerName : item.borrowerName,
            principle: item.loanAmount,
            rate: item.loanRate,
            year: item.loanYear,
            serviceFee : item.serviceFee,
            date : item.date,
          })
        })
        console.log(itemsFormatted);
        const fileTitle = this.fileName

        exportCSVFile(headers, itemsFormatted, fileTitle)
      }
      if (this.$refs.form.validate()) {
        try {
          download(dataJson)
          this.errorMessage = 'Your CSV file is downloaded'
        } catch (error) {
            console.log(error);
          this.errorMessage =
            'Failed to save the file, save first your data on map !'
        }
      }
    },
  },
}
</script>
