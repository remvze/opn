import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  adapter: cloudflare(),
  integrations: [react(), sitemap()],
  output: 'server',
  site: 'https://opn.bio',
});
