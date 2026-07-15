<template>
  <template v-if="parts.length > 0">
    <nav
      v-if="mode === 'top'"
      aria-label="Series navigation"
      class="mb-8 p-4 bg-neutral-50 dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-700"
    >
      <p class="font-semibold mb-2">
        {{ seriesDisplayName }} &mdash; {{ parts.length }} {{ t.blog.series.partsLabel }}
      </p>
      <ol class="list-decimal list-inside space-y-1 text-sm">
        <li
          v-for="part in parts"
          :key="part.slug"
          :class="{ 'font-bold': part.slug === currentSlug }"
        >
          <template v-if="part.slug === currentSlug">
            {{ partTitle(part) }} &larr; {{ t.blog.series.youAreHere }}
          </template>
          <a v-else :href="`/blog/${part.slug}`">{{ partTitle(part) }}</a>
        </li>
      </ol>
    </nav>

    <nav
      v-if="mode === 'bottom'"
      aria-label="Series navigation"
      class="mt-8 p-4 bg-neutral-50 dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-gray-700"
    >
      <p class="font-semibold mb-2">
        {{ bottomHeading }}
      </p>
      <div v-if="!prev && !next" class="text-sm text-neutral-500 dark:text-gray-400">
        {{ t.blog.series.moreComingSoon }}
      </div>
      <div v-else-if="isFirst" class="text-sm">
        <strong>{{ t.blog.series.next }}:</strong>
        <a :href="`/blog/${next!.slug}`">{{ partTitle(next!) }} &rarr;</a>
      </div>
      <div v-else class="text-sm flex justify-between">
        <span>
          <strong>{{ t.blog.series.previous }}:</strong>
          <a :href="`/blog/${prev!.slug}`">&larr; {{ partTitle(prev!) }}</a>
        </span>
        <span v-if="next">
          <strong>{{ t.blog.series.next }}:</strong>
          <a :href="`/blog/${next.slug}`">{{ partTitle(next) }} &rarr;</a>
        </span>
        <span v-else>
          <strong>{{ t.blog.series.seriesStart }}:</strong>
          <a :href="`/blog/${parts[0].slug}`">{{ partTitle(parts[0]) }}</a>
        </span>
      </div>
    </nav>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

export interface SeriesPart {
  slug: string
  title: string
  titleId: string
  order: number
}

const props = defineProps<{
  parts: SeriesPart[]
  currentSlug: string
  seriesTitle: string
  seriesTitleId: string
  mode: 'top' | 'bottom'
}>()

const { lang, t } = useI18n()

const seriesDisplayName = computed(() =>
  lang.value === 'id' && props.seriesTitleId ? props.seriesTitleId : props.seriesTitle
)

function partTitle(part: SeriesPart): string {
  return lang.value === 'id' && part.titleId ? part.titleId : part.title
}

const currentIndex = computed(() =>
  props.parts.findIndex((p) => p.slug === props.currentSlug)
)

const prev = computed<SeriesPart | null>(() =>
  currentIndex.value > 0 ? props.parts[currentIndex.value - 1] : null
)

const next = computed<SeriesPart | null>(() =>
  currentIndex.value < props.parts.length - 1 ? props.parts[currentIndex.value + 1] : null
)

const isFirst = computed(() => currentIndex.value === 0)
const isLast = computed(() => currentIndex.value === props.parts.length - 1)

const bottomHeading = computed(() => {
  if (isLast.value && props.parts.length > 1) {
    const name = seriesDisplayName.value
    return `${name} &mdash; ${t.value.blog.series.seriesComplete}`
  }
  return t.value.blog.series.continueSeries
})
</script>
