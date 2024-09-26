// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    '#tailwind-config': './tailwind.config.js',
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  colorMode:{
    preference:'light'
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'dayjs-nuxt',
    '@nuxt/ui',
  ],

})