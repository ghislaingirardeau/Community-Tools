<template>
    <v-col cols="5">
      <v-simple-table
        fixed-header
        height="300px"
      >
        <template #default>
          <caption>{{title}}</caption>
          <thead>
            <tr>
              <th class="text-left">bank</th>
              <th class="text-left">Interest</th>
              <th class="text-left">fee</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in topBestBank" :key="i">
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
                type: Array,
                default: Array
            },
            title: {
                type: String,
                default: String
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>