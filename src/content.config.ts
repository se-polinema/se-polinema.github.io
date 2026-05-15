import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

const localizedText = z.object({
  id: z.string(),
  en: z.string(),
})

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    titleId: z.string().optional(),
    date: z.date(),
    category: z.enum(['announcement', 'news', 'event']),
    author: z.string().default('SE Lab'),
    lang: z.enum(['en', 'id']).default('en'),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    excerpt: z.string().optional(),
    excerptId: z.string().optional(),
  }),
})

const researchersCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/researchers' }),
  schema: z.object({
    name: z.string(),
    title: localizedText,
    role: localizedText,
    photo: z.string(),
    photoPosition: z.string().default('50% 20%'),
    shortBio: localizedText,
    profileBody: localizedText,
    expertise: z.array(z.string()),
    researchInterests: z.object({
      id: z.array(z.string()),
      en: z.array(z.string()),
    }),
    email: z.string(),
    googleScholarUrl: z.url(),
    institutionalUrl: z.url().optional(),
    orcidUrl: z.url().optional(),
    scopusUrl: z.url().optional(),
    featured: z.boolean().default(false),
    order: z.number().int(),
  }),
})

const publicationsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    year: z.number().int(),
    type: z.enum(['journal', 'conference', 'book-chapter', 'proceeding', 'preprint']),
    venue: z.string(),
    authors: z.array(z.string()),
    url: z.url(),
    doi: z.string().optional(),
    googleScholarUrl: z.url().optional(),
    researchers: z.array(z.string()),
    featured: z.boolean().default(false),
    language: z.enum(['id', 'en']).default('en'),
  }),
})

export const collections = {
  blog: blogCollection,
  researchers: researchersCollection,
  publications: publicationsCollection,
}
