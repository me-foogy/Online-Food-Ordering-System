// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  tailwindcss: { exposeConfig: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-toast', 'nuxt-nodemailer'],
   build: {
    transpile: ['@vuepic/vue-datepicker']
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
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      esewaUrl:process.env.NUXT_PUBLIC_ESEWA_URL
    },
    nodemailer: {
      from: process.env.SENDGRID_FROM,
      host: process.env.SENDGRID_HOST,
      port: Number(process.env.SENDGRID_PORT),
      secure: process.env.SENDGRID_SECURE==='true',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASS,
      },
  },
  }
})