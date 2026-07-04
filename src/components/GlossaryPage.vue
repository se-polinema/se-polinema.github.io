<template>
  <div class="px-8 py-5">
    <div class="section-label mb-2">{{ t.glossary.label }}</div>
    <h1 class="font-serif text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 leading-tight mb-2">
      {{ t.glossary.heading }}
    </h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
      {{ t.glossary.description }}
    </p>

    <div class="mb-6 flex flex-wrap items-center gap-3">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t.glossary.searchPlaceholder"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 w-full max-w-sm focus:outline-none focus:border-primary/40"
      />

      <select
        v-model="selectedStream"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.glossary.allStreams }}</option>
        <option v-for="s in streams" :key="s.id" :value="s.id">
          {{ lang === 'id' ? s.nameId : s.nameEn }}
        </option>
      </select>
    </div>

    <div class="mb-6 text-sm text-neutral-500 dark:text-gray-400">
      {{ filtered.length }}
      {{ filtered.length === 1 ? t.glossary.resultSingle : t.glossary.resultPlural }}
    </div>

    <template v-if="filtered.length > 0">
      <dl class="space-y-0">
        <div
          v-for="(entry, ei) in filtered"
          :key="entry.slug"
          :id="entry.slug"
          class="border border-primary/10 dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          <dt class="px-5 py-4">
            <a
              :href="`#${entry.slug}`"
              class="text-base md:text-lg font-semibold text-primary dark:text-gray-100 hover:text-accent dark:hover:text-yellow-300 transition-colors"
            >
              {{ entry.term }}
              <span class="text-sm font-normal text-neutral-400 dark:text-gray-500 ml-2">{{ entry.termId }}</span>
            </a>
          </dt>
          <dd class="px-5 pb-4">
            <p class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed">
              {{ lang === 'id' ? entry.definitionId : entry.definition }}
            </p>

            <div v-if="streamById(entry.stream)" class="mt-2">
              <span class="text-[10px] font-mono px-1.5 py-0.5 border border-primary/10 dark:border-gray-500 text-primary/60 dark:text-gray-400">
                {{ lang === 'id' ? streamById(entry.stream)!.nameId : streamById(entry.stream)!.nameEn }}
              </span>
            </div>

            <div v-if="entry.relatedTerms && entry.relatedTerms.length > 0" class="mt-3 flex items-center gap-1.5 flex-wrap">
              <span class="text-[11px] text-neutral-400 dark:text-gray-500 mr-1">{{ t.glossary.relatedTermsLabel }}</span>
              <a
                v-for="related in resolvedRelated(entry.relatedTerms)"
                :key="related.slug"
                :href="`#${related.slug}`"
                class="text-[12px] font-mono text-accent dark:text-yellow-300 hover:underline transition-colors"
              >{{ related.term }}</a>
            </div>
          </dd>
        </div>
      </dl>
    </template>

    <template v-else>
      <div class="text-center py-20 border border-dashed border-primary/10 dark:border-gray-600">
        <div class="font-mono text-5xl text-primary/10 dark:text-gray-600 mb-4 select-none">&#123;&nbsp;&#125;</div>
        <p class="text-neutral-400 dark:text-gray-500 text-sm max-w-sm mx-auto">{{ t.glossary.empty }}</p>
      </div>
    </template>

    <div class="border-t border-primary/10 dark:border-gray-700 pt-6 mt-6">
      <p class="text-sm text-neutral-500 dark:text-gray-400">
        {{ t.glossary.suggestionText }}
        <a href="/contact" class="text-primary dark:text-gray-200 hover:text-accent dark:hover:text-yellow-300 underline underline-offset-2 transition-colors">{{ t.glossary.suggestionLink }}</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'

interface GlossaryTerm {
  term: string
  termId: string
  definition: string
  definitionId: string
  slug: string
  stream?: string
  relatedTerms?: string[]
}

interface StreamOption {
  id: string
  nameEn: string
  nameId: string
}

const props = defineProps<{
  data: GlossaryTerm[]
  streams: StreamOption[]
}>()

const { lang, t } = useI18n()
const searchQuery = ref('')
const selectedStream = ref('')

const filtered = computed(() => {
  let result = props.data
  const query = searchQuery.value.toLowerCase().trim()

  if (query) {
    result = result.filter(
      (entry) =>
        entry.term.toLowerCase().includes(query) ||
        entry.termId.toLowerCase().includes(query) ||
        entry.definition.toLowerCase().includes(query) ||
        entry.definitionId.toLowerCase().includes(query)
    )
  }

  if (selectedStream.value) {
    result = result.filter((entry) => entry.stream === selectedStream.value)
  }

  return result
})

function streamById(id?: string): StreamOption | undefined {
  if (!id) return undefined
  return props.streams.find((s) => s.id === id)
}

function resolvedRelated(slugs: string[]): GlossaryTerm[] {
  return slugs
    .map((slug) => props.data.find((t) => t.slug === slug))
    .filter(Boolean) as GlossaryTerm[]
}
</script>
