import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    created: z.coerce.date(),
    draft: z.boolean(),
    tags: z.array(z.string()),
    cover: z.string().optional(),
  }),
});

export const collections = { pages, notes };
