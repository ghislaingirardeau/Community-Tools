<template>
    <v-col cols="12" sm="11" class="table--border mt-2">
      <v-simple-table
        v-if="loan.amount != null && loan.rate != null && loan.year != null"
        fixed-header
        height="300px"
      >
        <template #default>
          <caption>តារាងបង់សង /Payment table</caption>
          <thead>
            <tr>
              <th class="text-left">កាលបរិច្ឆេទ /Date</th>
              <th v-if="paymentTable[0]?.loanBegin" class="text-left" >ចំនួនប្រាក់កម្ចី / Loan</th>
              <th class="text-left">ប្រាក់ដើម /Capital</th>
              <th class="text-left">ប្រាក់ការ /interest</th>
              <th class="text-left">កម្ចីនៅសល់ /Remain</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in paymentTable" :key="i">
              <td>
                {{ item.date }}
              </td>
              <td v-if="paymentTable[0]?.loanBegin">
                {{
                  currency === 'Dollars'
                    ? parseFloat(item.loanBegin).toFixed(2)
                    : parseInt(item.loanBegin)
                }}
              </td>
              <td>
                {{
                  currency === 'Dollars'
                    ? item.capital.toFixed(2)
                    : parseInt(item.capital)
                }}
              </td>
              <td>
                {{
                  currency === 'Dollars'
                    ? item.interest.toFixed(2)
                    : parseInt(item.interest)
                }}
              </td>
              <td>
                {{
                  currency === 'Dollars'
                    ? item.loanFinal.toFixed(2)
                    : parseInt(item.loanFinal)
                }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>

</template>

<script>
    export default {
        props: {
            paymentTable: {
                type: Array,
                default: Array
            },
            loan: {
                type: Object,
                default: Object
            },
            currency: {
                type: String,
                default: String
            }
        },
    }
</script>

<style lang="scss" scoped>
caption{
  font-weight: 600;
  font-size: 24px;
}
.table--border{
  border: 2px solid rgb(76, 226, 16);
}

</style>