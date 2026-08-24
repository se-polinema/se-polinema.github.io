<template>
  <section>
    <div class="mb-6 md:mb-8 text-sm text-neutral-500 dark:text-gray-400">
      {{ filteredPublications.length }} {{ filteredPublications.length === 1 ? t.publications.resultSingle : t.publications.resultPlural }}
    </div>

    <div v-if="isLoading" class="text-center py-20">
      <p class="text-neutral-400 dark:text-gray-500 text-sm">{{ t.publications.loading }}</p>
    </div>

    <div v-else-if="groupedEntries.length > 0" class="space-y-10">
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

      <Pagination v-model:current-page="currentPage" :total-pages="totalPages" />
    </div>

    <div v-else class="text-center py-20 border border-dashed border-primary/10 dark:border-gray-700">
      <p class="text-neutral-400 dark:text-gray-500 text-sm max-w-sm mx-auto">{{ emptyMessage }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useVSCodeLayout } from '../composables/useVSCodeLayout'
import Pagination from './Pagination.vue'

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
  // Omitted by the /publications page, which instead fetches the full
  // index client-side (see onMounted below) so that page's own HTML
  // stays constant-size as the collection grows. Kept optional (rather
  // than always-fetch) for symmetry with BlogArchivePage.vue and any
  // future pre-filtered static route reusing this component.
  publications?: Publication[]
  researchers: ResearcherOption[]
  streamNames: Record<string, { en: string; id: string }>
}>()

const { t } = useI18n()
const { activeFilters } = useVSCodeLayout()

const fetchedPublications = ref<Publication[] | null>(null)
// Starts true (rather than false) whenever a fetch will actually happen,
// i.e. no `publications` prop was passed, so the SSR-rendered HTML (and
// the pre-hydration client render, which must match it) shows a loading
// state instead of a misleading "no results" empty state before the
// client-side fetch resolves.
const isLoading = ref(!props.publications)

const sourcePublications = computed(() => props.publications ?? fetchedPublications.value ?? [])

onMounted(async () => {
  if (props.publications) return
  isLoading.value = true
  try {
    const res = await fetch('/api/publications-index.json')
    fetchedPublications.value = await res.json()
  } catch {
    fetchedPublications.value = []
  } finally {
    isLoading.value = false
  }
})

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
  for (const pub of sourcePublications.value) {
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
  sourcePublications.value.filter((publication) => {
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
  if (hasAnyFilter.value) return t.value.publications.noResults
  return t.value.blog.noPosts
})

const PAGE_SIZE = 15
const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPublications.value.length / PAGE_SIZE)))

const paginatedPublications = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredPublications.value.slice(start, start + PAGE_SIZE)
})

// filteredPublications only changes when a filter or the fetched index
// changes, never as a side effect of paging, so resetting to page 1
// here can't fight the user's own page navigation.
watch(filteredPublications, () => {
  currentPage.value = 1
})

// Groups the current PAGE's slice by year, not the full filtered result:
// a year that spans a page boundary shows its header on both pages,
// which is normal/expected pagination behavior and far simpler than
// paginating by whole year-groups (which would produce wildly uneven
// page sizes since some years have far more publications than others).
const groupedEntries = computed(() => {
  const groups = paginatedPublications.value.reduce<Record<string, Publication[]>>((acc, publication) => {
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
