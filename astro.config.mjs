// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://czidor-imre.hu',
  integrations: [
    sitemap({
      filter: (page) =>
        !/\/(impresszum|adatvedelem|szakmai-profil)\/?$/.test(page),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
