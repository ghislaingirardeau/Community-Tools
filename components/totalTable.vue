<template>
  <v-card>
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
    totalDatas: {
      type: Array,
      default: Array,
    },
  },
}
</script>

<style lang="scss" scoped>
.table-border {
  border-top: 2px solid grey;
}
</style>