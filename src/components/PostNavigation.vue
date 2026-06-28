<template>
  <nav
    v-if="hasContent"
    class="mt-16 pt-8 border-t border-neutral-200 dark:border-gray-700"
    aria-label="Post navigation"
  >
    <section v-if="relatedPosts.length > 0" :aria-label="t.blog.relatedPosts">
      <h2 class="font-mono text-xs uppercase tracking-[0.2em] text-primary/60 mb-4">
        {{ t.blog.relatedPosts }}
      </h2>
      <ul class="space-y-3 mb-8">
        <li v-for="post in relatedPosts" :key="post.id">
          <a
            :href="`/blog/${post.id}`"
            class="block group border border-neutral-100 dark:border-gray-800 p-4 hover:border-primary/20 dark:hover:border-primary/20 transition-colors"
          >
            <div class="flex items-center gap-2 mb-1">
              <span
                class="font-mono text-[10px] uppercase tracking-wider"
                :class="categoryStyle(post.category)"
              >
                {{ categoryLabel(post.category) }}
              </span>
              <span class="text-neutral-300 dark:text-gray-600">|</span>
              <time
                :datetime="post.date"
                class="font-mono text-[10px] text-neutral-400 dark:text-gray-500"
              >
                {{ formatDate(post.date) }}
              </time>
            </div>
            <h3 class="font-serif text-sm font-semibold text-primary dark:text-gray-100 leading-snug group-hover:text-primary/80 dark:group-hover:text-gray-300 transition-colors">
              {{ displayTitle(post) }}
            </h3>
            <p
              v-if="displayExcerpt(post)"
              class="text-xs text-neutral-500 dark:text-gray-400 leading-relaxed mt-1 line-clamp-2"
            >
              {{ displayExcerpt(post) }}
            </p>
          </a>
        </li>
      </ul>
    </section>

    <nav
      v-if="previous || next"
      class="flex justify-between items-center gap-4"
      aria-label="Previous and next tutorial"
    >
      <a
        v-if="previous"
        :href="`/blog/${previous.id}`"
        class="flex items-center gap-2 text-sm font-mono text-primary/70 dark:text-gray-400 hover:text-primary dark:hover:text-gray-200 transition-colors group"
      >
        <span class="text-xs group-hover:-translate-x-0.5 transition-transform">&larr;</span>
        <span class="hidden sm:inline">{{ t.blog.previousPost }}</span>
        <span class="hidden sm:inline text-neutral-300 dark:text-gray-600">|</span>
        <span class="truncate max-w-[160px] sm:max-w-[200px]">
          {{ displayTitle(previous) }}
        </span>
      </a>
      <span v-else class="flex-1" />
      <a
        v-if="next"
        :href="`/blog/${next.id}`"
        class="flex items-center gap-2 text-sm font-mono text-primary/70 dark:text-gray-400 hover:text-primary dark:hover:text-gray-200 transition-colors group ml-auto text-right"
      >
        <span class="truncate max-w-[160px] sm:max-w-[200px]">
          {{ displayTitle(next) }}
        </span>
        <span class="hidden sm:inline text-neutral-300 dark:text-gray-600">|</span>
        <span class="hidden sm:inline">{{ t.blog.nextPost }}</span>
        <span class="text-xs group-hover:translate-x-0.5 transition-transform">&rarr;</span>
      </a>
      <span v-else class="flex-1" />
    </nav>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

interface RelatedPost {
  id: string
  title: string
  titleId?: string
  category: string
  date: string
  excerpt?: string
  excerptId?: string
}

interface NavPost {
  id: string
  title: string
  titleId?: string
}

const props = defineProps<{
  relatedPosts: RelatedPost[]
  previous: NavPost | null
  next: NavPost | null
}>()

const { lang, t } = useI18n()

const hasContent = computed(
  () => props.relatedPosts.length > 0 || props.previous !== null || props.next !== null
)

function displayTitle(post: RelatedPost | NavPost): string {
  return lang.value === 'id' && post.titleId ? post.titleId : post.title
}

function displayExcerpt(post: RelatedPost): string | undefined {
  if (!post.excerpt && !post.excerptId) return undefined
  return lang.value === 'id' && post.excerptId ? post.excerptId : post.excerpt
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat(lang.value === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

function categoryStyle(cat: string): string {
  const styles: Record<string, string> = {
    announcement: 'text-primary',
    news: 'text-accent',
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
</script>
