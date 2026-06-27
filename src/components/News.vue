<template>
  <section id="blog" class="py-20 md:py-32 bg-neutral-50">
    <div class="section-container">
      <div class="flex items-end justify-between mb-16">
        <div class="relative overflow-hidden">
          <span class="absolute -top-4 right-0 font-mono text-[8rem] font-bold text-primary/[0.04] leading-none select-none pointer-events-none" aria-hidden="true">05</span>
          <div class="section-label">{{ t.news.label }}</div>
          <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
            {{ t.news.heading }}
          </h2>
        </div>
        <a
          v-if="posts.length > 0"
          href="/blog"
          class="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary transition-colors"
        >
          {{ t.news.viewAll }}
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div v-if="posts.length > 0" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="post in posts"
          :key="post.slug"
          class="group bg-white border border-neutral-100 hover:border-primary/10 transition-colors p-6"
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

          <h3 class="font-serif text-lg font-semibold text-primary mb-2 group-hover:text-primary/80 transition-colors">
            <a :href="'/blog/' + post.slug" class="hover:underline decoration-primary/20 underline-offset-4">
              {{ lang === 'id' && post.titleId ? post.titleId : post.title }}
            </a>
          </h3>

          <p class="text-sm text-neutral-500 leading-relaxed mb-4">
            {{ lang === 'id' && post.excerptId ? post.excerptId : post.excerpt }}
          </p>

          <a
            :href="'/blog/' + post.slug"
            class="text-xs font-medium text-primary/50 hover:text-primary transition-colors"
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
    announcement: 'bg-primary/10 text-primary',
    news: 'bg-accent/15 text-primary',
    event: 'bg-primary/10 text-primary',
    tutorial: 'bg-green-100 text-green-800',
  }
  return styles[cat] || 'bg-neutral-100 text-neutral-500'
}

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    announcement: t.value.blog.categoryAnnouncement,
    news: t.value.blog.categoryNews,
    event: t.value.blog.categoryEvent,
    tutorial: t.value.blog.categoryTutorial,
  }
  return map[cat] ?? cat
}
</script>
