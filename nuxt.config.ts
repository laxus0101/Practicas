// https://nuxt.com/docs/api/configuration/nuxt-config
import colors from 'tailwindcss/colors'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
    modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'dayjs-nuxt',
    //'@nuxt/ui',
  ],
/*   dayjs: {
    locales: ['es'],
    plugins: ['advancedFormat', 'weekOfYear', 'isoWeek', 'weekday', 'utc', 'isBetween', 'isSameOrBefore', 'updateLocale'],
    defaultLocale: 'es',
  }, */

})

