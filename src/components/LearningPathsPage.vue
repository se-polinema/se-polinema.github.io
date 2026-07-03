<template>
  <div class="px-8 py-5">
    <div class="section-label mb-2">{{ t.learningPaths.label }}</div>
    <h1 class="font-serif text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 leading-tight mb-2">
      {{ t.learningPaths.heading }}
    </h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
      {{ t.learningPaths.description }}
    </p>

    <div class="flex flex-wrap items-center gap-3 mb-4">
      <select
        v-model="selectedStream"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.learningPaths.allStreams }}</option>
        <option v-for="s in streamOptions" :key="s.id" :value="s.id">
          {{ lang === 'id' ? s.nameId : s.nameEn }}
        </option>
      </select>

      <select
        v-model="selectedLevel"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.learningPaths.allLevels }}</option>
        <option value="beginner">{{ t.learningPaths.beginnerPhase }}</option>
        <option value="intermediate">{{ t.learningPaths.intermediatePhase }}</option>
        <option value="advanced">{{ t.learningPaths.advancedPhase }}</option>
      </select>

      <div class="relative flex-1 min-w-[200px] max-w-xs">
        <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 dark:text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t.learningPaths.searchPlaceholder"
          class="w-full text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 pl-8 pr-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40 placeholder:text-neutral-400 dark:placeholder:text-gray-500"
        />
      </div>
    </div>

    <div class="mb-6 text-sm text-neutral-500 dark:text-gray-400">
      {{ filteredTracks.length }}
      {{ filteredTracks.length === 1 ? t.learningPaths.trackCount.replace('{count}', String(filteredTracks.length)) : t.learningPaths.trackCountPlural.replace('{count}', String(filteredTracks.length)) }}
    </div>

    <template v-if="filteredTracks.length > 0">
      <div v-for="track in filteredTracks" :key="track.id" class="mb-12">
        <div class="border border-primary/10 dark:border-gray-600 bg-white dark:bg-gray-800">
          <div class="p-5 border-b border-primary/10 dark:border-gray-600">
            <h2 class="font-serif text-xl font-semibold text-primary dark:text-gray-100 mb-2">
              {{ lang === 'id' ? track.titleId : track.title }}
            </h2>
            <p class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed mb-4 max-w-3xl">
              {{ lang === 'id' ? track.descriptionId : track.description }}
            </p>
            <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 dark:text-gray-500">
              <span class="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                {{ t.learningPaths.estimatedTime }}: {{ track.estimatedTime }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                {{ track.steps.length }} {{ track.steps.length === 1 ? t.learningPaths.stepCount.replace('{count}', String(track.steps.length)) : t.learningPaths.stepCountPlural.replace('{count}', String(track.steps.length)) }}
              </span>
            </div>
          </div>

          <div class="px-3 py-2 border-b border-primary/10 dark:border-gray-600 text-[11px] font-mono text-neutral-400 dark:text-gray-500 flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            {{ t.learningPaths.prerequisites }}: {{ lang === 'id' ? track.prerequisitesId : track.prerequisites }}
          </div>

          <div class="divide-y divide-primary/5 dark:divide-gray-700">
            <template v-for="phase in phases" :key="phase.key">
              <div v-if="phaseSteps(track, phase.key).length > 0">
                <div class="px-5 py-2 text-xs font-mono uppercase tracking-wider border-b border-primary/5 dark:border-gray-700" :class="phase.headerClass">
                  {{ phase.label }}
                </div>
                <div
                  v-for="step in phaseSteps(track, phase.key)"
                  :key="step.order"
                  class="flex items-start gap-3 px-5 py-3 hover:bg-primary/[0.02] dark:hover:bg-white/[0.01] transition-colors"
                >
                  <span class="mt-0.5 shrink-0 text-[10px] font-mono w-5 text-neutral-400 dark:text-gray-600 text-right">
                    {{ step.order }}
                  </span>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <span class="shrink-0 text-[10px] font-mono px-1.5 py-0.5 border border-primary/10 dark:border-gray-500 text-primary/60 dark:text-gray-400">
                        {{ typeLabel(step.type) }}
                      </span>
                      <span class="shrink-0 text-[10px] font-mono px-1.5 py-0.5 text-neutral-500 dark:text-gray-400">
                        {{ step.estimatedTime }}
                      </span>
                    </div>

                    <h4 class="font-serif text-sm font-semibold text-primary dark:text-gray-100 leading-snug mb-0.5">
                      {{ lang === 'id' ? step.titleId : step.title }}
                    </h4>

                    <p class="text-xs text-neutral-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-1.5">
                      {{ lang === 'id' ? step.descriptionId : step.description }}
                    </p>

                    <a
                      :href="step.url"
                      :target="step.internal ? undefined : '_blank'"
                      :rel="step.internal ? undefined : 'noopener'"
                      class="inline-flex items-center gap-1 text-[12px] font-mono text-accent dark:text-yellow-300 hover:underline transition-colors"
                    >
                      {{ step.internal ? t.learningPaths.viewResource : t.learningPaths.visitExternal }}
                      <span class="text-[10px]">{{ step.internal ? '→' : '↗' }}</span>
                    </a>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="text-center py-20 border border-dashed border-primary/10 dark:border-gray-600">
        <div class="font-mono text-5xl text-primary/10 dark:text-gray-600 mb-4 select-none">&#123;&nbsp;&#125;</div>
        <p class="text-neutral-400 dark:text-gray-500 text-sm max-w-sm mx-auto">{{ t.learningPaths.emptyFilter }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import type { LearningTrack, LearningTrackStep } from '../types/learning-track'
import researchData from '../data/research.json'

const props = defineProps<{
  tracks: LearningTrack[]
}>()

const { lang, t } = useI18n()
const selectedStream = ref('')
const selectedLevel = ref('')
const searchQuery = ref('')

const streamOptions = researchData.map((s: { id: string; name: { en: string; id: string } }) => ({
  id: s.id,
  nameEn: s.name.en,
  nameId: s.name.id,
}))

const filteredTracks = computed(() => {
  let result = props.tracks
  if (selectedStream.value) {
    result = result.filter((t) => t.id === selectedStream.value)
  }
  if (selectedLevel.value || searchQuery.value) {
    result = result.filter((t) => {
      const steps = filterSteps(t.steps)
      return steps.length > 0
    }).map((t) => ({
      ...t,
      steps: filterSteps(t.steps),
    }))
  }
  return result
})

function filterSteps(steps: LearningTrackStep[]): LearningTrackStep[] {
  let result = steps
  if (selectedLevel.value) {
    result = result.filter((s) => s.level === selectedLevel.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((s) => {
      const haystack = [s.title, s.titleId, s.description, s.descriptionId].join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }
  return result
}

const phases = computed(() => [
  { key: 'beginner' as const, label: t.value.learningPaths.beginnerPhase, headerClass: 'text-green-700 dark:text-green-400 bg-green-50/50 dark:bg-green-900/10' },
  { key: 'intermediate' as const, label: t.value.learningPaths.intermediatePhase, headerClass: 'text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' },
  { key: 'advanced' as const, label: t.value.learningPaths.advancedPhase, headerClass: 'text-purple-700 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/10' },
])

function phaseSteps(track: LearningTrack, level: string): LearningTrackStep[] {
  return track.steps.filter((s) => s.level === level)
}

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
</script>
