// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components: [{ path: '~/components/app', prefix: 'App' }, '~/components'],
  modules: ['@nuxthq/ui', '@nuxtjs/supabase'],
});
