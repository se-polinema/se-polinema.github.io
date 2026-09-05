<template>
  <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mt-6">
      <article v-for="researcher in researchers" :key="researcher.id" class="group border border-primary/10 dark:border-gray-600 bg-neutral-50 dark:bg-gray-800 p-5 md:p-6 hover:border-primary/25 dark:hover:border-gray-500 transition-colors">
        <div class="flex items-start gap-3 md:gap-4 mb-5">
          <div class="relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-full overflow-hidden bg-neutral-100 dark:bg-gray-700 ring-1 ring-neutral-200 dark:ring-gray-600 group-hover:ring-primary/30 transition-colors">
            <img
              :src="researcher.image?.src ?? withBase(researcher.photo)"
              :srcset="researcher.image?.srcset"
              :sizes="researcher.image?.sizes"
              :width="researcher.image?.width"
              :height="researcher.image?.height"
              :alt="researcher.name"
              class="h-full w-full object-cover"
              :style="{ objectPosition: researcher.photoPosition }"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="min-w-0">
            <h2 class="font-serif text-lg md:text-xl font-semibold text-primary dark:text-gray-100 leading-snug">
              <a :href="withBase(`/researchers/${researcher.id}`)" class="hover:underline decoration-primary/20 underline-offset-4">
                {{ researcher.name }}
              </a>
            </h2>
            <p class="mt-1 text-sm text-primary/50 dark:text-gray-400">{{ lang === 'id' ? researcher.title.id : researcher.title.en }}</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <span v-for="item in researcher.expertise.slice(0, 3)" :key="item" class="text-[11px] font-mono uppercase tracking-wide text-primary/60 dark:text-gray-400 bg-white dark:bg-gray-800 border border-primary/10 dark:border-gray-600 px-2 py-1">
            {{ item }}
          </span>
        </div>

        <p class="text-sm text-neutral-600 dark:text-gray-300 leading-relaxed mb-5">
          {{ lang === 'id' ? researcher.shortBio.id : researcher.shortBio.en }}
        </p>

        <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <a :href="withBase(`/researchers/${researcher.id}`)" class="text-sm font-mono text-primary/50 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors">
            {{ t.team.viewProfile }} →
          </a>
          <a :href="researcher.googleScholarUrl" target="_blank" rel="noopener" class="text-sm text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors">
            Google Scholar
          </a>
        </div>
      </article>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'

defineProps<{
  researchers: Array<{
    id: string
    name: string
    photo: string
    photoPosition: string
    image: {
      src: string
      srcset: string
      sizes: string
      width: number
      height: number
    } | null
    title: { id: string; en: string }
    shortBio: { id: string; en: string }
    expertise: string[]
    googleScholarUrl: string
  }>
}>()

const { lang, t } = useI18n()
</script>
