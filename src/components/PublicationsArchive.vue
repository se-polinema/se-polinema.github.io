<template>
  <section>
    <div class="mb-6 md:mb-8 text-sm text-neutral-500 dark:text-gray-400">
      {{ filteredPublications.length }} {{ filteredPublications.length === 1 ? t.publications.resultSingle : t.publications.resultPlural }}
    </div>

    <div v-if="groupedEntries.length > 0" class="space-y-10">
      <section v-for="group in groupedEntries" :key="group.year">
        <div class="font-mono text-xs uppercase tracking-[0.2em] text-primary/40 mb-4">{{ group.year }}</div>
        <div class="space-y-5">
          <article
            v-for="publication in group.items"
            :key="publication.id"
            class="grid gap-3 md:gap-4 md:grid-cols-[7rem_minmax(0,1fr)] border-t border-primary/10 dark:border-gray-700 pt-5"
          >
            <div class="text-xs text-neutral-500 dark:text-gray-400 space-y-1 md:space-y-2 pt-1">
              <div class="font-mono uppercase tracking-wider text-primary/40">{{ publication.type }}</div>
              <div class="leading-relaxed">{{ researcherLine(publication.researchers) }}</div>
            </div>
            <div>
              <h2 class="font-serif text-base md:text-xl font-semibold text-primary dark:text-gray-100 leading-snug">
                <a :href="`/publications/${publication.id}`" class="hover:underline decoration-primary/20 underline-offset-4">{{ publication.title }}</a>
              </h2>
              <p class="mt-2 text-sm text-neutral-600 dark:text-gray-300 leading-relaxed">{{ publication.authors.join(', ') }}</p>
              <div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-gray-400">
                <span>{{ publication.venue }}</span>
                <a v-if="publication.url" :href="publication.url" target="_blank" rel="noopener" class="text-primary/60 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors">{{ t.publications.viewPublication }} →</a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <div v-else class="text-center py-20 border border-dashed border-primary/10 dark:border-gray-700">
      <p class="text-neutral-400 dark:text-gray-500 text-sm max-w-sm mx-auto">{{ emptyMessage }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useVSCodeLayout } from '../composables/useVSCodeLayout'

type Publication = {
  id: string
  title: string
  year: number
  authors: string[]
  venue: string
  type: string
  url: string
  researchers: string[]
}

type ResearcherOption = {
  id: string
  name: string
  streams: string[]
}

const props = defineProps<{
  publications: Publication[]
  researchers: ResearcherOption[]
  streamNames: Record<string, { en: string; id: string }>
}>()

const { t } = useI18n()
const { activeFilters } = useVSCodeLayout()

const researcherMap = computed(() => new Map(props.researchers.map((researcher) => [researcher.id, researcher.name])))

const researcherStreamMap = computed(() => {
  const map = new Map<string, string[]>()
  for (const r of props.researchers) {
    map.set(r.id, r.streams)
  }
  return map
})

const publicationStreams = computed(() => {
  const map = new Map<string, Set<string>>()
  for (const pub of props.publications) {
    const streams = new Set<string>()
    for (const rid of pub.researchers) {
      const resStreams = researcherStreamMap.value.get(rid) ?? []
      for (const s of resStreams) streams.add(s)
    }
    map.set(pub.id, streams)
  }
  return map
})

const filteredPublications = computed(() =>
  props.publications.filter((publication) => {
    const byYear = !activeFilters.year || publication.year === activeFilters.year
    const byType = !activeFilters.type || publication.type === activeFilters.type
    const byStream = !activeFilters.stream || (publicationStreams.value.get(publication.id)?.has(activeFilters.stream) ?? false)
    return byYear && byType && byStream
  })
)

const hasAnyFilter = computed(() =>
  activeFilters.year !== null || activeFilters.type !== null || activeFilters.stream !== null
)

const emptyMessage = computed(() => {
  if (hasAnyFilter.value) return t.publications.noResults
  return t.blog.noPosts
})

const groupedEntries = computed(() => {
  const groups = filteredPublications.value.reduce<Record<string, Publication[]>>((acc, publication) => {
    const year = String(publication.year)
    if (!acc[year]) acc[year] = []
    acc[year].push(publication)
    return acc
  }, {})

  return Object.entries(groups)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, items]) => ({ year, items }))
})

function researcherLine(ids: string[]) {
  return ids
    .map((id) => researcherMap.value.get(id) || id)
    .join(', ')
}
</script>
