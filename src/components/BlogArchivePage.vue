<template>
  <div class="px-8 py-5">
    <h1>{{ heading }}</h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm mt-1 mb-8">{{ description }}</p>

    <div v-if="isLoading" class="text-center py-20">
      <p class="text-neutral-400 dark:text-gray-500">{{ t.blog.loading }}</p>
    </div>

    <div v-else-if="filteredPosts.length === 0" class="text-center py-20">
      <p class="text-neutral-400 dark:text-gray-500">{{ t.blog.noPosts }}</p>
    </div>

    <div v-else class="space-y-5 mt-6">
      <article v-for="post in paginatedPosts" :key="post.id" class="group border-t border-primary/10 dark:border-gray-700 pt-5 grid sm:grid-cols-[8rem_minmax(0,1fr)] gap-4">
        <div class="text-xs text-neutral-400 dark:text-gray-500 space-y-1 pt-0.5">
          <a
            :href="`/blog/category/${post.category}`"
            class="block font-mono uppercase tracking-wider no-underline hover:underline"
            :class="categoryStyle(post.category)"
          >
            {{ categoryLabel(post.category) }}
          </a>
          <time :datetime="asDate(post.date).toISOString()" class="block">
            {{ formatDate(post.date) }}
          </time>
        </div>
        <div>
          <h2 class="font-serif text-base font-semibold text-primary dark:text-gray-100 leading-snug mb-1 group-hover:text-primary/80 dark:group-hover:text-gray-300 transition-colors">
            <a :href="`/blog/${post.id}`" class="hover:underline decoration-primary/20 underline-offset-4">
              {{ lang === 'id' && post.titleId ? post.titleId : post.title }}
            </a>
          </h2>
          <p class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed mb-2">
            {{ lang === 'id' && post.excerptId ? post.excerptId : post.excerpt }}
          </p>
          <div v-if="displayTags(post).length > 0" class="flex flex-wrap items-center gap-1 mb-2">
            <a
              v-for="tag in displayTags(post)"
              :key="tag.slug"
              :href="`/blog/tags/${tag.slug}`"
              class="inline-block px-1.5 py-px text-[10px] font-mono rounded border border-neutral-200 dark:border-gray-600 text-neutral-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-300 hover:border-primary/30 dark:hover:border-gray-400 transition-colors no-underline"
            >{{ tag.label }}</a>
          </div>
          <a :href="`/blog/${post.id}`" class="text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors">
            {{ t.news.readMore }} →
          </a>
        </div>
      </article>

      <Pagination v-model:current-page="currentPage" :total-pages="totalPages" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useVSCodeLayout } from '../composables/useVSCodeLayout'
import Pagination from './Pagination.vue'

interface Post {
  id: string
  title: string
  titleId?: string
  excerpt?: string
  excerptId?: string
  category: string
  date: Date | string
  tags?: string[]
  tagsId?: string[]
}

const props = defineProps<{
  // Pre-filtered posts, passed by the static category/tag archive routes
  // (/blog/category/[category], /blog/tags/[tag]) — those are already
  // small, build-time-scoped lists. Omitted by the main /blog archive,
  // which instead fetches the full index client-side (see onMounted
  // below) so that page's own HTML stays constant-size as the blog grows.
  posts?: Post[]
  activeCategory?: string
  // Tag slug, passed by /blog/tags/[tag].astro — drives the heading below
  // (previously only activeCategory did, leaving the tag archive page
  // stuck on the generic "Blog Archive" heading even though the posts
  // themselves were already correctly filtered).
  activeTag?: string
}>()

const { lang, t } = useI18n()
const { activeFilters } = useVSCodeLayout()

const fetchedPosts = ref<Post[] | null>(null)
// Starts true (rather than false) whenever a fetch will actually happen —
// i.e. no `posts` prop was passed — so the SSR-rendered HTML (and the
// pre-hydration client render, which must match it) shows a loading
// state instead of a misleading "no posts" empty state before the
// client-side fetch resolves.
const isLoading = ref(!props.posts)

const sourcePosts = computed(() => props.posts ?? fetchedPosts.value ?? [])

