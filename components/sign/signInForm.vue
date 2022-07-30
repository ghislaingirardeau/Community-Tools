<template>
  <v-col cols="12" class="addCollector__block">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-row align="center">
          <v-col cols="6" sm="3">
            <v-text-field
              v-model="formData.email"
              :rules="emailRules"
              label="Email"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="3">
            <v-text-field
              v-model="formData.password"
              :rules="passwordRules"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              required
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="3">
            <v-text-field
              v-model="formData.displayName"
              label="name"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="3">
            <v-select
              v-model="formData.role"
              :items="roles"
              label="Role"
              :rules="[(value) => !!value || 'Required']"
            ></v-select>
          </v-col>
          <v-col cols="6" sm="3">
            <v-select
              v-model="village"
              :items="villagesDatas"
              label="village"
              :hint="villageMessage"
              :persistent-hint="villageMessage ? true : false"
            ></v-select>
          </v-col>
          <v-col cols="6" sm="3">
            <v-icon color="success" @click="addVillage">mdi-plus-circle</v-icon>
            <span>{{ formData.village }}</span>
          </v-col>

          <v-col cols="11" sm="3">
            <v-btn color="primary" @click="sendDataForm">
              Save
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <p v-if="infoMessage" class="info__message mt-2">
      {{ infoMessage }}
    </p>
  </v-col>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    villagesDatas: {
      type: Array,
      default: Array,
    },
  },
  data() {
    return {
      infoMessage: undefined,
      valid: true,
      emailRules: [
        (v) => !!v || 'E-mail mandatory',
        (v) => /.+@.+\..+/.test(v) || 'E-mail mandatory',
      ],
      showPassword: false,
      passwordRules: [
        (v) => !!v || 'Mandatory password',
        (v) =>
          /^.*(?=.{6,})(?=.*\d)(?=.*[a-zA-Z]).*$/.test(v) ||
          'Minimum 6 characters and one letter',
      ],
      roles: [process.env.roleOne, process.env.roleTwo, process.env.roleThree],
      village: '',
      villageMessage: undefined,
      formData: {
        email: 'testauth@mail.com',
        password: '',
        displayName: '',
        village: [],
        role: '',
      },
    }
  },
  mounted() {
    this.infoMessage = undefined
  },
  methods: {
    ...mapActions(['signUp']),
    addVillage() {
      this.villageMessage = undefined
      if (
        this.village.length > 0 &&
        this.formData.village.find((e) => e === this.village) === undefined
      ) {
        this.formData.village.push(this.village)
        this.village = ''
      } else {
        this.villageMessage = 'add a village or village already added'
      }
    },
    async sendDataForm() {
        if (this.$refs.form.validate() && this.formData.village.length > 0) {
            // if want to signup
            this.infoMessage = 'Wait creating the user...'
            const response = await this.signUp(this.formData)
            if (response.result) {
                this.infoMessage = response?.message
                ? response.message
                : 'Collector added'
                setTimeout(() => {
                this.infoMessage = undefined
                console.log(this.infoMessage);
                }, 2000)
                this.$refs.form.reset()
                this.formData.village = []
                this.villageMessage = undefined
            }
        } else if(this.formData.village.length === 0) {
            this.infoMessage = 'add at leat one village'
        }
    },
  },
}
</script>

<style lang="scss" scoped>
.info__message {
  color: red;
  font-style: italic;
}
.addCollector__block {
  border: 2px solid grey;
}
</style>