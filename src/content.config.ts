import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Terms and privacy policy per language, synced from the app repo (npm run legal:sync). */
const legal = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    version: z.string(),
    /** The date line as the text words it, e.g. "Stand: 24. Oktober 2026". */
    updated: z.string(),
  }),
});

export const collections = { legal };
