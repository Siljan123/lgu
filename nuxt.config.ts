export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: [
    './layers/base',
    './layers/public-site'
  ],
  runtimeConfig: {
  supabaseKey: '',
  supabaseServiceRoleKey: '',
  public: {
    googleMapsApiKey: '',
    supabaseUrl: '',
    supabaseKey: '',
  },
},

})
