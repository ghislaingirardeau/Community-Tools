<template>
  <v-col cols="11">
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
                <v-row>
                    <v-col :cols="signType ? 11 : 6" :sm='signType ? 6 : 3'>
                        <v-text-field
                            v-model="formData.email"
                            :rules="emailRules"
                            label="Email"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col :cols="signType ? 11 : 6" :sm='signType ? 6 : 3'>
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
                    <v-col v-if="!signType" cols="6" sm='3'>
                        <v-text-field
                            v-model="formData.displayName"
                            label="name"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col v-if="!signType" cols="6" sm='3'>
                        <v-select
                            v-model="formData.role"
                            :items="roles"
                            label="Role"
                            :rules="[value => !!value || 'Required']"
                        ></v-select>
                    </v-col>
                    <v-col v-if="!signType" cols="6" sm='3'>
                        <v-text-field
                            v-model="village"
                            label="village"
                            append-icon="mdi-plus"
                            required
                            @click:append="addVillage"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="11" :sm='signType ? 11 : 3'>
                        <v-btn color="primary" @click="sendDataForm">
                            {{ signType ? 'Login' : 'Save' }}
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
        signType: {
            type: Boolean,
            default: Boolean
        },
    },
  data() {
    return {
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
      roles: ['investigator', 'communeReader'],
      village: '',
      formData: {
        email: 'testauth@mail.com',
        password: '',
        displayName: '',
        village: [],
        role: ''
      },
    }
  },
  mounted() {
    this.infoMessage = undefined
  },
  methods: {
    ...mapActions(['login', 'signUp']),
    addVillage() {
        this.formData.village.push(this.village)
        this.village = ''
    },
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
          const response = await this.signUp(this.formData)
          console.log(response);
          if (response.result) {
            this.infoMessage = 'Investigator added'
            this.$refs.form.reset()
            this.formData.village = []
          }
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.info__message{
  color: red;
  font-style: italic;
}
</style>