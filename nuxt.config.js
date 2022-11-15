import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Commnuity Tool',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [],
  },

  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/vue-json-excel',
    { src: '~/plugins/chart.js', mode: 'client' },
    { src: '~/plugins/barChart.js', mode: 'client' },
  ],

  components: [
    '@/components',
    { path: '@/components/sign', extensions: ['vue'] },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv',
    '@nuxtjs/moment',
  ],
  moment: {
    locales: ['fr'],
  },

  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: process.env.APIKEY,
          authDomain: process.env.AUTHDOMAIN,
          projectId: process.env.PROJECTID,
          storageBucket: process.env.BUCKET,
          messagingSenderId: process.env.MESSAGINGID,
          appId: process.env.APPID,
        },
        services: {
          auth: true,
          firestore: true,
          storage: true,
        },
      },
    ],
  ],

  axios: {
    baseURL: '/',
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true, // add to change the variable
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: '#008080',
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: null,
  },
  env: {
    roleOne: process.env.ROLEONE,
    roleTwo: process.env.ROLETWO,
    roleThree: process.env.ROLETHREE,
    collection: process.env.COLLECTION,
  },
}
