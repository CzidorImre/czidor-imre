// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://muszakiellenorborsod.hu',

  integrations: [
    sitemap(),
  ],

  build: {
    inlineStylesheets: 'auto',
  },

  compressHTML: true,
  adapter: cloudflare()
});