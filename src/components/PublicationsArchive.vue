<template>
  <section>
    <div class="mb-10 md:mb-12">
      <label class="block max-w-xs">
        <span class="block text-xs font-mono uppercase tracking-wider text-primary/40 mb-2">{{ t.publications.filterResearcher }}</span>
        <select v-model="selectedResearcher" class="w-full border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm text-primary focus:outline-none focus:border-primary/30">
          <option value="all">{{ t.publications.allResearchers }}</option>
          <option v-for="option in researcherOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
        </select>
      </label>
    </div>

    <div class="mb-6 md:mb-8 text-sm text-neutral-500">
      {{ filteredPublications.length }} {{ filteredPublications.length === 1 ? t.publications.resultSingle : t.publications.resultPlural }}
    </div>

    <div v-if="groupedEntries.length > 0" class="space-y-10">
      <section v-for="group in groupedEntries" :key="group.year">
        <div class="font-mono text-xs uppercase tracking-[0.2em] text-primary/40 mb-4">{{ group.year }}</div>
        <div class="space-y-5">
          <article
            v-for="publication in group.items"
            :key="publication.id"
            class="grid gap-3 md:gap-4 md:grid-cols-[7rem_minmax(0,1fr)] border-t border-primary/10 pt-5"
          >
            <div class="text-xs text-neutral-500 space-y-1 md:space-y-2 pt-1">
              <div class="font-mono uppercase tracking-wider text-primary/40">{{ publication.type }}</div>
              <div class="leading-relaxed">{{ researcherLine(publication.researchers) }}</div>
            </div>
            <div>
              <h2 class="font-serif text-base md:text-xl font-semibold text-primary leading-snug">
                <a :href="publication.url" target="_blank" rel="noopener" class="hover:underline decoration-primary/20 underline-offset-4">{{ publication.title }}</a>
              </h2>
              <p class="mt-2 text-sm text-neutral-600 leading-relaxed">{{ publication.authors.join(', ') }}</p>
              <div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                <span>{{ publication.venue }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <div v-else class="text-center py-20 border border-dashed border-primary/10">
      <p class="text-neutral-400 text-sm max-w-sm mx-auto">{{ t.blog.noPosts }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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
}

const props = defineProps<{
  publications: Publication[]
  researchers: ResearcherOption[]
}>()

const { t } = useI18n()
const { activeFilters } = useVSCodeLayout()

const selectedResearcher = ref('all')

const researcherOptions = computed(() => props.researchers)

const researcherMap = computed(() => new Map(props.researchers.map((researcher) => [researcher.id, researcher.name])))

const filteredPublications = computed(() => {
  return props.publications.filter((publication) => {
    const byResearcher = selectedResearcher.value === 'all' || publication.researchers.includes(selectedResearcher.value)
    const byYear = !activeFilters.year || publication.year === activeFilters.year
    const byType = !activeFilters.type || publication.type === activeFilters.type
    return byResearcher && byYear && byType
  })
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
