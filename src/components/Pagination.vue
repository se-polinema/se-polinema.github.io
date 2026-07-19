<template>
  <nav
    v-if="totalPages > 1"
    class="flex flex-wrap items-center justify-center gap-1 gap-y-2 mt-10 pt-6 border-t border-primary/10 dark:border-gray-700"
    aria-label="Pagination"
  >
    <button
      type="button"
      :class="navButtonClass"
      :disabled="currentPage <= 1"
      :aria-label="t.pagination.previous"
      @click="goTo(currentPage - 1)"
    >
      ← <span class="hidden sm:inline">{{ t.pagination.previous }}</span>
    </button>

    <template v-for="(item, i) in pageItems" :key="i">
      <span v-if="item === 'ellipsis'" class="px-1.5 text-primary/30 dark:text-gray-600 font-mono text-sm select-none" aria-hidden="true">
        …
      </span>
      <button
        v-else
        type="button"
        :class="pageButtonClass(item)"
        :aria-current="item === currentPage ? 'page' : undefined"
        :aria-label="`${t.pagination.page} ${item}`"
        @click="goTo(item)"
      >
        {{ item }}
      </button>
    </template>

    <button
      type="button"
      :class="navButtonClass"
      :disabled="currentPage >= totalPages"
      :aria-label="t.pagination.next"
      @click="goTo(currentPage + 1)"
    >
      <span class="hidden sm:inline">{{ t.pagination.next }} </span>→
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const { t } = useI18n()

function goTo(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('update:currentPage', page)
}

const navButtonClass =
  'min-w-[2rem] h-8 px-2.5 flex items-center justify-center font-mono text-[13px] border border-primary/10 dark:border-gray-700 text-primary/60 dark:text-gray-400 hover:border-primary/25 dark:hover:border-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-primary/10 dark:disabled:hover:border-gray-700 disabled:hover:text-primary/60 dark:disabled:hover:text-gray-400'

function pageButtonClass(page: number): string {
  if (page === props.currentPage) {
    return 'min-w-[2rem] h-8 px-2.5 flex items-center justify-center font-mono text-[13px] border border-primary bg-primary text-white font-semibold'
  }
  return 'min-w-[2rem] h-8 px-2.5 flex items-center justify-center font-mono text-[13px] border border-primary/10 dark:border-gray-700 text-primary/60 dark:text-gray-400 hover:border-primary/25 dark:hover:border-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors'
}

// Numbered pages with ellipsis truncation for long runs: always show the
// first/last page plus a window around the current page, e.g.
// "1 … 4 5 [6] 7 8 … 24" instead of listing every page.
const pageItems = computed<Array<number | 'ellipsis'>>(() => {
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items: Array<number | 'ellipsis'> = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) items.push('ellipsis')
  for (let page = start; page <= end; page++) items.push(page)
  if (end < total - 1) items.push('ellipsis')
  items.push(total)

  return items
})
</script>
