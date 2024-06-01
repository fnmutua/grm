// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  modules: ["nuxt-icon", "@nuxt/ui", "@sidebase/nuxt-auth", "radix-vue/nuxt", "@element-plus/nuxt"],
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
    }
  }
});