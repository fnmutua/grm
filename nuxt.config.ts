// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  sourcemap: true,
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},

    }
  },
  colorMode: {
    preference: 'light'
  },
  modules: [
    "nuxt-icon",
    "@nuxt/ui",
    "@sidebase/nuxt-auth",
    '@nuxtjs/color-mode',
    'radix-vue/nuxt',
    "@element-plus/nuxt",
    'nuxt-mapbox',
    "nuxt-plotly",
    'nuxt-highcharts',
  ],
 
     auth: {
    baseURL: '/',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/api/login', method: 'post' },
        signOut: { path: '/login', method: 'post' },
        signUp: { path: '/api/register', method: 'post' },
        //getSession: { path: '/api/session', method: 'get' }
         getSession: { path: '/api/session' }

      },
      token: { signInResponseTokenPointer: '/token' },
      sessionDataType: {
        id: 'string',
        username: 'string',
        name: 'string',
        role: 'array' // Define role as 'string' type
      },
    },
  
  }, 
  mapbox: {
    accessToken: 'pk.eyJ1IjoiYWdzcGF0aWFsIiwiYSI6ImNsdm92dGhzNDBpYjIydmsxYXA1NXQxbWcifQ.dwBpfBMPaN_5gFkbyoerrg'
  },
  build: {
    transpile: ['echarts', 'zrender', 'tslib', 'resize-detector'],
  },
});