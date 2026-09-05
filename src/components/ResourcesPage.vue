<template>
  <div class="px-8 py-5">
    <div class="section-label mb-2">{{ t.resources.label }}</div>
    <h1 class="font-serif text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 leading-tight mb-2">
      {{ t.resources.heading }}
    </h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl mb-4">
      {{ t.resources.description }}
    </p>

    <div class="mb-8">
      <a
        :href="withBase('/learning-paths')"
        class="inline-flex items-center gap-1.5 text-[13px] font-mono text-accent-700 dark:text-accent-400 hover:underline transition-colors"
      >
        {{ t.learningPaths?.viewLearningPaths || 'View Learning Paths' }}
        <span class="text-[10px]">→</span>
      </a>
      <span class="text-xs text-neutral-400 dark:text-gray-500 ml-2">{{ t.learningPaths?.seeAlso || 'See also' }}: guided step-by-step tracks</span>
    </div>

    <div class="flex flex-wrap items-center gap-3 mb-6">
      <select
        v-model="selectedStream"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.resources.allStreams }}</option>
        <option v-for="s in streams" :key="s.id" :value="s.id">
          {{ lang === 'id' ? s.nameId : s.nameEn }}
        </option>
      </select>

      <select
        v-model="selectedType"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.resources.allTypes }}</option>
        <option value="tutorial">{{ t.resources.typeTutorial }}</option>
        <option value="book">{{ t.resources.typeBook }}</option>
        <option value="deck">{{ t.resources.typeDeck }}</option>
        <option value="tool">{{ t.resources.typeTool }}</option>
        <option value="dataset">{{ t.resources.typeDataset }}</option>
        <option value="course">{{ t.resources.typeCourse }}</option>
        <option value="paper">{{ t.resources.typePaper }}</option>
      </select>

      <select
        v-model="selectedLevel"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.resources.allLevels }}</option>
        <option value="beginner">{{ t.resources.levelBeginner }}</option>
        <option value="intermediate">{{ t.resources.levelIntermediate }}</option>
        <option value="advanced">{{ t.resources.levelAdvanced }}</option>
      </select>
    </div>

    <div class="mb-6 text-sm text-neutral-500 dark:text-gray-400">
      {{ filtered.length }}
      {{ filtered.length === 1 ? t.resources.resultSingle : t.resources.resultPlural }}
    </div>

    <template v-if="filtered.length > 0">
      <div v-for="stream in visibleStreams" :key="stream.id" class="mb-10">
        <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100 mb-4 pb-2 border-b border-primary/10 dark:border-gray-600">
          {{ lang === 'id' ? stream.nameId : stream.nameEn }}
        </h2>
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <li
            v-for="resource in groupByStream[stream.id]"
            :key="resource.url"
            class="border border-primary/10 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 flex flex-col gap-2.5 hover:border-primary/20 dark:hover:border-gray-500 transition-colors"
          >
            <div class="flex items-center gap-2 flex-wrap">
              <span class="shrink-0 text-[10px] font-mono px-1.5 py-0.5 border border-primary/10 dark:border-gray-500 text-primary/60 dark:text-gray-400">
                {{ typeLabel(resource.type) }}
              </span>
              <span
                class="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded"
                :class="levelBadgeClass(resource.level)"
              >{{ levelLabel(resource.level) }}</span>
            </div>

            <h3 class="font-serif text-base font-semibold text-primary dark:text-gray-100 leading-snug">
              {{ lang === 'id' ? resource.titleId : resource.title }}
            </h3>

            <p class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed flex-1">
              {{ lang === 'id' ? resource.descriptionId : resource.description }}
            </p>

            <a
              :href="withBase(resource.url)"
              :target="resource.internal ? undefined : '_blank'"
              :rel="resource.internal ? undefined : 'noopener'"
              class="inline-flex items-center gap-1.5 text-[13px] font-mono text-accent-700 dark:text-accent-400 hover:underline transition-colors mt-1 self-start"
            >
              {{ resource.internal ? t.resources.viewResource : t.resources.visitExternal }}
              <span class="text-[10px]">{{ resource.internal ? '→' : '↗' }}</span>
            </a>
          </li>
        </ul>
      </div>
    </template>

    <template v-else>
      <div class="text-center py-20 border border-dashed border-primary/10 dark:border-gray-600">
        <div class="font-mono text-5xl text-primary/10 dark:text-gray-600 mb-4 select-none">&#123;&nbsp;&#125;</div>
        <p class="text-neutral-400 dark:text-gray-500 text-sm max-w-sm mx-auto">{{ t.resources.empty }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'
import type { Resource } from '../types/resource'

interface StreamOption {
  id: string
  nameEn: string
  nameId: string
}

const props = defineProps<{
  resources: Resource[]
  streams: StreamOption[]
}>()

const { lang, t } = useI18n()
const selectedStream = ref('')
const selectedType = ref('')
const selectedLevel = ref('')

const filtered = computed(() => {
  let result = props.resources
  if (selectedStream.value) {
    result = result.filter((r) => r.stream === selectedStream.value)
  }
  if (selectedType.value) {
    result = result.filter((r) => r.type === selectedType.value)
  }
  if (selectedLevel.value) {
    result = result.filter((r) => r.level === selectedLevel.value)
  }
  return result
})

const groupByStream = computed(() => {
  const groups: Record<string, Resource[]> = {}
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
    tutorial: { en: 'Tutorial', id: 'Tutorial' },
    book: { en: 'Book', id: 'Buku' },
    deck: { en: 'Deck', id: 'Dek' },
    tool: { en: 'Tool', id: 'Alat' },
    dataset: { en: 'Dataset', id: 'Dataset' },
    course: { en: 'Course', id: 'Kursus' },
    paper: { en: 'Paper', id: 'Makalah' },
  }
  const entry = labels[type]
  return entry ? (lang.value === 'id' ? entry.id : entry.en) : type
}

function levelLabel(level: string): string {
  const labels: Record<string, { en: string; id: string }> = {
    beginner: { en: 'Beginner', id: 'Pemula' },
    intermediate: { en: 'Intermediate', id: 'Menengah' },
    advanced: { en: 'Advanced', id: 'Lanjutan' },
  }
  const entry = labels[level]
  return entry ? (lang.value === 'id' ? entry.id : entry.en) : level
}

function levelBadgeClass(level: string): string {
  const map: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800',
    intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
  }
  return map[level] ?? ''
}
</script>
