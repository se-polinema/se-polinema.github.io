import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

export const BLOG_CATEGORIES = ['announcement', 'news', 'event', 'tutorial'] as const
export type BlogCategory = (typeof BLOG_CATEGORIES)[number]

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
    category: z.enum(BLOG_CATEGORIES),
    author: z.string().default('SE Lab'),
    lang: z.enum(['en', 'id']).default('en'),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    excerpt: z.string().optional(),
    excerptId: z.string().optional(),
    eventDate: z.date().optional(),
    eventEndDate: z.date().optional(),
    location: z.string().optional(),
    locationId: z.string().optional(),
    registrationUrl: z.string().optional(),
    stream: z.string().optional(),
    managed: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
    tagsId: z.array(z.string()).optional(),
    updated: z.date().optional(),
    reviewed: z.date().optional(),
    outdated: z.boolean().optional(),
    series: z.string().optional(),
    seriesOrder: z.number().int().optional(),
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
    projects: z.array(z.object({
      name: z.string().optional(),
      nameId: z.string().optional(),
      repo: z.string(),
      description: z.string().optional(),
      descriptionId: z.string().optional(),
    })).optional(),
    books: z.array(z.object({
      title: z.string(),
      titleId: z.string().optional(),
      slug: z.string().optional(),
      url: z.url().optional(),
      playstoreUrl: z.url().optional(),
      coverImage: z.string().optional(),
      description: z.string().optional(),
      descriptionId: z.string().optional(),
      year: z.number().int().optional(),
      publisher: z.string().optional(),
      isbn: z.string().optional(),
    })).optional(),
    decks: z.array(z.object({
      title: z.string(),
      url: z.url(),
      type: z.enum(['web', 'pdf', 'pptx', 'google-slides', 'canva', 'other']),
      embedUrl: z.url().optional(),
      description: z.string().optional(),
      date: z.string().optional(),
    })).optional(),
    streams: z.array(z.string()).optional(),
    certifications: z.array(z.object({
      name: z.string(),
      nameId: z.string().optional(),
      issuer: z.string(),
      issueDate: z.string().optional(),
      credentialUrl: z.url().optional(),
      logo: z.string().optional(),
    })).optional(),
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
    citedByCount: z.number().int().optional(),
    researchers: z.array(z.string()),
    featured: z.boolean().default(false),
    language: z.enum(['id', 'en']).default('en'),
  }),
})

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    titleId: z.string().optional(),
    description: z.string(),
    descriptionId: z.string().optional(),
    status: z.enum(['active', 'completed', 'prototype', 'under-development']).default('active'),
    techStack: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    contributors: z.array(z.string()).default([]),
    researchers: z.array(z.string()).default([]),
    stream: z.string().optional(),
    demoUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    repo: z.string(),
    featured: z.boolean().default(false),
    private: z.boolean().default(false),
  }),
})

const presentationsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/presentations' }),
  schema: z.object({
    title: z.string(),
    titleId: z.string().optional(),
    event: z.string().optional(),
    author: z.string().default('SE Lab'),
    date: z.date().optional(),
    theme: z.enum(['auto', 'light', 'dark']).default('auto'),
  }),
})

// Alumni (and current student members) moved to Supabase (se.members table) —
// see MemberDirectoryPage.vue, src/pages/alumni/, src/pages/members/, and
// supabase/migrations/008_members.sql. No longer a content collection.

export const RESOURCE_TYPES = ['tutorial', 'book', 'deck', 'tool', 'dataset', 'course', 'paper'] as const
export type ResourceType = (typeof RESOURCE_TYPES)[number]

export const RESOURCE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const
export type ResourceLevel = (typeof RESOURCE_LEVELS)[number]

export const resourceSchema = z.object({
  title: z.string(),
  titleId: z.string(),
  description: z.string(),
  descriptionId: z.string(),
  stream: z.string(),
  type: z.enum(RESOURCE_TYPES),
  level: z.enum(RESOURCE_LEVELS),
  url: z.string(),
  internal: z.boolean().optional(),
})

export type Resource = z.infer<typeof resourceSchema>

export const collections = {
  blog: blogCollection,
  researchers: researchersCollection,
  publications: publicationsCollection,
  projects: projectsCollection,
  presentations: presentationsCollection,
}
