<template>
  <div class="px-8 py-5">
    <h1>{{ t.blog.archiveHeading }}</h1>
    <p class="text-neutral-500 text-sm mt-1 mb-8">{{ t.blog.archiveDescription }}</p>

    <div v-if="filteredPosts.length === 0" class="text-center py-20">
      <p class="text-neutral-400">{{ t.blog.noPosts }}</p>
    </div>

    <div v-else class="space-y-5 mt-6">
      <article v-for="post in filteredPosts" :key="post.id" class="group border-t border-primary/10 pt-5 grid sm:grid-cols-[8rem_minmax(0,1fr)] gap-4">
        <div class="text-xs text-neutral-400 space-y-1 pt-0.5">
          <span class="block font-mono uppercase tracking-wider" :class="categoryStyle(post.category)">
            {{ categoryLabel(post.category) }}
          </span>
          <time :datetime="asDate(post.date).toISOString()" class="block">
            {{ formatDate(post.date) }}
          </time>
        </div>
        <div>
          <h2 class="font-serif text-base font-semibold text-primary leading-snug mb-1 group-hover:text-primary/80 transition-colors">
            <a :href="`/blog/${post.id}`" class="hover:underline decoration-primary/20 underline-offset-4">
              {{ lang === 'id' && post.titleId ? post.titleId : post.title }}
            </a>
          </h2>
          <p class="text-sm text-neutral-500 leading-relaxed mb-2">
            {{ lang === 'id' && post.excerptId ? post.excerptId : post.excerpt }}
          </p>
          <a :href="`/blog/${post.id}`" class="text-xs font-mono text-primary/40 hover:text-primary transition-colors">
            {{ t.news.readMore }} →
          </a>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useVSCodeLayout } from '../composables/useVSCodeLayout'

const props = defineProps<{
  posts: Array<{
    id: string
    title: string
    titleId?: string
    excerpt?: string
    excerptId?: string
    category: string
    date: Date | string
  }>
}>()

const { lang, t } = useI18n()
const { activeFilters } = useVSCodeLayout()

const filteredPosts = computed(() =>
  props.posts.filter(p => !activeFilters.category || p.category === activeFilters.category)
)

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
    news: 'text-accent',
    event: 'text-primary',
  }
  return styles[cat] || 'text-neutral-400'
}

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    announcement: t.value.blog.categoryAnnouncement,
    news: t.value.blog.categoryNews,
    event: t.value.blog.categoryEvent,
  }
  return map[cat] || cat
}
</script>
