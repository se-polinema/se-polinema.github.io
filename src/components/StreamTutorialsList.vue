<template>
  <div v-if="items.length > 0" class="mb-10">
    <div class="grid sm:grid-cols-2 gap-3">
      <a
        v-for="item in pageItems"
        :key="item.url"
        :href="withBase(item.url)"
        :target="item.url.startsWith('http') ? '_blank' : undefined"
        :rel="item.url.startsWith('http') ? 'noopener' : undefined"
        class="stream-hub-researcher-card"
      >
        <div class="flex items-start gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary/60 shrink-0 mt-0.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <div class="min-w-0 flex-1">
            <h4 class="font-semibold text-sm text-primary dark:text-gray-100 mb-1">
              <span lang="en">{{ item.title }}</span>
              <span lang="id">{{ item.titleId }}</span>
            </h4>
            <p v-if="item.description" lang="en" class="text-xs text-neutral-500 dark:text-gray-400 line-clamp-2">
              {{ item.description }}
            </p>
            <p v-if="item.descriptionId" lang="id" class="text-xs text-neutral-500 dark:text-gray-400 line-clamp-2">
              {{ item.descriptionId }}
            </p>
            <div class="flex flex-wrap items-center gap-1.5 mt-2">
              <span v-if="item.date" class="text-[10px] font-mono text-neutral-400 dark:text-gray-500">
                {{ formatDate(item.date) }}
              </span>
              <span v-if="item.type" class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-gray-700 text-neutral-500 dark:text-gray-400 capitalize">
                {{ item.type }}
              </span>
              <span v-if="item.level" :class="levelBadgeClass(item.level)" class="text-[10px] font-mono px-1.5 py-0.5 rounded capitalize">
                {{ item.level }}
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>

    <Pagination v-model:current-page="currentPage" :total-pages="totalPages" />
  </div>
  <div v-else class="mb-10">
    <p lang="en" class="text-sm text-neutral-400 dark:text-gray-500 italic py-4 border border-dashed border-neutral-200 dark:border-gray-700 px-4 text-center">
      No tutorials or resources are currently associated with this stream.
    </p>
    <p lang="id" class="text-sm text-neutral-400 dark:text-gray-500 italic py-4 border border-dashed border-neutral-200 dark:border-gray-700 px-4 text-center">
      Belum ada tutorial atau sumber daya yang terkait dengan stream ini.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Pagination from './Pagination.vue'
import { withBase } from '../lib/paths'

interface StreamTutorialItem {
  title: string
  titleId: string
  description: string
  descriptionId: string
  url: string
  date?: string
  level?: string
  type?: string
}

const props = defineProps<{
  items: StreamTutorialItem[]
}>()

const PAGE_SIZE = 6
const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.items.length / PAGE_SIZE)))

const pageItems = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return props.items.slice(start, start + PAGE_SIZE)
})

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function levelBadgeClass(level: string): string {
  switch (level) {
    case 'beginner':
      return 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/20 dark:border-green-500/30'
    case 'intermediate':
      return 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30'
    case 'advanced':
      return 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 dark:border-red-500/30'
    default:
      return 'bg-neutral-100 dark:bg-gray-700 text-neutral-500 dark:text-gray-400 border border-neutral-200 dark:border-gray-600'
  }
}
</script>
