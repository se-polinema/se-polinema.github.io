<template>
  <main class="min-h-screen pt-24 pb-20 bg-white">
    <div class="section-container">
      <a href="/" class="inline-flex items-center gap-2 text-sm text-brand-navy/60 hover:text-brand-navy transition-colors mb-8">
        &larr; {{ t.blog.backToHome }}
      </a>

      <div class="max-w-3xl mb-16">
        <div class="section-label">{{ t.blog.heading }}</div>
        <h1 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight mb-6">
          {{ t.blog.archiveHeading }}
        </h1>
        <p class="text-neutral-600 leading-relaxed text-lg">
          {{ t.blog.archiveDescription }}
        </p>
      </div>

      <div v-if="posts.length === 0" class="text-center py-20">
        <p class="text-neutral-400">{{ t.blog.noPosts }}</p>
      </div>

      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article v-for="post in posts" :key="post.id" class="group bg-neutral-50 border border-neutral-100 hover:border-brand-navy/10 transition-colors p-6">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5" :class="categoryStyle(post.category)">
              {{ categoryLabel(post.category) }}
            </span>
            <time :datetime="post.date.toISOString()" class="text-xs text-neutral-400">
              {{ formatDate(post.date) }}
            </time>
          </div>

          <h2 class="font-serif text-lg font-semibold text-brand-navy mb-2 group-hover:text-brand-navy/80 transition-colors">
            <a :href="`/blog/${post.id}`" class="hover:underline decoration-brand-navy/20 underline-offset-4">
              {{ lang === 'id' && post.titleId ? post.titleId : post.title }}
            </a>
          </h2>

          <p class="text-sm text-neutral-500 leading-relaxed mb-4">
            {{ lang === 'id' && post.excerptId ? post.excerptId : post.excerpt }}
          </p>

          <a :href="`/blog/${post.id}`" class="text-xs font-medium text-brand-navy/50 hover:text-brand-navy transition-colors">
            {{ t.news.readMore }} &rarr;
          </a>
        </article>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

defineProps<{
  posts: Array<{
    id: string
    title: string
    titleId?: string
    excerpt?: string
    excerptId?: string
    category: string
    date: Date
  }>
}>()

const { lang, t } = useI18n()

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(lang.value === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function categoryStyle(cat: string): string {
  const styles: Record<string, string> = {
    announcement: 'bg-brand-red/10 text-brand-red',
    news: 'bg-brand-yellow/10 text-brand-navy',
    event: 'bg-brand-purple/10 text-brand-purple',
  }
  return styles[cat] || 'bg-neutral-100 text-neutral-500'
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
