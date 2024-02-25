import { defineNuxtConfig } from 'nuxt/config'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: ['@nuxt/content', "@nuxt/image"],
    content: {
        highlight: {
            theme: 'github-light'
        }
    },
    // plugins: [{ src: '~/plugins/prism.js', ssr: false },
    // { src: '~/plugins/clipboard.js' }
    // ],
})