onMounted(async () => {
  if (props.posts) return
  isLoading.value = true
  try {
    const res = await fetch('/api/blog-index.json')
    fetchedPosts.value = await res.json()
  } catch {
    fetchedPosts.value = []
  } finally {
    isLoading.value = false
  }
})

const filteredPosts = computed(() => {
  if (props.activeCategory || props.activeTag) return sourcePosts.value
  let result = sourcePosts.value
  if (activeFilters.category) {
    result = result.filter(p => p.category === activeFilters.category)
  }
  if (activeFilters.tag) {
    result = result.filter(p => {
      const tags = p.tags ?? []
      const tagsId = p.tagsId ?? []
      const allSlugs: string[] = []
      for (const t of tags) allSlugs.push(t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
      for (const t of tagsId) allSlugs.push(t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
      return allSlugs.includes(activeFilters.tag!)
    })
  }
  return result
})

const categoryLabelForHeader = computed(() => {
  if (!props.activeCategory) return ''
  const map: Record<string, string> = {
    announcement: t.value.blog.categoryAnnouncement,
    news: t.value.blog.categoryNews,
    event: t.value.blog.categoryEvent,
    tutorial: t.value.blog.categoryTutorial,
  }
  return map[props.activeCategory] || props.activeCategory
})

// Tags are free-form per-post strings, not a fixed enum like categories,
// so there's no t.value.blog.tag<X> lookup — resolve the display label
// from the filtered posts' own tag data instead (reactive to the active
// language, unlike a single label baked in at build time).
const tagLabelForHeader = computed(() => {
  if (!props.activeTag) return ''
  for (const post of sourcePosts.value) {
    const tags = post.tags ?? []
    const tagsId = post.tagsId ?? []
    const max = Math.max(tags.length, tagsId.length)
    for (let i = 0; i < max; i++) {
      const en = tags[i] ?? ''
      const id = tagsId[i] ?? ''
      if (slugify(en || id) === props.activeTag) {
        return (lang.value === 'id' && id) ? id : (en || id)
      }
    }
  }
  return props.activeTag
})

const heading = computed(() => {
  if (props.activeTag) return t.value.blog.tagArchiveHeading.replace('{tag}', tagLabelForHeader.value)
  if (!props.activeCategory) return t.value.blog.archiveHeading
  return t.value.blog.categoryArchiveHeading.replace('{category}', categoryLabelForHeader.value)
})

const description = computed(() => {
  if (props.activeTag) return t.value.blog.tagArchiveDescription.replace('{tag}', tagLabelForHeader.value)
  if (!props.activeCategory) return t.value.blog.archiveDescription
  return t.value.blog.categoryArchiveDescription.replace('{category}', categoryLabelForHeader.value)
})

function asDate(date: Date | string): Date {
  return date instanceof Date ? date : new Date(date as string)
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat(lang.value === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(asDate(date))
}

function categoryStyle(cat: string): string {
  const styles: Record<string, string> = {
    announcement: 'text-primary',
    news: 'text-accent-700 dark:text-accent-400',
    event: 'text-primary',
    tutorial: 'text-green-600 dark:text-green-400',
  }
  return styles[cat] || 'text-neutral-400 dark:text-gray-500'
}

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    announcement: t.value.blog.categoryAnnouncement,
    news: t.value.blog.categoryNews,
    event: t.value.blog.categoryEvent,
    tutorial: t.value.blog.categoryTutorial,
  }
  return map[cat] || cat
}

function displayTags(post: Post): { label: string; slug: string }[] {
  const en = post.tags ?? []
  const id = post.tagsId ?? []
  const max = Math.max(en.length, id.length)
  const result: { label: string; slug: string }[] = []
  for (let i = 0; i < max; i++) {
    const label = (lang.value === 'id' && id[i]) ? id[i] : (en[i] ?? '')
    const slug = slugify(en[i] ?? id[i] ?? '')
    if (slug) result.push({ label, slug })
  }
  return result
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const PAGE_SIZE = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / PAGE_SIZE)))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredPosts.value.slice(start, start + PAGE_SIZE)
})

// filteredPosts only changes when a filter or the fetched index changes —
// never as a side effect of paging — so resetting to page 1 here can't
// fight the user's own page navigation.
watch(filteredPosts, () => {
  currentPage.value = 1
})
</script>
