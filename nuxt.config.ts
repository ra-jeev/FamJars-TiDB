// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['@/assets/css/app.css'],
  components: [{ path: '~/components/app', prefix: 'App' }, '~/components'],
  modules: ['@nuxthq/ui', '@nuxtjs/supabase'],
  supabase: {
    redirect: false,
  },
  runtimeConfig: {
    tiDBDataApiPrivateKey: process.env.TIDBCLOUD_DATA_SERVICE_PRIVATE_KEY,
    tiDBDataApiPublicKey: process.env.TIDBCLOUD_DATA_SERVICE_PUBLIC_KEY,
  },
});
