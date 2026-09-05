<template>
  <div class="px-8 py-8 max-w-4xl bilingual-post">
    <a
      :href="withBase('/books')"
      class="inline-flex items-center gap-1 text-xs font-mono text-neutral-400 dark:text-gray-500 hover:text-primary dark:hover:text-accent transition-colors mb-8"
    >
      <span lang="en">&larr; {{ t.books.backToBooks }}</span>
      <span lang="id">&larr; {{ t.books.backToBooks }}</span>
    </a>

    <div class="flex flex-col md:flex-row gap-8 mb-8">
      <div
        class="w-48 sm:w-56 flex-shrink-0 border border-primary/10 dark:border-gray-600 bg-neutral-50 dark:bg-gray-800 mx-auto md:mx-0"
      >
        <BookCover :src="book.coverImage ? withBase(book.coverImage) : undefined" :title="book.title" fit="contain" />
      </div>

      <div class="flex-1 min-w-0">
        <h1 lang="en" class="font-serif text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 leading-tight mb-3">{{ book.title }}</h1>
        <h1 lang="id" class="font-serif text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 leading-tight mb-3">{{ book.titleId ?? book.title }}</h1>

        <div v-if="book.authors.length > 0" class="mb-4">
          <h2 class="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
            <span lang="en">{{ t.books.authorsLabel }}</span>
            <span lang="id">{{ t.books.authorsLabel }}</span>
          </h2>
          <div class="flex flex-wrap gap-1.5">
            <a
              v-for="author in book.authors"
              :key="author.id"
              :href="withBase(`/researchers/${author.id}`)"
              class="text-sm text-primary/70 dark:text-gray-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors font-mono"
            >{{ author.name }}</a>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-6 text-sm">
          <div v-if="book.year">
            <span class="text-neutral-400 dark:text-gray-500 font-mono text-xs">
              <span lang="en">{{ t.books.yearPublished }}</span>
              <span lang="id">{{ t.books.yearPublished }}</span>
            </span>
            <span class="ml-2 text-primary dark:text-gray-200">{{ book.year }}</span>
          </div>
          <div v-if="book.publisher">
            <span class="text-neutral-400 dark:text-gray-500 font-mono text-xs">
              <span lang="en">{{ t.books.publishedBy }}</span>
              <span lang="id">{{ t.books.publishedBy }}</span>
            </span>
            <span class="ml-2 text-primary dark:text-gray-200">{{ book.publisher }}</span>
          </div>
          <div v-if="book.isbn" class="sm:col-span-2">
            <span class="text-neutral-400 dark:text-gray-500 font-mono text-xs">{{ t.books.isbnLabel }}</span>
            <span class="ml-2 text-primary dark:text-gray-200 font-mono text-xs">{{ book.isbn }}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <a
            v-if="book.url"
            :href="book.url"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono bg-primary text-white dark:bg-blue-600 dark:text-white hover:bg-primary/90 dark:hover:bg-blue-500 transition-colors rounded"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            <span lang="en">{{ t.books.viewBookSite }}</span>
            <span lang="id">{{ t.books.viewBookSite }}</span>
          </a>
          <a
            v-if="book.playstoreUrl"
            :href="book.playstoreUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono bg-primary text-white dark:bg-blue-600 dark:text-white hover:bg-primary/90 dark:hover:bg-blue-500 transition-colors rounded"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.303-10.937 6.332 8.635-8.635zm3.199-3.198l2.808 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.303 2.303-8.634-8.635z"/>
            </svg>
            <span lang="en">{{ t.books.buyOnPlayStore }}</span>
            <span lang="id">{{ t.books.buyOnPlayStore }}</span>
          </a>
          <button
            @click="toggleSaved"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-gray-800 transition-colors rounded"
          >
            <svg v-if="!isSaved" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
            <span v-if="!isSaved" lang="en">{{ t.books.saveForLater }}</span>
            <span v-if="!isSaved" lang="id">{{ t.books.saveForLater }}</span>
            <span v-if="isSaved" lang="en">{{ t.books.savedForLater }}</span>
            <span v-if="isSaved" lang="id">{{ t.books.savedForLater }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="pt-6 border-t border-primary/5 dark:border-gray-700">
      <h2 class="font-serif text-lg font-semibold text-primary dark:text-gray-100 mb-3">
        <span lang="en">{{ t.books.descriptionLabel }}</span>
        <span lang="id">{{ t.books.descriptionLabel }}</span>
      </h2>
      <div v-if="hasDesc" class="space-y-4">
        <p lang="en" class="text-neutral-600 dark:text-gray-300 leading-relaxed">
          {{ book.description ?? t.books.noDescriptionAvailable }}
        </p>
        <p lang="id" class="text-neutral-600 dark:text-gray-300 leading-relaxed">
          {{ book.descriptionId ?? book.description ?? t.books.noDescriptionAvailable }}
        </p>
      </div>
      <div v-else>
        <p class="text-neutral-400 dark:text-gray-500 italic text-sm">
          <span lang="en">{{ t.books.noDescriptionAvailable }}</span>
          <span lang="id">{{ t.books.noDescriptionAvailable }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'
import BookCover from './BookCover.vue'

interface MemberBook {
  title: string
  titleId?: string
  slug?: string
  url?: string
  playstoreUrl?: string
  coverImage?: string
  description?: string
  descriptionId?: string
  year?: number
  publisher?: string
  isbn?: string
  authors: { id: string; name: string }[]
}

const props = defineProps<{
  book: MemberBook
}>()

const { lang, t } = useI18n()

const hasDesc = computed(() => !!(props.book.description || props.book.descriptionId))

const savedKey = computed(() => `se-bookmark-${props.book.slug}`)
const isSaved = ref(false)

onMounted(() => {
  try {
    isSaved.value = localStorage.getItem(savedKey.value) === '1'
  } catch {}
})

function toggleSaved() {
  isSaved.value = !isSaved.value
  try {
    localStorage.setItem(savedKey.value, isSaved.value ? '1' : '0')
  } catch {}
}
</script>
