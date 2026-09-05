<template>
  <div v-if="publications.length > 0" class="mb-10">
    <a
      v-for="pub in pageItems"
      :key="pub.url + pub.title"
      :href="pub.url"
      target="_blank"
      rel="noopener"
      class="stream-hub-pub-item"
    >
      <div class="flex flex-wrap items-start gap-x-3 gap-y-1">
        <span class="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-accent/10 dark:bg-accent/20 text-accent-700 dark:text-accent-400 shrink-0">
          {{ pub.year }}
        </span>
        <span class="text-xs font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-gray-700 text-neutral-500 dark:text-gray-400 shrink-0 capitalize">
          {{ pub.type }}
        </span>
        <h4 class="text-sm font-medium text-primary dark:text-gray-200 leading-snug flex-1 min-w-0">
          {{ pub.title }}
        </h4>
      </div>
      <div class="mt-1 ml-0">
        <span class="text-xs text-neutral-400 dark:text-gray-500">{{ pub.venue }}</span>
        <span v-if="pub.authors.length > 0" class="text-xs text-neutral-400 dark:text-gray-500"> &middot; {{ pub.authors.join(', ') }}</span>
      </div>
    </a>

    <Pagination v-model:current-page="currentPage" :total-pages="totalPages" />
  </div>
  <div v-else class="mb-10">
    <p lang="en" class="text-sm text-neutral-400 dark:text-gray-500 italic py-4 border border-dashed border-neutral-200 dark:border-gray-700 px-4 text-center">
      No publications are currently associated with this stream.
    </p>
    <p lang="id" class="text-sm text-neutral-400 dark:text-gray-500 italic py-4 border border-dashed border-neutral-200 dark:border-gray-700 px-4 text-center">
      Belum ada publikasi yang terkait dengan stream ini.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Pagination from './Pagination.vue'

interface StreamPublication {
  title: string
  year: number
  type: string
  venue: string
  authors: string[]
  url: string
}

const props = defineProps<{
  publications: StreamPublication[]
}>()

const PAGE_SIZE = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.publications.length / PAGE_SIZE)))

const pageItems = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return props.publications.slice(start, start + PAGE_SIZE)
})
</script>
