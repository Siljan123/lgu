export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: [
    './layers/base',
    './layers/public-site'
  ],
    runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY ,
    public: {
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      supabaseUrl: process.env.SUPABASE_URL ,
      supabaseKey: process.env.SUPABASE_KEY 
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy': "default-src 'self'",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      }
    }
  }
})
