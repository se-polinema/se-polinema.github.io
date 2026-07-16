<template>
  <div class="px-8 py-5">
    <div class="section-label mb-2">{{ t.tools.label }}</div>
    <h1 class="font-serif text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 leading-tight mb-2">
      {{ t.tools.heading }}
    </h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl mb-6">
      {{ t.tools.description }}
    </p>

    <div class="flex flex-wrap items-center gap-3 mb-6">
      <select
        v-model="selectedStream"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.tools.allStreams }}</option>
        <option v-for="s in streams" :key="s.id" :value="s.id">
          {{ lang === 'id' ? s.nameId : s.nameEn }}
        </option>
      </select>

      <select
        v-model="selectedType"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.tools.allTypes }}</option>
        <option value="tool">{{ t.tools.typeTool }}</option>
        <option value="dataset">{{ t.tools.typeDataset }}</option>
        <option value="framework">{{ t.tools.typeFramework }}</option>
        <option value="prototype">{{ t.tools.typePrototype }}</option>
        <option value="library">{{ t.tools.typeLibrary }}</option>
      </select>

      <select
        v-model="selectedStatus"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.tools.allStatuses }}</option>
        <option value="active">{{ t.tools.statusActive }}</option>
        <option value="archived">{{ t.tools.statusArchived }}</option>
        <option value="experimental">{{ t.tools.statusExperimental }}</option>
      </select>
    </div>

    <div class="mb-6 text-sm text-neutral-500 dark:text-gray-400">
      {{ filtered.length }}
      {{ filtered.length === 1 ? t.tools.resultSingle : t.tools.resultPlural }}
    </div>

    <template v-if="filtered.length > 0">
      <div v-for="stream in visibleStreams" :key="stream.id" class="mb-10">
        <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100 mb-4 pb-2 border-b border-primary/10 dark:border-gray-600">
          {{ lang === 'id' ? stream.nameId : stream.nameEn }}
        </h2>
        <ul class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <li
            v-for="tool in groupByStream[stream.id]"
            :key="tool.title"
            class="border border-primary/10 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 flex flex-col gap-3 hover:border-primary/20 dark:hover:border-gray-500 transition-colors"
          >
            <div class="flex items-center gap-2 flex-wrap">
              <span class="shrink-0 text-[10px] font-mono px-1.5 py-0.5 border border-primary/10 dark:border-gray-500 text-primary/60 dark:text-gray-400">
                {{ typeLabel(tool.type) }}
              </span>
              <span
                class="shrink-0 text-[10px] font-mono px-1.5 py-0.5"
                :class="statusBadgeClass(tool.status)"
              >{{ statusLabel(tool.status) }}</span>
            </div>

            <h3 class="font-serif text-base font-semibold text-primary dark:text-gray-100 leading-snug">
              {{ lang === 'id' ? tool.titleId : tool.title }}
            </h3>

            <p class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed flex-1">
              {{ lang === 'id' ? tool.descriptionId : tool.description }}
            </p>

            <div v-if="tool.techStack.length > 0" class="flex flex-wrap gap-1">
              <span
                v-for="tech in tool.techStack"
                :key="tech"
                class="text-[10px] font-mono px-1.5 py-0.5 bg-primary/5 dark:bg-gray-700 text-primary/60 dark:text-gray-400"
              >{{ tech }}</span>
            </div>

            <div class="flex flex-wrap items-center gap-3 text-xs">
              <a
                v-if="tool.repoUrl"
                :href="tool.repoUrl"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1 font-mono text-accent-700 dark:text-accent-400 hover:underline transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="flex-shrink-0">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                {{ t.tools.repo }}
              </a>
              <a
                v-if="tool.demoUrl"
                :href="tool.demoUrl"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1 font-mono text-accent-700 dark:text-accent-400 hover:underline transition-colors"
              >{{ t.tools.demo }} <span class="text-[10px]">↗</span></a>
              <a
                v-if="tool.docsUrl"
                :href="tool.docsUrl"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1 font-mono text-accent-700 dark:text-accent-400 hover:underline transition-colors"
              >{{ t.tools.docs }} <span class="text-[10px]">↗</span></a>
            </div>

            <div v-if="tool.license" class="flex items-center gap-1 text-[11px] text-neutral-400 dark:text-gray-500">
              <span class="font-mono">{{ t.tools.license }}:</span>
              <span>{{ tool.license }}</span>
            </div>

            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-primary/5 dark:border-gray-700">
              <div v-if="tool.researchers.length > 0" class="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500 dark:text-gray-400">
                <span class="font-mono text-neutral-400 dark:text-gray-500">{{ t.tools.researchers }}:</span>
                <a
                  v-for="rid in tool.researchers"
                  :key="rid"
                  :href="`/researchers/${rid}`"
                  class="text-accent-700 dark:text-accent-400 hover:underline"
                >{{ researcherName(rid) }}</a>
              </div>
              <a
                v-if="tool.publicationSlug"
                :href="`/publications/${tool.publicationSlug}`"
                class="inline-flex items-center gap-1 text-[11px] font-mono text-accent-700 dark:text-accent-400 hover:underline transition-colors"
              >{{ t.tools.publication }} <span class="text-[10px]">→</span></a>
            </div>
          </li>
        </ul>
      </div>
    </template>

    <template v-else>
      <div class="text-center py-20 border border-dashed border-primary/10 dark:border-gray-600">
        <div class="font-mono text-5xl text-primary/10 dark:text-gray-600 mb-4 select-none">&#123;&nbsp;&#125;</div>
        <p class="text-neutral-400 dark:text-gray-500 text-sm max-w-sm mx-auto">{{ t.tools.empty }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import type { Tool } from '../types/tool'

interface StreamOption {
  id: string
  nameEn: string
  nameId: string
}

const props = defineProps<{
  tools: Tool[]
  streams: StreamOption[]
  researcherNames: Record<string, string>
}>()

const { lang, t } = useI18n()
const selectedStream = ref('')
const selectedType = ref('')
const selectedStatus = ref('')

const filtered = computed(() => {
  let result = props.tools
  if (selectedStream.value) {
    result = result.filter((r) => r.stream === selectedStream.value)
  }
  if (selectedType.value) {
    result = result.filter((r) => r.type === selectedType.value)
  }
  if (selectedStatus.value) {
    result = result.filter((r) => r.status === selectedStatus.value)
  }
  return result
})

const groupByStream = computed(() => {
  const groups: Record<string, Tool[]> = {}
  for (const s of props.streams) {
    groups[s.id] = []
  }
  for (const r of filtered.value) {
    if (groups[r.stream]) {
      groups[r.stream].push(r)
    }
  }
  return groups
})

const visibleStreams = computed(() => {
  return props.streams.filter((s) => groupByStream.value[s.id].length > 0)
})

function typeLabel(type: string): string {
  const labels: Record<string, { en: string; id: string }> = {
    tool: { en: 'Tool', id: 'Alat' },
    dataset: { en: 'Dataset', id: 'Dataset' },
    framework: { en: 'Framework', id: 'Kerangka' },
    prototype: { en: 'Prototype', id: 'Prototipe' },
    library: { en: 'Library', id: 'Pustaka' },
  }
  const entry = labels[type]
  return entry ? (lang.value === 'id' ? entry.id : entry.en) : type
}

function statusLabel(status: string): string {
  const labels: Record<string, { en: string; id: string }> = {
    active: { en: 'Active', id: 'Aktif' },
    archived: { en: 'Archived', id: 'Arsip' },
    experimental: { en: 'Experimental', id: 'Eksperimental' },
  }
  const entry = labels[status]
  return entry ? (lang.value === 'id' ? entry.id : entry.en) : status
}

function statusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800',
    archived: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600',
    experimental: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
  }
  return map[status] ?? ''
}

function researcherName(slug: string): string {
  return props.researcherNames[slug] ?? slug
}
</script>
