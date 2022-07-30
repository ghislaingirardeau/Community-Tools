<template>
  <v-col cols="12" class="addCollector__block">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-row align="center">
          <v-col cols="11" sm="6">
            <v-text-field
              v-model="formData.email"
              :rules="emailRules"
              label="អ៊ីម៉ែល / (Email)"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="11" sm="6">
            <v-text-field
              v-model="formData.password"
              :rules="passwordRules"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              label="លេខសំងាត់ / (Password)"
              required
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-col>

          <v-col cols="11">
            <v-btn color="primary" @click="sendDataForm">
              Login
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
      formData: {
        email: '@mail.com',
        password: '',
      },
    }
  },
  mounted() {
    this.infoMessage = undefined
  },
  methods: {
    ...mapActions(['login']),
    async sendDataForm() {
      if (this.$refs.form.validate()) {
        this.$emit('overlay-active', { message: true })
        // if want to log
        const response = await this.login(this.formData)
        if (response.result) {
          response?.message
            ? (this.infoMessage = response.message)
            : (this.infoMessage = 'Connected')
          this.$emit('overlay-active', { message: false })
        }
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