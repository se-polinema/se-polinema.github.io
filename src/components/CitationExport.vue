<template>
  <div class="citation-export mt-8 border-t border-neutral-200 dark:border-gray-700 pt-6">
    <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100 mb-3">
      {{ t.citation.heading }}
    </h2>

    <div class="flex flex-wrap gap-2 mb-3" role="tablist" :aria-label="t.citation.heading">
      <button
        v-for="fmt in formats"
        :key="fmt.key"
        :ref="(el) => { if (el) btnRefs[fmt.key] = el as HTMLElement }"
        role="tab"
        :aria-selected="activeFormat === fmt.key"
        :aria-controls="`cite-panel-${fmt.key}`"
        :tabindex="activeFormat === fmt.key ? 0 : -1"
        class="px-3 py-1.5 text-xs font-mono font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        :class="activeFormat === fmt.key
          ? 'bg-primary text-white border-primary'
          : 'border-neutral-300 dark:border-gray-600 text-neutral-600 dark:text-gray-400 hover:bg-neutral-50 dark:hover:bg-gray-800'"
        @click="activeFormat = fmt.key"
        @keydown="handleTabKey($event, fmt.key)"
      >
        {{ fmt.label }}
      </button>
    </div>

    <div
      v-for="fmt in formats"
      :id="`cite-panel-${fmt.key}`"
      :key="fmt.key"
      role="tabpanel"
      :aria-labelledby="`cite-tab-${fmt.key}`"
      :hidden="activeFormat !== fmt.key"
      class="relative"
    >
      <pre
        class="block w-full p-3 text-xs font-mono bg-neutral-50 dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 text-neutral-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap"
      ><code>{{ fmt.value }}</code></pre>
      <div class="flex justify-end mt-2">
        <button
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-300 dark:border-gray-600 text-neutral-600 dark:text-gray-400 hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          :aria-label="`${t.citation.copy} ${fmt.label}`"
          @click="copyCitation(fmt.key)"
        >
          <svg v-if="copiedFormat !== fmt.key" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{{ copiedFormat === fmt.key ? t.citation.copied : t.citation.copy }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import { generateCitations } from '../lib/citation'

const props = defineProps<{
  title: string
  year: number
  type: 'journal' | 'conference' | 'book-chapter' | 'proceeding' | 'preprint'
  venue: string
  authors: string[]
  url: string
  doi?: string
}>()

const { t } = useI18n()

const citations = computed(() => generateCitations({
  title: props.title,
  year: props.year,
  type: props.type,
  venue: props.venue,
  authors: props.authors,
  url: props.url,
  doi: props.doi,
}))

const formats = computed(() => [
  { key: 'bibtex', label: t.value.citation.bibtex, value: citations.value.bibtex },
  { key: 'ris', label: t.value.citation.ris, value: citations.value.ris },
  { key: 'apa', label: t.value.citation.apa, value: citations.value.apa },
])

const activeFormat = ref('bibtex')
const copiedFormat = ref<string | null>(null)
const btnRefs = ref<Record<string, HTMLElement>>({})

const formatKeys = ['bibtex', 'ris', 'apa']

function handleTabKey(event: KeyboardEvent, currentKey: string) {
  const currentIdx = formatKeys.indexOf(currentKey)
  let nextIdx: number | null = null

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    nextIdx = (currentIdx + 1) % formatKeys.length
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    nextIdx = (currentIdx - 1 + formatKeys.length) % formatKeys.length
  }

  if (nextIdx !== null) {
    activeFormat.value = formatKeys[nextIdx]
    btnRefs.value[formatKeys[nextIdx]]?.focus()
  }
}

async function copyCitation(formatKey: string) {
  const citation = citations.value[formatKey as keyof typeof citations.value]
  try {
    await navigator.clipboard.writeText(citation)
    copiedFormat.value = formatKey
    setTimeout(() => {
      if (copiedFormat.value === formatKey) {
        copiedFormat.value = null
      }
    }, 2000)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = citation
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copiedFormat.value = formatKey
    setTimeout(() => {
      if (copiedFormat.value === formatKey) {
        copiedFormat.value = null
      }
    }, 2000)
  }
}
</script>
