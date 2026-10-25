import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://useloqqa.com',
  // /terms is served from terms.html, without a trailing slash.
  build: { format: 'file' },
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
  },
});
