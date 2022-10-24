<template>
  <v-layout>
    <v-btn icon color="primary" class="mx-2">
      <download-excel
        :data="villageDatas"
        :fields="jsonFields"
        :worksheet="villageDatas[0].village"
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
    sourceMfi: {
      type: Boolean,
    },
  },
  data() {
    return {
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
        ? this.villageDatas[0].village + '_datas_' + this.$moment().format('L')
        : 'no_data'
    },
    jsonFields() {
      if (this.sourceMfi) {
        return {
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
        }
      } else {
        return {
          Name: 'borrowerName',
          'household Id': 'householdId',
          Start: 'dateStart',
          End: 'dateEnd',
          'loan Source': 'loanSource.type',
          'Loan Cycle': 'loanCycle',
          From: 'from',
          Amount: 'loanAmount',
          'total Interest': 'totalInterest',
          'Interest Period': 'interestPeriod.type',
          'loan Rate': 'loanRate',
          Fee: 'serviceFee',
        }
      }
    },
  },
}
</script>
<style scoped lang="scss"></style>
