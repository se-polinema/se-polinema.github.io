<template>
  <div class="px-8 py-5">
    <div class="section-label mb-2">{{ t.join.label }}</div>
    <h1 class="font-serif text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 leading-tight mb-2">
      {{ t.join.page.heading }}
    </h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
      {{ t.join.page.description }}
    </p>

    <div class="flex flex-wrap items-center gap-3 mb-6">
      <select
        v-model="selectedType"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.join.page.allTypes }}</option>
        <option value="thesis">{{ t.join.page.typeThesis }}</option>
        <option value="internship">{{ t.join.page.typeInternship }}</option>
        <option value="collaboration">{{ t.join.page.typeCollaboration }}</option>
        <option value="research-assistant">{{ t.join.page.typeResearchAssistant }}</option>
      </select>
      <select
        v-if="streams.length > 0"
        v-model="selectedStream"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.join.page.allStreams }}</option>
        <option v-for="s in streams" :key="s.id" :value="s.id">
          {{ lang === 'id' ? s.nameId : s.nameEn }}
        </option>
      </select>
    </div>

    <div class="mb-6 text-sm text-neutral-500 dark:text-gray-400">
      {{ filtered.length }}
      {{ filtered.length === 1 ? t.join.page.resultSingle : t.join.page.resultPlural }}
    </div>

    <template v-if="filtered.length > 0">
      <ul class="grid grid-cols-1 gap-5">
        <li
          v-for="(opp, index) in filtered"
          :key="index"
          class="border border-primary/10 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 flex flex-col gap-3 hover:border-primary/20 dark:hover:border-gray-500 transition-colors"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex flex-col gap-1.5 flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  class="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded border"
                  :class="statusBadgeClass(opp.status)"
                >{{ statusLabel(opp.status) }}</span>
                <span
                  class="shrink-0 text-[10px] font-mono px-1.5 py-0.5 border border-primary/10 dark:border-gray-500 text-primary/60 dark:text-gray-400"
                >{{ typeLabel(opp.type) }}</span>
                <span
                  v-if="opp.stream && streamName(opp.stream)"
                  class="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-gray-700 text-neutral-500 dark:text-gray-400"
                >{{ streamName(opp.stream) }}</span>
              </div>
              <h3 class="font-serif text-lg font-semibold text-primary dark:text-gray-100 leading-snug">
                {{ lang === 'id' && opp.titleId ? opp.titleId : opp.title }}
              </h3>
              <p class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed">
                {{ lang === 'id' && opp.descriptionId ? opp.descriptionId : opp.description }}
              </p>
            </div>
          </div>

          <button
            @click="expandedIndex === index ? (expandedIndex = null) : (expandedIndex = index)"
            class="text-[13px] font-mono text-primary/60 dark:text-gray-400 hover:text-accent-700 dark:hover:text-accent-400 transition-colors self-start flex items-center gap-1"
          >
            {{ expandedIndex === index ? t.join.page.collapseDetails : t.join.page.expandDetails }}
            <span class="text-[10px]" :class="expandedIndex === index ? 'rotate-180' : ''" style="transition: transform 0.2s;">&#9660;</span>
          </button>

          <div v-if="expandedIndex === index" class="pt-3 border-t border-primary/5 dark:border-gray-600 flex flex-col gap-4">
            <div>
              <h4 class="font-mono text-[11px] uppercase tracking-wider text-primary/40 dark:text-gray-500 mb-2">{{ t.join.page.requirements }}</h4>
              <ul class="flex flex-col gap-1">
                <li
                  v-for="(req, ri) in (lang === 'id' && opp.requirementsId ? opp.requirementsId : opp.requirements)"
                  :key="ri"
                  class="text-sm text-neutral-500 dark:text-gray-400 pl-3 relative before:content-['—'] before:absolute before:left-0 before:text-primary/30 dark:before:text-gray-600"
                >{{ req }}</li>
              </ul>
            </div>

            <div>
              <h4 class="font-mono text-[11px] uppercase tracking-wider text-primary/40 dark:text-gray-500 mb-2">{{ t.join.page.supervisor }}</h4>
              <p class="text-sm text-neutral-500 dark:text-gray-400">{{ opp.supervisor }}</p>
            </div>

            <div>
              <h4 class="font-mono text-[11px] uppercase tracking-wider text-primary/40 dark:text-gray-500 mb-2">{{ t.join.page.howToApply }}</h4>
              <p class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed">
                {{ lang === 'id' && opp.howToApplyId ? opp.howToApplyId : opp.howToApply }}
              </p>
            </div>

            <ObfuscatedEmail
              :encoded="opp.supervisorEmailEncoded"
              class="inline-flex items-center gap-2 self-start px-4 py-2 font-mono text-[12px] font-medium text-primary transition-colors mt-1 bg-accent"
            >{{ t.join.page.contactSupervisor }} ↗</ObfuscatedEmail>

            <a
              v-if="opp.stream"
              :href="`/research/${opp.stream}`"
              class="text-[13px] font-mono text-primary/60 dark:text-gray-400 hover:text-accent-700 dark:hover:text-accent-400 transition-colors self-start"
            >
              {{ t.join.page.viewStream }} →
            </a>
          </div>
        </li>
      </ul>
    </template>

    <template v-else>
      <div class="text-center py-20 border border-dashed border-primary/10 dark:border-gray-600">
        <div class="font-mono text-5xl text-primary/10 dark:text-gray-600 mb-4 select-none">&#123;&nbsp;&#125;</div>
        <p class="text-neutral-400 dark:text-gray-500 text-sm max-w-sm mx-auto mb-6">{{ t.join.page.empty }}</p>
        <a
          href="/members?filter=researchers"
          class="inline-flex items-center gap-2 px-5 py-2 font-mono text-[12px] font-medium text-primary/70 dark:text-gray-300 hover:text-primary dark:hover:text-gray-100 transition-colors border border-primary/20 dark:border-gray-500 hover:border-primary/40 dark:hover:border-gray-400 bg-white dark:bg-gray-800"
        >
          {{ t.join.page.browseResearchers }}
        </a>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import ObfuscatedEmail from './ObfuscatedEmail.vue'

