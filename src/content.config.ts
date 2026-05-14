import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

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

export const collections = {
  blog: blogCollection,
}
