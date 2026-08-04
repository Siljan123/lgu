import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const componentDir = fileURLToPath(new URL('./app/components/ui', import.meta.url))
const currentDir = fileURLToPath(new URL('.', import.meta.url))

export default defineNuxtConfig({
  vite: {
    plugins: [
      tailwindcss(),
    ],
    
    
  },
  css: [fileURLToPath(new URL('./app/assets/css/tailwind.css', import.meta.url)), fileURLToPath(new URL('./app/assets/css/animated.css', import.meta.url))],
  modules: ['shadcn-nuxt', '@nuxt/image'],
  shadcn: {
    prefix: '',
    componentDir: componentDir
  },
  alias: {
    '@base': currentDir
  }
})