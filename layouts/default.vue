<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" temporary app>
      <v-list>
        <v-list-item
          v-for="(item, i) in navItems"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
            <v-list-item-subtitle v-text="item.subTitle" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar id="appBar" :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        {{ userAuth ? userAuth.displayName : 'Community Tool' }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="userAuth" color="primary" @click="signOut">log out</v-btn>
    </v-app-bar>
    <v-main class="ma-2">
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <Nuxt />
      <v-bottom-sheet v-model="disconnected" persistent>
        <v-sheet class="text-center" height="60px">
          <div class="py-2 message-alert">Your are OFFLINE</div>
        </v-sheet>
      </v-bottom-sheet>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import Vue from 'vue'
import functions from '~/mixins/functions.js'
Vue.mixin(functions)

export default {
  name: 'DefaultLayout',
  mixins: [functions],
  data() {
    return {
      overlay: false,
      clipped: false,
      drawer: false,
      fixed: false,
      refresh: 0,
      disconnected: false,
    }
  },
  computed: {
    ...mapState(['userAuth']),
    navItems() {
      const list = [
      {
          icon: 'mdi-database-plus-outline',
          title: 'ការប្រមូលទិន្នន័យ',
          subTitle: 'Collect Data',
          to: '/',
        },
        {
          icon: 'mdi-apps',
          title: 'កម្ចីសាកល្បង',
          subTitle: 'Simulator',
          to: '/simulator',
        },
        
      ]
      if (
        this.userAuth &&
        (this.userAuth.role === process.env.roleThree ||
          this.userAuth.role === process.env.roleTwo)
      ) {
        list.push({
          icon: 'mdi-database-eye-outline',
          title: 'Admin',
          to: '/admin',
        })
      }
      return list
    },
  },
  async created() {
    this.overlay = true
    const result = await this.$store.dispatch('keepConnection')
    if (result) {
      this.overlay = false
    }
  },
  mounted() {
    onoffline = (event) => {
      this.disconnected = true
      console.log('You are disconnected')
    }
    ononline = (event) => {
      this.disconnected = false
    }
  },
  methods: {
    signOut() {
      const confirm = window.confirm('Are you sure to logout')
      if (confirm) {
        this.$fire.auth.signOut()
        location.reload()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.message-alert {
  color: red;
}
@media print {
  #appBar {
    display: none;
  }
  footer {
    display: none;
  }
  .container {
    max-width: none;
  }
}
</style>
