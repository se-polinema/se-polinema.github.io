<template>
  <section id="publications" class="py-20 md:py-32 bg-white">
    <div class="section-container">
      <div class="flex items-end justify-between gap-6 mb-16">
        <div class="relative overflow-hidden">
          <span class="absolute -top-4 right-0 font-mono text-[8rem] font-bold text-primary/[0.04] leading-none select-none pointer-events-none" aria-hidden="true">04</span>
          <div class="section-label">{{ t.publications.label }}</div>
          <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
            {{ t.publications.heading }}
          </h2>
        </div>
        <a href="/publications" class="hidden sm:inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary transition-colors">
          {{ t.publications.viewAll }}
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div v-if="publications.length > 0" class="space-y-5">
        <article
          v-for="publication in publications"
          :key="publication.id"
          class="grid gap-4 md:grid-cols-[5rem_minmax(0,1fr)] border-t border-primary/10 pt-5"
        >
          <div class="font-mono text-xs uppercase tracking-wider text-primary/40 pt-1">
            {{ publication.year }}
          </div>
          <div>
            <h3 class="font-serif text-lg md:text-xl font-semibold text-primary leading-snug">
              <a v-if="publication.url" :href="publication.url" target="_blank" rel="noopener" class="hover:underline decoration-primary/20 underline-offset-4">
                {{ publication.title }}
              </a>
              <span v-else>{{ publication.title }}</span>
            </h3>
            <p class="mt-2 text-sm text-neutral-600 leading-relaxed">
              {{ publication.authors.slice(0, 3).join(', ') }}<span v-if="publication.authors.length > 3"> +{{ publication.authors.length - 3 }} more</span>
            </p>
            <div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
              <span class="font-mono uppercase tracking-wider">{{ publication.type }}</span>
              <span>{{ publication.venue }}</span>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="text-center py-20 border border-dashed border-primary/10">
        <p class="text-neutral-400 text-sm max-w-sm mx-auto">{{ t.publications.empty }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

defineProps<{
  publications: Array<{
    id: string
    title: string
    year: number
    authors: string[]
    venue: string
    type: string
    url: string
  }>
}>()

const { t } = useI18n()
</script>
