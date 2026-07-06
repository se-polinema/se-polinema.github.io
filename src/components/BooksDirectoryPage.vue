<template>
  <div class="px-8 py-5">
    <!-- Heading -->
    <div class="section-label mb-2">{{ t.books.label }}</div>
    <h1 class="font-serif text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 leading-tight mb-2">
      {{ t.books.archiveHeading }}
    </h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
      {{ t.books.archiveDescription }}
    </p>

    <!-- Filter bar -->
    <div class="flex items-center gap-4 mb-6">
      <select
        v-model="selectedMember"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.books.allMembers }}</option>
        <option v-for="m in members" :key="m.id" :value="m.id">{{ m.name }}</option>
      </select>
    </div>

    <!-- Result count -->
    <div class="mb-6 text-sm text-neutral-500 dark:text-gray-400">
      {{ filtered.length }}
      {{ filtered.length === 1 ? t.books.resultSingle : t.books.resultPlural }}
    </div>

    <!-- Grid -->
    <template v-if="filtered.length > 0">
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <li
          v-for="book in filtered"
          :key="book.title"
          class="border border-primary/10 dark:border-gray-600 bg-white dark:bg-gray-800 flex flex-col hover:border-primary/20 dark:hover:border-gray-500 transition-colors"
        >
          <a
            :href="`/books/${book.slug}`"
            class="flex gap-4 p-4"
          >
            <div
              v-if="book.coverImage"
              class="w-24 sm:w-28 flex-shrink-0 bg-neutral-100 dark:bg-gray-700 border border-primary/5 dark:border-gray-600 overflow-hidden"
            >
              <img
                :src="book.coverImage"
                :alt="`Cover of ${book.title}`"
                class="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
            <div class="flex flex-col gap-2 min-w-0 flex-1">
              <div class="font-serif text-[1rem] font-semibold text-primary dark:text-gray-100 leading-snug line-clamp-2">
                {{ lang === 'id' && book.titleId ? book.titleId : book.title }}
              </div>
              <p v-if="book.year" class="text-[12px] text-neutral-400 dark:text-gray-500 font-mono">{{ book.year }}</p>
              <p v-if="book.description || book.descriptionId" class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                {{ lang === 'id' && book.descriptionId ? book.descriptionId : book.description }}
              </p>
            </div>
          </a>
          <div class="flex items-center gap-1.5 px-4 pb-3 pt-1 border-t border-primary/5 dark:border-gray-600 flex-wrap">
            <span class="text-[12px] text-neutral-400 dark:text-gray-500">{{ t.books.by }}</span>
            <template v-for="(author, idx) in book.authors" :key="author.id">
              <a
                :href="`/researchers/${author.id}`"
                class="text-[12px] text-primary/70 dark:text-gray-300 hover:text-accent dark:hover:text-yellow-300 transition-colors"
              >{{ author.name }}</a>
              <span v-if="idx < book.authors.length - 1" class="text-[12px] text-neutral-400 dark:text-gray-500">,</span>
            </template>
          </div>
        </li>
      </ul>
    </template>

    <!-- Empty state -->
    <template v-else>
      <div class="text-center py-20 border border-dashed border-primary/10 dark:border-gray-600">
        <div class="font-mono text-5xl text-primary/10 mb-4 select-none">&#9634;</div>
        <p class="text-neutral-400 dark:text-gray-500 text-sm max-w-sm mx-auto">{{ t.books.empty }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'

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
  books: MemberBook[]
  members: { id: string; name: string }[]
}>()

const { lang, t } = useI18n()
const selectedMember = ref('')

const filtered = computed(() =>
  selectedMember.value
    ? props.books.filter((b) => b.authors.some((a) => a.id === selectedMember.value))
    : props.books,
)
</script>
