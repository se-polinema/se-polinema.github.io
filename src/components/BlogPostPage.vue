<template>
  <h1>{{ displayTitle }}</h1>

  <p class="font-mono text-[11.5px] text-neutral-400 dark:text-gray-500 mt-1 mb-2 italic">
    {{ displayDate }} &middot; <a :href="withBase(`/blog/category/${category}`)" class="text-neutral-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-300 transition-colors no-underline hover:underline">{{ category }}</a> &middot; {{ readingTimeLabel }}
  </p>
  <p class="flex items-center gap-1.5 font-mono text-[11.5px] text-neutral-400 dark:text-gray-500 italic mb-3">
    <span>{{ t.blog.authorBy }}</span>
    <template v-if="props.matchedResearcher">
      <a
        :href="withBase(`/researchers/${props.matchedResearcher.id}`)"
        class="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline hover:underline"
      >
        <img
          :src="withBase(props.matchedResearcher.photo)"
          :alt="props.matchedResearcher.name"
          class="w-4 h-4 rounded-full object-cover"
          width="16"
          height="16"
        />
        <span>{{ props.matchedResearcher.name }}</span>
      </a>
    </template>
    <template v-else>
      <span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-300 dark:bg-neutral-600 text-[9px] font-bold text-neutral-600 dark:text-neutral-300 not-italic leading-none">SE</span>
      <span>{{ props.author }}</span>
    </template>
  </p>
  <p v-if="freshnessText" class="flex flex-wrap items-center gap-1.5 font-mono text-[11px] mb-2">
    <span :class="freshnessBadgeClass">{{ freshnessText }}</span>
  </p>
  <p v-if="displayTags.length > 0" class="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-neutral-400 dark:text-gray-500 mb-6">
    <span>{{ t.blog.tags }}:</span>
    <a
      v-for="tag in displayTags"
      :key="tag.slug"
      :href="withBase(`/blog/tags/${tag.slug}`)"
      class="inline-block px-2 py-0.5 rounded border border-neutral-200 dark:border-gray-600 text-neutral-500 dark:text-gray-400 hover:text-primary dark:hover:text-gray-200 hover:border-primary/30 dark:hover:border-gray-400 transition-colors no-underline"
    >{{ tag.label }}</a>
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'

const STALE_THRESHOLD_MS = 18 * 30.44 * 24 * 60 * 60 * 1000

const props = defineProps<{
  title: string
  titleId?: string
  category: string
  date: Date | string
  author: string
  readingTime?: number
  matchedResearcher?: { id: string; name: string; photo: string }
  tags?: string[]
  tagsId?: string[]
  updated?: Date | string
  reviewed?: Date | string
  outdated?: boolean
}>()

const { lang, t } = useI18n()

const displayTitle = computed(() =>
  lang.value === 'id' && props.titleId ? props.titleId : props.title
)

const displayTags = computed(() => {
  const en = props.tags ?? []
  const id = props.tagsId ?? []
  const max = Math.max(en.length, id.length)
  const result: { label: string; slug: string }[] = []
  for (let i = 0; i < max; i++) {
    const label = (lang.value === 'id' && id[i]) ? id[i] : (en[i] ?? '')
    const slug = slugify(en[i] ?? id[i] ?? '')
    if (slug) result.push({ label, slug })
  }
  return result
})

function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function formatDate(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d as string)
  return new Intl.DateTimeFormat(lang.value === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const displayDate = computed(() => formatDate(props.date))

const effectiveDate = computed(() =>
  props.updated ? (props.updated instanceof Date ? props.updated : new Date(props.updated as string))
    : props.reviewed ? (props.reviewed instanceof Date ? props.reviewed : new Date(props.reviewed as string))
    : props.date instanceof Date ? props.date : new Date(props.date as string)
)

const isStale = computed(() => {
  if (props.outdated) return true
  const baseDate = effectiveDate.value
  const now = new Date()
  return (now.getTime() - baseDate.getTime()) > STALE_THRESHOLD_MS
})

const freshnessText = computed(() => {
  if (props.updated) {
    return t.value.blog.lastUpdated.replace('{date}', formatDate(props.updated!))
  }
  if (props.reviewed) {
    return t.value.blog.reviewed.replace('{date}', formatDate(props.reviewed!))
  }
  if (isStale.value) {
    return t.value.blog.outdatedWarning
  }
  return ''
})

const freshnessBadgeClass = computed(() => {
  if (props.updated) return 'inline-block px-2 py-0.5 rounded text-success'
  if (props.reviewed) return 'inline-block px-2 py-0.5 rounded text-info'
  if (isStale.value) return 'inline-block px-2 py-0.5 rounded border border-warning/40 text-warning'
  return 'hidden'
})

const readingTimeLabel = computed(() => {
  if (!props.readingTime) return ''
  return t.value.blog.readingTime.replace('{minutes}', String(props.readingTime))
})
</script>
