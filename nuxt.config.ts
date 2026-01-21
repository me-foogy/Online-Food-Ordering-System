// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  tailwindcss: { exposeConfig: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-toast'],
   build: {
    transpile: ['@vuepic/vue-datepicker'] //datepicker component
  },
  toast: {
    settings: {
      position: 'topCenter',
      timeout: 3000,
    }
  },
  app:{
    head:{
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined'
        }
      ]
    }
  }
})