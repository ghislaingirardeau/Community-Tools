<template>
  <v-col cols="11" sm="6">
    <transition name="fade-slideX" mode="out-in">
      <div :key="signType">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-if="!signType"
            v-model="formData.displayName"
            label="name"
            required
          ></v-text-field>
          <v-text-field
            v-if="!signType"
            v-model="formData.village"
            label="village"
            required
          ></v-text-field>
          <v-text-field
            v-model="formData.email"
            :rules="emailRules"
            label="Email"
            required
          ></v-text-field>
          <v-text-field
            v-model="formData.password"
            :rules="passwordRules"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            required
            @click:append="showPassword = !showPassword"
          ></v-text-field>

          <v-btn color="primary" @click="sendDataForm">
            {{ signType ? 'Login' : 'Register' }}
          </v-btn>
        </v-form>
        <p v-if="infoMessage" class="info__message mt-2">
          {{ infoMessage }}
        </p>
        <p class="mt-2">
          {{
            signType
              ? "If you don't have connection ID ? Please click 'Sign Up'"
              : 'Back to the login'
          }}
        </p>
        <v-btn
          :key="signType"
          class="mb-3"
          color="secondary"
          outlined
          @click="signType = !signType"
          >{{ signType ? 'Sign Up' : 'Login' }}</v-btn
        >
      </div>
    </transition>
  </v-col>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      signType: true,
      infoMessage: undefined,
      valid: true,
      emailRules: [
        (v) => !!v || 'E-mail est obligatoire',
        (v) => /.+@.+\..+/.test(v) || 'E-mail doit etre valide',
      ],
      showPassword: false,
      passwordRules: [
        (v) => !!v || 'Mot de passe obligatoire',
        (v) =>
          /^.*(?=.{6,})(?=.*\d)(?=.*[a-zA-Z]).*$/.test(v) ||
          'Minimum 6 caracteres dont 1 lettre et une chiffre',
      ],
      formData: {
        email: 'testauth@mail.com',
        password: 'qwerty1',
        displayName: 'Ghislain',
        village: ''
      },
    }
  },
  mounted() {
    this.infoMessage = undefined
  },
  methods: {
    ...mapActions(['login', 'signUp']),

    async sendDataForm() {
      if (this.$refs.form.validate()) {
        this.$emit('overlay-active', { message: true })
        if (this.signType) {
          // if want to log
          const response = await this.login(this.formData)
          if (response.result) {
            response?.message ? this.infoMessage = response.message : this.infoMessage = 'Connected'
            this.$emit('overlay-active', { message: false })
          }
        } else {
          // if want to signup
          await this.signUp(this.formData)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.fade-slideX-enter-active,
.fade-slideX-leave-active {
  transition: all 0.5s ease;
}

.fade-slideX-enter,
.fade-slideX-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.info__message{
  color: red;
}
</style>