import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const moscowDateTime = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

const noteDate = z.string().transform((value, context) => {
  const normalizedValue = moscowDateTime.test(value)
    ? `${value.replace(' ', 'T')}+03:00`
    : value;
  const date = new Date(normalizedValue);

  if (Number.isNaN(date.valueOf())) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Use YYYY-MM-DD HH:mm:ss for Moscow time',
    });

    return z.NEVER;
  }

  return date;
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lead: z.string().optional(),
    personal: z.string().optional(),
    intro: z.string().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    topic: z.string().optional(),
    status: z.enum(['draft', 'published']).optional(),
    description: z.string(),
    intro: z.string().optional(),
    created: noteDate,
    updated: noteDate.optional(),
    draft: z.boolean(),
    tags: z.array(z.string()),
    cover: z.string().optional(),
    relatedNotes: z.array(z.string()).optional(),
    relatedCareer: z.array(z.string()).optional(),
    relatedProjects: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
  }),
});

const series = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    notes: z.array(z.string()).min(1),
  }),
});

const careerDate = z.string().regex(/^\d{4}(-\d{2})?$/, 'Use YYYY or YYYY-MM format');

const career = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/career' }),
  schema: z.object({
    title: z.string(),
    headline: z.string(),
    official_role: z.string().optional(),
    start: careerDate,
    end: z.union([careerDate, z.literal('present')]),
    summary: z.string(),
    home_summary: z.string().optional(),
    company_url: z.string().url().optional(),
    location: z.string(),
    featured: z.boolean(),
    relatedNotes: z.array(z.string()).optional(),
  }),
});

const games = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/lists/games' }),
  schema: z.object({
    title: z.string(),
    developers: z.array(z.object({
      name: z.string(),
      url: z.string().url(),
    })),
    releaseYear: z.number().int(),
    rating: z.number().min(0).max(10).optional(),
    status: z.string().optional(),
    playthroughs: z.number().int().positive().optional(),
    cover: z.string(),
  }),
});

export const collections = { pages, notes, series, career, games };
