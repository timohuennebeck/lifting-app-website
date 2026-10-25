import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import { rehypeLegalSections } from './src/lib/rehype-legal-sections.ts';

export default defineConfig({
  site: 'https://useloqqa.com',
  // /terms is served from terms.html, without a trailing slash.
  build: { format: 'file' },
  trailingSlash: 'never',
  markdown: {
    rehypePlugins: [rehypeLegalSections],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