interface Opportunity {
  title: string
  titleId?: string
  type: string
  stream?: string
  status: string
  description: string
  descriptionId?: string
  requirements: string[]
  requirementsId?: string[]
  supervisor: string
  supervisorEmailEncoded: string
  howToApply: string
  howToApplyId?: string
}

interface StreamOption {
  id: string
  nameEn: string
  nameId: string
}

const props = defineProps<{
  opportunities: Opportunity[]
  streams: StreamOption[]
}>()

const { lang, t } = useI18n()
const selectedType = ref('')
const selectedStream = ref('')
const expandedIndex = ref<number | null>(null)

const filtered = computed(() => {
  let result = props.opportunities
  if (selectedType.value) {
    result = result.filter((o) => o.type === selectedType.value)
  }
  if (selectedStream.value) {
    result = result.filter((o) => o.stream === selectedStream.value)
  }
  return result
})

function streamName(streamId: string): string {
  const s = props.streams.find((s) => s.id === streamId)
  if (!s) return ''
  return lang.value === 'id' ? s.nameId : s.nameEn
}

function statusBadgeClass(status: string) {
  const map: Record<string, string> = {
    open: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
    filled: 'bg-neutral-100 text-neutral-500 dark:bg-gray-700 dark:text-gray-400 border-neutral-200 dark:border-gray-600',
    recurring: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  }
  return map[status] ?? ''
}

function statusLabel(status: string) {
  const labels: Record<string, { en: string; id: string }> = {
    open: { en: 'Open', id: 'Terbuka' },
    filled: { en: 'Filled', id: 'Terisi' },
    recurring: { en: 'Recurring', id: 'Berulang' },
  }
  const entry = labels[status]
  return entry ? (lang.value === 'id' ? entry.id : entry.en) : status
}

function typeLabel(type: string) {
  const labels: Record<string, { en: string; id: string }> = {
    thesis: { en: 'Thesis', id: 'Tugas Akhir' },
    internship: { en: 'Internship', id: 'Magang' },
    collaboration: { en: 'Collaboration', id: 'Kolaborasi' },
    'research-assistant': { en: 'Research Assistant', id: 'Asisten Riset' },
  }
  const entry = labels[type]
  return entry ? (lang.value === 'id' ? entry.id : entry.en) : type
}
</script>
