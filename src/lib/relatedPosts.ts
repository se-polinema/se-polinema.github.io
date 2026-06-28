export interface PostData {
  title: string
  titleId?: string
  category: string
  author: string
  tags?: string[]
  date: Date
  excerpt?: string
  excerptId?: string
}

export interface PostEntry {
  id: string
  data: PostData
}

export interface RelatedPost {
  id: string
  title: string
  titleId?: string
  category: string
  date: string
  excerpt?: string
  excerptId?: string
}

export interface NavPost {
  id: string
  title: string
  titleId?: string
}

function toRelatedPost(entry: PostEntry): RelatedPost {
  return {
    id: entry.id,
    title: entry.data.title,
    titleId: entry.data.titleId,
    category: entry.data.category,
    date: entry.data.date.toISOString(),
    excerpt: entry.data.excerpt,
    excerptId: entry.data.excerptId,
  }
}

function toNavPost(entry: PostEntry): NavPost {
  return {
    id: entry.id,
    title: entry.data.title,
    titleId: entry.data.titleId,
  }
}

export function getRelatedPosts(posts: PostEntry[], slug: string, max = 4): RelatedPost[] {
  const current = posts.find((p) => p.id === slug)
  if (!current) return []

  const others = posts.filter((p) => p.id !== slug)

  const scored = others.map((post) => {
    let score = 0
    if (post.data.category === current.data.category) score += 3
    if (post.data.author === current.data.author) score += 2
    const currentTags = current.data.tags ?? []
    const postTags = post.data.tags ?? []
    const commonTags = currentTags.filter((t) => postTags.includes(t))
    score += commonTags.length * 5
    // Boost tutorials for tutorial posts
    if (current.data.category === 'tutorial' && post.data.category === 'tutorial') score += 1
    return { post, score }
  })

  const relevant = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score)
  const selectedIds = new Set<string>()
  const result: PostEntry[] = []

  for (const s of relevant) {
    if (result.length >= max) break
    result.push(s.post)
    selectedIds.add(s.post.id)
  }

  if (result.length < max) {
    const sameCategory = others
      .filter((p) => p.data.category === current.data.category)
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

    for (const p of sameCategory) {
      if (result.length >= max) break
      if (!selectedIds.has(p.id)) {
        result.push(p)
        selectedIds.add(p.id)
      }
    }
  }

  return result.map(toRelatedPost)
}

export function getTutorialNavigation(posts: PostEntry[], slug: string): {
  previous: NavPost | null
  next: NavPost | null
} {
  const tutorials = posts
    .filter((p) => p.data.category === 'tutorial')
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime())

  const idx = tutorials.findIndex((p) => p.id === slug)
  if (idx === -1) return { previous: null, next: null }

  return {
    previous: idx > 0 ? toNavPost(tutorials[idx - 1]) : null,
    next: idx < tutorials.length - 1 ? toNavPost(tutorials[idx + 1]) : null,
  }
}
