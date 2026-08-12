export default defineNuxtConfig({
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['google.maps'],
      },
    },
  },
  runtimeConfig: {
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
}
})
