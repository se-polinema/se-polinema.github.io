<template>
  <div class="px-8 py-5">
    <div class="section-label mb-2">{{ t.decks.label }}</div>
    <h1 class="font-serif text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 leading-tight mb-2">
      {{ t.decks.archiveHeading }}
    </h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
      {{ t.decks.archiveDescription }}
    </p>

    <div class="flex items-center gap-4 mb-6">
      <select
        v-model="selectedMember"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.decks.allMembers }}</option>
        <option v-for="m in members" :key="m.id" :value="m.id">{{ m.name }}</option>
      </select>
    </div>

    <div class="mb-6 text-sm text-neutral-500 dark:text-gray-400">
      {{ filtered.length }}
      {{ filtered.length === 1 ? t.decks.resultSingle : t.decks.resultPlural }}
    </div>

    <template v-if="filtered.length > 0">
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <li
          v-for="deck in filtered"
          :key="deck.url"
          class="border border-primary/10 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 flex flex-col gap-3 hover:border-primary/20 dark:hover:border-gray-500 transition-colors"
        >
          <div class="flex items-center gap-2">
            <span
              class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
              :class="typeBadgeClass(deck.type)"
            >{{ deck.type }}</span>
          </div>

          <a
            :href="deck.url"
            target="_blank"
            rel="noopener"
            class="font-mono text-[13px] text-primary dark:text-blue-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors break-all leading-snug font-medium"
          >{{ deck.title }}</a>

          <p v-if="deck.description" class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed flex-1">
            {{ deck.description }}
          </p>

          <div v-if="deck.embedUrl" class="mt-1">
            <button
              @click="togglePreview(deck.url)"
              class="text-[11px] font-mono text-primary/60 dark:text-gray-400 hover:text-accent-700 dark:hover:text-accent-400 transition-colors"
            >
              {{ previewOpen === deck.url ? t.decks.hidePreview : t.decks.showPreview }}
            </button>
            <div v-if="previewOpen === deck.url" class="mt-3 border border-primary/10 dark:border-gray-600">
              <iframe
                :src="deck.embedUrl"
                class="w-full h-64"
                frameborder="0"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups"
                :title="deck.title"
              />
              <p class="text-[10px] text-neutral-400 dark:text-gray-500 px-2 py-1.5 bg-neutral-50 dark:bg-gray-700">
                {{ t.decks.previewFallback }}
                <a :href="deck.url" target="_blank" rel="noopener" class="text-primary dark:text-blue-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">{{ t.decks.openExternally }}</a>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-1.5 mt-auto pt-1 border-t border-primary/5 dark:border-gray-600">
            <span class="text-[12px] text-neutral-400 dark:text-gray-500">{{ t.decks.by }}</span>
            <a
              :href="`/researchers/${deck.researcherId}`"
              class="text-[12px] text-primary/70 dark:text-gray-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors"
            >{{ deck.researcherName }}</a>
          </div>
        </li>
      </ul>
    </template>

    <template v-else>
      <div class="text-center py-20 border border-dashed border-primary/10 dark:border-gray-600">
        <div class="font-mono text-5xl text-primary/10 dark:text-gray-600 mb-4 select-none">&#9633;</div>
        <p class="text-neutral-400 dark:text-gray-500 text-sm max-w-sm mx-auto">{{ t.decks.empty }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'

interface MemberDeck {
  title: string
  url: string
  type: 'web' | 'pdf' | 'pptx' | 'google-slides' | 'canva' | 'other'
  embedUrl?: string
  description?: string
  date?: string
  researcherId: string
  researcherName: string
}

const props = defineProps<{
  decks: MemberDeck[]
  members: { id: string; name: string }[]
}>()

const { t } = useI18n()
const selectedMember = ref('')
const previewOpen = ref<string | null>(null)

const filtered = computed(() =>
  selectedMember.value
    ? props.decks.filter((d) => d.researcherId === selectedMember.value)
    : props.decks,
)

function togglePreview(url: string) {
  previewOpen.value = previewOpen.value === url ? null : url
}

function typeBadgeClass(type: string): string {
  const map: Record<string, string> = {
    web: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    pdf: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    pptx: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    'google-slides': 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    canva: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    other: 'bg-neutral-100 text-neutral-600 dark:bg-gray-700 dark:text-gray-300',
  }
  return map[type] ?? 'bg-neutral-100 text-neutral-600 dark:bg-gray-700 dark:text-gray-300'
}
</script>
