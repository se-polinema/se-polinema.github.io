<template>
  <div class="px-8 py-5">
    <h1>{{ t.events.archiveHeading }}</h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm mt-1 mb-8">{{ t.events.archiveDescription }}</p>

    <div v-if="upcomingEvents.length === 0 && pastEvents.length === 0" class="text-center py-20">
      <p class="text-neutral-400 dark:text-gray-500">{{ t.events.noUpcoming }}</p>
    </div>

    <template v-else>
      <section v-if="upcomingEvents.length > 0" class="mb-12">
        <h2 class="font-mono text-xs uppercase tracking-wider text-primary/50 dark:text-gray-400 mb-5">{{ t.events.upcomingHeading }}</h2>
        <div class="space-y-4">
          <article
            v-for="event in upcomingEvents"
            :key="event.id"
            class="group border-l-4 border-accent bg-accent/5 dark:bg-accent/10 p-5 hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors"
          >
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div class="flex-1 min-w-0">
                <h3 class="font-serif text-lg font-semibold text-primary dark:text-gray-100 leading-snug mb-1">
                  <a :href="`/events/${event.id}`" class="hover:underline decoration-primary/20 underline-offset-4">
                    {{ lang === 'id' && event.titleId ? event.titleId : event.title }}
                  </a>
                </h3>
                <p class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed mb-2">
                  {{ lang === 'id' && event.excerptId ? event.excerptId : event.excerpt }}
                </p>
                <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 dark:text-gray-500">
                  <span class="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {{ formatEventDate(event) }}
                  </span>
                  <span v-if="displayLocation(event)" class="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {{ displayLocation(event) }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <a
                  v-if="event.registrationUrl"
                  :href="event.registrationUrl"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-semibold text-white bg-accent hover:bg-accent/90 transition-colors"
                >
                  {{ t.events.registerCta }}
                </a>
                <a
                  v-if="event.stream"
                  :href="event.stream"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono text-primary dark:text-gray-100 border border-primary/20 dark:border-gray-600 hover:bg-primary/5 dark:hover:bg-gray-700 transition-colors"
                >
                  {{ t.events.streamCta }}
                </a>
                <a
                  :href="`/events/${event.id}`"
                  class="text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors"
                >
                  {{ t.news.readMore }} →
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section v-if="pastEvents.length > 0">
        <h2 class="font-mono text-xs uppercase tracking-wider text-primary/50 dark:text-gray-400 mb-5">{{ t.events.pastHeading }}</h2>
        <div v-for="(yearEvents, year) in pastByYear" :key="year" class="mb-8">
          <h3 class="font-mono text-sm font-semibold text-primary/70 dark:text-gray-300 mb-3">{{ year }}</h3>
          <div class="space-y-3">
            <article
              v-for="event in yearEvents"
              :key="event.id"
              class="group border-b border-primary/5 dark:border-gray-700 pb-3 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6"
            >
              <time class="text-xs font-mono text-neutral-400 dark:text-gray-500 shrink-0 w-28 pt-0.5">
                {{ formatShortDate(event.eventDate) }}
              </time>
              <div class="flex-1 min-w-0">
                <h4 class="font-serif text-sm font-semibold text-primary dark:text-gray-100 leading-snug">
                  <a :href="`/events/${event.id}`" class="hover:underline decoration-primary/20 underline-offset-4">
                    {{ lang === 'id' && event.titleId ? event.titleId : event.title }}
                  </a>
                </h4>
                <p class="text-xs text-neutral-400 dark:text-gray-500 mt-0.5" v-if="displayLocation(event)">
                  {{ displayLocation(event) }}
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

interface EventItem {
  id: string
  title: string
  titleId?: string
  excerpt?: string
  excerptId?: string
  eventDate: Date | string
  eventEndDate?: Date | string
  location?: string
  locationId?: string
  registrationUrl?: string
  stream?: string
}

const props = defineProps<{
  events: EventItem[]
}>()

const { lang, t } = useI18n()

const now = new Date()
now.setHours(0, 0, 0, 0)

const upcomingEvents = computed(() =>
  props.events.filter(e => asDate(e.eventDate) >= now)
)

const pastEvents = computed(() =>
  props.events.filter(e => asDate(e.eventDate) < now)
)

const pastByYear = computed(() => {
  const grouped: Record<number, EventItem[]> = {}
  for (const event of pastEvents.value) {
    const year = asDate(event.eventDate).getFullYear()
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(event)
  }
  const sorted: [number, EventItem[]][] = Object.entries(grouped)
    .map(([y, e]) => [Number(y), e] as [number, EventItem[]])
    .sort((a, b) => b[0] - a[0])
  return Object.fromEntries(sorted)
})

function asDate(date: Date | string): Date {
  return date instanceof Date ? date : new Date(date)
}

function formatEventDate(event: EventItem): string {
  const start = asDate(event.eventDate)
  const fmt = new Intl.DateTimeFormat(lang.value === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  let str = fmt.format(start)
  const end = event.eventEndDate ? asDate(event.eventEndDate) : null
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

function formatShortDate(date: string | Date): string {
  const d = asDate(date)
  return new Intl.DateTimeFormat(lang.value === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
  }).format(d)
}

function displayLocation(event: EventItem): string {
  if (lang.value === 'id' && event.locationId) return event.locationId
  return event.location ?? ''
}
</script>
