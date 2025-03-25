import tailwindcss from "@tailwindcss/vite"
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),  
    ],
  },
  devServer: {
    host: '0.0.0.0', // Allow external connections
    port: 3000, // Default port
  },
  nitro: {
    experimental: {
      database: true
    },
    database: {
      mydb: {
        connector: 'sqlite',
        options: { name: 'db' }
      }
    }
  }
})
