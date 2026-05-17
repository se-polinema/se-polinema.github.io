<template>
  <div class="px-8 py-5">
    <h1>{{ t.team.directoryHeading }}</h1>
    <p class="text-neutral-500 text-sm mt-1 mb-8">{{ t.team.directoryDescription }}</p>

    <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mt-6">
      <article v-for="researcher in researchers" :key="researcher.id" class="group border border-primary/10 bg-neutral-50 p-5 md:p-6 hover:border-primary/25 transition-colors">
        <div class="flex items-start gap-3 md:gap-4 mb-5">
          <div class="relative h-20 w-16 md:h-24 md:w-[4.5rem] shrink-0 bg-white border border-neutral-200 overflow-hidden">
            <img :src="researcher.photo" :alt="researcher.name" class="h-full w-full object-cover object-top" loading="lazy" />
          </div>
          <div class="min-w-0">
            <h2 class="font-serif text-lg md:text-xl font-semibold text-primary leading-snug">
              <a :href="`/researchers/${researcher.id}`" class="hover:underline decoration-primary/20 underline-offset-4">
                {{ researcher.name }}
              </a>
            </h2>
            <p class="mt-1 text-sm text-primary/50">{{ lang === 'id' ? researcher.title.id : researcher.title.en }}</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <span v-for="item in researcher.expertise.slice(0, 3)" :key="item" class="text-[11px] font-mono uppercase tracking-wide text-primary/60 bg-white border border-primary/10 px-2 py-1">
            {{ item }}
          </span>
        </div>

        <p class="text-sm text-neutral-600 leading-relaxed mb-5">
          {{ lang === 'id' ? researcher.shortBio.id : researcher.shortBio.en }}
        </p>

        <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <a :href="`/researchers/${researcher.id}`" class="text-sm font-mono text-primary/50 hover:text-primary transition-colors">
            {{ t.team.viewProfile }} →
          </a>
          <a :href="researcher.googleScholarUrl" target="_blank" rel="noopener" class="text-sm text-primary/40 hover:text-primary transition-colors">
            Google Scholar
          </a>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

defineProps<{
  researchers: Array<{
    id: string
    name: string
    photo: string
    title: { id: string; en: string }
    shortBio: { id: string; en: string }
    expertise: string[]
    googleScholarUrl: string
  }>
}>()

const { lang, t } = useI18n()
</script>
