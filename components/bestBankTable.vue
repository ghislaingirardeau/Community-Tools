<template>
    <v-col cols="11">
      <h2>Best Bank</h2>
      <v-simple-table
        fixed-header
        height="300px"
      >
        <template #default>
          <thead>
            <tr>
              <th class="text-left">bank</th>
              <th class="text-left">Interest</th>
              <th class="text-left">fee</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in topBestBank.rate" :key="i">
              <td>
                {{ item.bank }}
              </td>
              <td>
                {{ item.rate }}
              </td>
              <td>
                {{ item.fee }}
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
            topBestBank: {
                type: Object,
                default: Object
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>