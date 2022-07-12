<template>
    <v-col cols="11">
      <h2>Payment table</h2>
      <v-simple-table
        v-if="loan.amount != null && loan.rate != null && loan.year != null"
        fixed-header
        height="300px"
      >
        <template #default>
          <thead>
            <tr>
              <th class="text-left">Date</th>
              <th v-if="paymentTable[0]?.loanBegin" class="text-left" >Loan</th>
              <th class="text-left">Capital</th>
              <th class="text-left">interest</th>
              <th class="text-left">Remain</th>
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

</style>