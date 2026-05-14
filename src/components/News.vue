<template>
  <section id="news" class="py-20 md:py-32 bg-neutral-50">
    <div class="section-container">
      <div class="flex items-end justify-between mb-16">
        <div>
          <div class="section-label">{{ t.news.label }}</div>
          <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight">
            {{ t.news.heading }}
          </h2>
        </div>
        <a
          v-if="posts.length > 0"
          href="/blog"
          class="hidden sm:inline-flex items-center gap-2 text-sm text-brand-navy/60 hover:text-brand-navy transition-colors"
        >
          {{ t.news.viewAll }}
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div v-if="posts.length > 0" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="post in posts"
          :key="post.slug"
          class="group bg-white border border-neutral-100 hover:border-brand-navy/10 transition-colors p-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <span
              class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5"
              :class="categoryStyle(post.category)"
            >
              {{ categoryLabel(post.category) }}
            </span>
            <time
              :datetime="post.date.toISOString()"
              class="text-xs text-neutral-400"
            >
              {{ formatDate(post.date) }}
            </time>
          </div>

          <h3 class="font-serif text-lg font-semibold text-brand-navy mb-2 group-hover:text-brand-navy/80 transition-colors">
            <a :href="'/blog/' + post.slug" class="hover:underline decoration-brand-navy/20 underline-offset-4">
              {{ lang === 'id' && post.titleId ? post.titleId : post.title }}
            </a>
          </h3>

          <p class="text-sm text-neutral-500 leading-relaxed mb-4">
            {{ lang === 'id' && post.excerptId ? post.excerptId : post.excerpt }}
          </p>

          <a
            :href="'/blog/' + post.slug"
            class="text-xs font-medium text-brand-navy/50 hover:text-brand-navy transition-colors"
          >
            {{ t.news.readMore }} &rarr;
          </a>
        </article>
      </div>

      <div v-else class="text-center text-neutral-400 py-16">
        <p>{{ t.news.empty }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

defineProps<{
  posts: Array<{
    slug: string
    title: string
    titleId?: string
    date: Date
    category: string
    excerpt?: string
    excerptId?: string
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
  const labels: Record<string, string> = {
    announcement: 'news.categoryAnnouncement',
    news: 'news.categoryNews',
    event: 'news.categoryEvent',
  }
  const key = labels[cat] || 'news.categoryNews'
  const [section, field] = key.split('.')
  const result = (t.value as Record<string, any>)[section]?.[field]
  return typeof result === 'string' ? result : cat
}
</script>
