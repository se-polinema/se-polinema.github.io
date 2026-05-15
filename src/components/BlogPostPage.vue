<template>
  <article class="min-h-screen pt-24 pb-20 bg-white">
    <div class="section-container">
      <a href="/blog" class="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary transition-colors mb-8">
        &larr; {{ t.blog.backToBlog }}
      </a>

      <div class="max-w-2xl mx-auto">
        <div class="flex items-center gap-3 mb-6">
          <span class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5" :class="categoryStyle(category)">
            {{ categoryLabel(category) }}
          </span>
          <time :datetime="date.toISOString()" class="text-xs text-neutral-400">
            {{ formatDate(date) }}
          </time>
        </div>

        <h1 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight mb-8">
          {{ lang === 'id' && titleId ? titleId : title }}
        </h1>

        <div class="prose prose-neutral prose-lg max-w-none font-sans">
          <slot />
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const props = defineProps<{
  title: string
  titleId?: string
  category: string
  date: Date
}>()

const { lang, t } = useI18n()

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(lang.value === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function categoryStyle(cat: string): string {
  const styles: Record<string, string> = {
    announcement: 'bg-primary/10 text-primary',
    news: 'bg-accent/15 text-primary',
    event: 'bg-primary/10 text-primary',
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

const { title, titleId, category, date } = props
</script>
