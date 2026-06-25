<template>
  <section id="books" class="py-20 md:py-32 bg-white">
    <div class="section-container">
      <div class="flex items-end justify-between mb-3">
        <div class="section-label">{{ t.books.label }}</div>
        <a
          v-if="books.length > 0"
          href="/books"
          class="text-[13px] font-mono text-primary/60 hover:text-accent transition-colors hidden sm:block"
        >{{ t.books.viewAll }} →</a>
      </div>
      <div class="flex items-end justify-between mb-16">
        <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
          {{ t.books.heading }}
        </h2>
      </div>

      <!-- Carousel -->
      <template v-if="books.length > 0">
        <CardCarousel>
          <div
            v-for="book in books"
            :key="book.title"
            class="flex-shrink-0 w-80 snap-start border border-primary/10 bg-neutral-50 p-5 flex flex-col gap-3 hover:border-primary/20 transition-colors"
          >
            <div class="font-serif text-[1rem] font-semibold text-primary leading-snug">
              {{ book.title }}
            </div>
            <p v-if="book.description" class="text-sm text-neutral-500 leading-relaxed flex-1">
              {{ book.description }}
            </p>
            <div v-if="book.playstoreUrl" class="mt-1">
              <a
                :href="book.playstoreUrl"
                target="_blank"
                rel="noopener"
                class="text-[13px] text-primary hover:text-accent transition-colors"
              >Buy on Google Play Books →</a>
            </div>
            <div class="flex items-center gap-1.5 mt-auto pt-1 border-t border-primary/5">
              <span class="text-[12px] text-neutral-400">{{ t.books.by }}</span>
              <a
                :href="`/researchers/${book.researcherId}`"
                class="text-[12px] text-primary/70 hover:text-accent transition-colors"
              >{{ book.researcherName }}</a>
            </div>
          </div>
        </CardCarousel>
        <div class="mt-6 sm:hidden">
          <a href="/books" class="text-[13px] font-mono text-primary/60 hover:text-accent transition-colors">{{ t.books.viewAll }} →</a>
        </div>
      </template>

      <!-- Empty state -->
      <template v-else>
        <div class="text-center py-20 border border-dashed border-primary/10">
          <div class="font-mono text-5xl text-primary/10 mb-4 select-none">&#9634;</div>
          <p class="text-neutral-400 text-sm max-w-sm mx-auto">{{ t.books.empty }}</p>
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
  playstoreUrl?: string
  description?: string
  researcherId: string
  researcherName: string
}

defineProps<{ books: MemberBook[] }>()

const { t } = useI18n()
</script>
