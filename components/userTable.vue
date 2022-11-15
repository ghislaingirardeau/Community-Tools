<template>
  <v-col cols="12" class="my-2">
    <v-dialog v-model="dialogEdit" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Add village</v-card-title>
        <v-card-text>
          <v-select
            v-model="village"
            :items="villagesList"
            label="village"
          ></v-select>
          <v-icon color="success" @click="addVillage">mdi-plus-circle</v-icon>
          <p>Villages selected : {{ villagesSelected }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEdit">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="editUser">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-simple-table fixed-header>
      <template #default>
        <caption>
          Users List
        </caption>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Role</th>
            <th class="text-left">Villages</th>
            <th class="text-left">Actions</th>
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
            <td>
              <v-icon color="warning" @click="showEdit(item)">
                mdi-pencil
              </v-icon>
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
      default: Array,
    },
    villagesList: {
      type: Array,
      default: Array,
    },
  },
  data() {
    return {
      dialogEdit: false,
      village: '',
      villagesSelected: [],
      user: undefined,
    }
  },
  methods: {
    editUser() {
      console.log(this.user, this.villagesSelected)
      const userRef = this.$fire.firestore
        .collection(process.env.collection)
        .doc(this.user.id)
      userRef.update({ village: this.villagesSelected })
      this.dialogEdit = false
    },
    addVillage() {
      if (this.villagesSelected.find((e) => e === this.village) === undefined) {
        this.villagesSelected.push(this.village)
      }
    },
    showEdit(user) {
      this.dialogEdit = true
      this.user = user
      this.villagesSelected = user.village
    },
    closeEdit() {
      this.dialogEdit = false
      this.villagesSelected = []
    },
  },
}
</script>

<style lang="scss" scoped>
caption {
  font-weight: 600;
  font-size: 24px;
}
</style>
