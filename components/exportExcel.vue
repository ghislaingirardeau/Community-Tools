<template>
  <v-layout>
    <v-btn icon color="primary" class="mx-2">
      <download-excel
        :data="villageDatas"
        :fields="json_fields"
        :worksheet="exportDate"
        :name="filename"
      >
        <v-icon dark> mdi-file-table-outline </v-icon>
      </download-excel>
    </v-btn>
  </v-layout>
</template>
<script>
export default {
  props: {
    villageDatas: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      json_fields: {
        Name: 'borrowerName',
        'household Id': 'householdId',
        Start: 'dateStart',
        End: 'dateEnd',
        Year: 'duration',
        'Loan Type': 'loanType',
        'Loan Cycle': 'loanCycle',
        MFI: 'bank',
        Amount: 'loanAmount',
        Remaining: 'remainingLoan',
        'total Interest': 'totalInterest',
        'loan Rate': 'loanRate',
        'Last 12 month': {
          field: 'interestLast12Months',
          callback: (value) => {
            return `${value}`
          },
        },
        Fee: 'serviceFee',
        CBC: 'cbc',
        'Penalty Period': 'noPenaltyPeriod',
        'Penalty Rate': 'penaltyRate',
      },
      json_meta: [
        [
          {
            key: 'charset',
            value: 'utf-8',
          },
        ],
      ],
    }
  },
  computed: {
    filename() {
      return this.villageDatas.length > 0
        ? this.villageDatas[0].village + '_datas'
        : 'no_data'
    },
    exportDate() {
      const date = new Date()
      return 'Extract on ' + date.toUTCString().substr(5, 11)
    },
  },
  mounted() {
    console.log(this.villageDatas)
  },
}
</script>
<style scoped lang="scss"></style>
