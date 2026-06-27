<template>
  <section id="books" class="py-20 md:py-32 bg-white dark:bg-gray-900">
    <div class="section-container">
      <div class="flex items-end justify-between mb-3">
        <div class="section-label">{{ t.books.label }}</div>
        <a
          v-if="books.length > 0"
          href="/books"
          class="text-[13px] font-mono text-primary/60 dark:text-gray-400 hover:text-accent dark:hover:text-yellow-300 transition-colors hidden sm:block"
        >{{ t.books.viewAll }} →</a>
      </div>
      <div class="flex items-end justify-between mb-16">
        <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-gray-100 leading-tight">
          {{ t.books.heading }}
        </h2>
      </div>

      <!-- Carousel -->
      <template v-if="books.length > 0">
        <CardCarousel>
          <div
            v-for="book in books"
            :key="book.title"
            class="flex-shrink-0 w-80 snap-start border border-primary/10 dark:border-gray-600 bg-neutral-50 dark:bg-gray-800 p-5 flex flex-col gap-3 hover:border-primary/20 dark:hover:border-gray-500 transition-colors"
          >
            <!-- Cover image -->
            <div v-if="book.coverImage" class="w-full aspect-[3/4] bg-neutral-100 dark:bg-gray-700 overflow-hidden border border-primary/5 dark:border-gray-600 -mx-5 -mt-5 mb-1" style="width: calc(100% + 2.5rem);">
              <img :src="book.coverImage" :alt="`Cover of ${book.title}`" class="w-full h-full object-cover object-center" loading="lazy" />
            </div>
            <div class="font-serif text-[1rem] font-semibold text-primary dark:text-gray-100 leading-snug">
              {{ lang === 'id' && book.titleId ? book.titleId : book.title }}
            </div>
            <p v-if="book.description || book.descriptionId" class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed flex-1">
              {{ lang === 'id' && book.descriptionId ? book.descriptionId : book.description }}
            </p>
            <div v-if="book.playstoreUrl" class="mt-1">
              <a
                :href="book.playstoreUrl"
                target="_blank"
                rel="noopener"
                class="text-[13px] text-primary dark:text-blue-300 hover:text-accent dark:hover:text-yellow-300 transition-colors"
              >Buy on Google Play Books →</a>
            </div>
            <div class="flex items-center gap-1.5 mt-auto pt-1 border-t border-primary/5 dark:border-gray-600">
              <span class="text-[12px] text-neutral-400 dark:text-gray-500">{{ t.books.by }}</span>
              <a
                :href="`/researchers/${book.researcherId}`"
                class="text-[12px] text-primary/70 dark:text-gray-300 hover:text-accent dark:hover:text-yellow-300 transition-colors"
              >{{ book.researcherName }}</a>
            </div>
          </div>
        </CardCarousel>
        <div class="mt-6 sm:hidden">
          <a href="/books" class="text-[13px] font-mono text-primary/60 dark:text-gray-400 hover:text-accent dark:hover:text-yellow-300 transition-colors">{{ t.books.viewAll }} →</a>
        </div>
      </template>

      <!-- Empty state -->
      <template v-else>
        <div class="text-center py-20 border border-dashed border-primary/10 dark:border-gray-600">
          <div class="font-mono text-5xl text-primary/10 mb-4 select-none">&#9634;</div>
          <p class="text-neutral-400 dark:text-gray-500 text-sm max-w-sm mx-auto">{{ t.books.empty }}</p>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import CardCarousel from './CardCarousel.vue'
import { useI18n } from '../composables/useI18n'

export interface MemberBook {
  title: string
  titleId?: string
  playstoreUrl?: string
  coverImage?: string
  description?: string
  descriptionId?: string
  researcherId: string
  researcherName: string
}

defineProps<{ books: MemberBook[] }>()

const { lang, t } = useI18n()
</script>
