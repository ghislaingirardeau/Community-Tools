<template>
  <v-col cols="11">
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
                <v-row align="center">
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
                        <v-select
                            v-model="village"
                            :items="villagesDatas"
                            label="village"
                            :hint="villageMessage"
                            :persistent-hint="villageMessage ? true : false"
                        ></v-select>
                    </v-col>
                    <v-col v-if="!signType" cols="6" sm='3'>
                        <v-icon
                          color="primary"
                          @click="addVillage"
                        >mdi-plus-circle</v-icon>
                        <span>{{formData.village}}</span>
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
        villagesDatas: {
            type: Array,
            default: Array
        }
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
      villageMessage: undefined,
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
      this.villageMessage = undefined
      if (this.village.length > 0 && (this.formData.village.find(e => e === this.village) === undefined)) {
        this.formData.village.push(this.village)
        this.village = ''
      } else {
        this.villageMessage = 'add a village or village already added'
      }
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
            this.villageMessage = undefined
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