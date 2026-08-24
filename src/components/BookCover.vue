<template>
  <img
    v-if="src && !failed"
    :src="src"
    :alt="`Cover of ${title}`"
    :class="['w-full', fit === 'cover' ? 'h-full object-cover object-center' : 'h-auto object-contain']"
    loading="lazy"
    @error="failed = true"
  />
  <div
    v-else
    :class="['w-full flex flex-col items-center justify-center gap-1.5 px-2 text-center', fit === 'cover' ? 'h-full' : 'aspect-[3/4]']"
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-300 dark:text-gray-500 shrink-0">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
    <span class="text-[10px] leading-tight text-neutral-400 dark:text-gray-500 line-clamp-3">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  src?: string
  title: string
  fit?: 'cover' | 'contain'
}>()

// Falls back to a placeholder (book icon + title) whenever `src` is empty or
// the image fails to load, e.g. the researcher-supplied cover is hosted on
// a host that blocks hotlinking/direct fetches. See BookCover usages across
// Books.vue, BooksDirectoryPage.vue, BookDetailPage.vue, and
// ResearcherProfilePage.vue.
const failed = ref(false)

watch(() => props.src, () => {
  failed.value = false
})
</script>
