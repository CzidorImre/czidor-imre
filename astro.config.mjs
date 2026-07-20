// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const NOINDEX_PATHS = ['/adatvedelem/', '/impresszum/', '/szakmai-profil/'];

export default defineConfig({
  site: 'https://muszakiellenorborsod.hu',
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX_PATHS.some((path) => page.endsWith(path)),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
