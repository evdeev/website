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
    updated: z.coerce.date().optional(),
    draft: z.boolean(),
    tags: z.array(z.string()),
    cover: z.string().optional(),
  }),
});

const careerDate = z.string().regex(/^\d{4}(-\d{2})?$/, 'Use YYYY or YYYY-MM format');

const career = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/career' }),
  schema: z.object({
    title: z.string(),
    role: z.string(),
    start: careerDate,
    end: z.union([careerDate, z.literal('present')]),
    summary: z.string(),
    company_url: z.string().url().optional(),
    location: z.string(),
    featured: z.boolean(),
  }),
});

export const collections = { pages, notes, career };
