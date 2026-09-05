<template>
  <div class="px-8 py-5">
    <a :href="withBase(`/events`)" class="inline-flex items-center gap-1 text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors mb-6">
      ← {{ t.events.backToEvents }}
    </a>

    <h1>{{ displayTitle }}</h1>

    <p class="font-mono text-[11.5px] text-neutral-400 dark:text-gray-500 mt-1 mb-2 italic">
      {{ displayDate }} &middot; {{ categoryLabel }}
    </p>
    <p class="flex items-center gap-1.5 font-mono text-[11.5px] text-neutral-400 dark:text-gray-500 italic mb-6">
      <span>{{ t.blog.authorBy }}</span>
      <template v-if="props.matchedResearcher">
        <a
          :href="withBase(`/researchers/${props.matchedResearcher.id}`)"
          class="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline hover:underline"
        >
          <img
            :src="props.matchedResearcher.image?.src ?? withBase(props.matchedResearcher.photo)"
            :srcset="props.matchedResearcher.image?.srcset"
            :sizes="props.matchedResearcher.image?.sizes"
            :alt="props.matchedResearcher.name"
            class="w-4 h-4 rounded-full object-cover"
            width="16"
            height="16"
            loading="lazy"
            decoding="async"
          />
          <span>{{ props.matchedResearcher.name }}</span>
        </a>
      </template>
      <template v-else>
        <span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-300 dark:bg-neutral-600 text-[9px] font-bold text-neutral-600 dark:text-neutral-300 not-italic leading-none">SE</span>
        <span>{{ props.author }}</span>
      </template>
    </p>

    <div v-if="hasEventMeta" class="grid sm:grid-cols-2 gap-3 mb-8 p-5 border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50">
      <div class="flex items-start gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-primary/40 dark:text-gray-500 mt-0.5 shrink-0">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <div>
          <div class="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-0.5">{{ t.events.eventDate }}</div>
          <div class="text-sm font-medium text-primary dark:text-gray-100">{{ formatEventDate() }}</div>
        </div>
      </div>
      <div v-if="displayLocation()" class="flex items-start gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-primary/40 dark:text-gray-500 mt-0.5 shrink-0">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        <div>
          <div class="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-0.5">{{ t.events.location }}</div>
          <div class="text-sm font-medium text-primary dark:text-gray-100">{{ displayLocation() }}</div>
        </div>
      </div>
    </div>

    <div v-if="hasActions" class="flex flex-wrap items-center gap-3 mb-8">
      <a
        v-if="props.registrationUrl"
        :href="props.registrationUrl"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>
        </svg>
        {{ t.events.registerCta }}
      </a>
      <a
        v-if="props.stream"
        :href="props.stream"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono text-primary dark:text-gray-100 border border-primary/20 dark:border-gray-600 hover:bg-primary/5 dark:hover:bg-gray-700 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
        {{ t.events.streamCta }}
      </a>
    </div>

    <div class="prose prose-slate dark:prose-invert max-w-none bilingual-post">
      <Content />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'

const props = defineProps<{
  title: string
  titleId?: string
  category: string
  date: Date | string
  author: string
  eventDate?: Date | string
  eventEndDate?: Date | string
  location?: string
  locationId?: string
  registrationUrl?: string
  stream?: string
  readingTime?: number
  matchedResearcher?: {
    id: string
    name: string
    photo: string
    image: {
      src: string
      srcset: string
      sizes: string
      width: number
      height: number
    } | null
  }
  Content: any
}>()

const { lang, t } = useI18n()

const displayTitle = computed(() =>
  lang.value === 'id' && props.titleId ? props.titleId : props.title
)

const displayDate = computed(() => {
  const d = props.date instanceof Date ? props.date : new Date(props.date as string)
  return new Intl.DateTimeFormat(lang.value === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
})

const categoryLabel = computed(() => t.value.blog.categoryEvent)

const hasEventMeta = computed(() => !!props.eventDate || !!props.location || !!props.locationId)

const hasActions = computed(() => !!props.registrationUrl || !!props.stream)

function asDate(date: Date | string): Date {
  return date instanceof Date ? date : new Date(date)
}

function formatEventDate(): string {
  if (!props.eventDate) return ''
  const start = asDate(props.eventDate)
  const fmt = new Intl.DateTimeFormat(lang.value === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  let str = fmt.format(start)
  const end = props.eventEndDate ? asDate(props.eventEndDate) : null
  if (end && end.getTime() !== start.getTime()) {
    const endFmt = new Intl.DateTimeFormat(lang.value === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    str += ' – ' + endFmt.format(end)
  }
  return str
}

function displayLocation(): string {
  if (lang.value === 'id' && props.locationId) return props.locationId
  return props.location ?? ''
}
</script>
