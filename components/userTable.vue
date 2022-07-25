<template>
    <v-col cols="12" sm="12" class="table--border my-2">
      <v-simple-table
        fixed-header
      >
        <template #default>
          <caption>Users List</caption>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Role</th>
              <th class="text-left">Villages</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in usersList" :key="i">
              <td>
                {{ item.name }}
              </td>
              <td>
                {{ item.role }}
              </td>
              <td>
                {{ item.village }}
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
            usersList: {
                type: Array,
                default: Array
            },
        },
    }
</script>

<style lang="scss" scoped>
caption{
  font-weight: 600;
  font-size: 24px;
}
.table--border{
  border: 2px solid rgb(55, 16, 226);
}
</style>