<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
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
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>
      <v-btn v-if="userAuth" color="primary" @click="signOut">logout</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'DefaultLayout',
  data() {
    return {
      overlay: false,
      clipped: false,
      drawer: false,
      fixed: false,
      refresh: 0,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Simulator',
          to: '/',
        },
        {
          icon: 'mdi-apps',
          title: 'Loan Data',
          to: '/loanData',
        },
        {
          icon: 'mdi-apps',
          title: 'Table Data',
          to: '/datasTable',
        },
      ],
      miniVariant: false,
      title: 'Community Tool',
    }
  },
  computed: {
    ...mapState(['userAuth'])
  },
  async created () {
    this.overlay = true
    const result = await this.$store.dispatch('keepConnection')
    if (result) {
      this.overlay = false
    }
  },
  methods: {
    signOut() {
        const confirm = window.confirm(
            'Save your datas before log out !'
        )
        if (confirm) {
            this.$fire.auth.signOut()
            location.reload()
        }
    },
  },
}
</script>
