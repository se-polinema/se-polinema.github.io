export interface Tool {
  title: string
  titleId: string
  description: string
  descriptionId: string
  stream: string
  type: 'tool' | 'dataset' | 'framework' | 'prototype' | 'library'
  status: 'active' | 'archived' | 'experimental'
  repoUrl?: string
  demoUrl?: string
  docsUrl?: string
  license?: string
  techStack: string[]
  researchers: string[]
  publicationSlug?: string
}
