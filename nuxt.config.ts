import { products } from './data/products';

export default defineNuxtConfig({
  compatibilityDate: '2026-11-03',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    baseURL: '/atelier-no8-nuxt/',
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Atelier No.8 — Considered objects, everyday companions',
      meta: [
        {
          name: 'description',
          content:
            'A considered collection of bags and small leather goods. An original, fictional retail experience.',
        },
        { name: 'theme-color', content: '#f7f4ed' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/atelier-no8-nuxt/favicon.svg',
        },
      ],
    },
  },
  typescript: { strict: true },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/collection',
        '/story',
        '/checkout',
        ...products.map((p) => `/products/${p.slug}`),
      ],
    },
  },
});
