<template>
  <section id="research" class="py-20 md:py-32 bg-white dark:bg-gray-900">
    <div class="section-container">
      <div class="relative overflow-hidden mb-16">
        <span class="absolute -top-4 right-0 font-mono text-[8rem] font-bold text-primary/[0.04] leading-none select-none pointer-events-none" aria-hidden="true">02</span>
        <div class="section-label">{{ t.research.label }}</div>
        <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-gray-100 leading-tight">
          {{ t.research.heading }}
        </h2>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <a
          v-for="(area, index) in research"
          :key="area.id"
          :href="withBase(`/research/${area.id}`)"
          class="group bg-neutral-50 dark:bg-gray-800 border border-neutral-100 dark:border-gray-700 hover:border-accent/30 transition-all duration-300 p-6 relative overflow-hidden block"
          :class="{ 'sm:col-span-2 sm:max-w-[calc(50%-0.5rem)]': index === research.length - 1 && research.length % 2 !== 0 }"
        >
          <!-- Accent sweep line -->
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

          <div class="flex items-start gap-4">
            <span class="font-mono text-5xl font-bold text-primary/[0.08] leading-none shrink-0 tabular-nums select-none mt-1">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <div>
              <h3 class="font-serif text-lg md:text-xl font-semibold text-primary dark:text-gray-100 mb-2 group-hover:text-primary/80 dark:group-hover:text-gray-300 transition-colors">
                {{ lang === 'id' ? area.name.id : area.name.en }}
              </h3>
              <p class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed mb-3">
                {{ lang === 'id' ? area.tagline.id : area.tagline.en }}
              </p>
              <span class="inline-block text-xs font-mono px-2 py-0.5 rounded bg-primary/[0.06] dark:bg-gray-700 text-primary/60 dark:text-gray-400 border border-primary/10 dark:border-gray-600">
                {{ area.topics.length }} {{ t.research.topicsLabel }}
              </span>
            </div>
          </div>
        </a>
      </div>

      <div class="mt-8 text-center">
        <a
          :href="withBase('/research')"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-primary dark:text-blue-300 border border-primary/20 dark:border-gray-500 hover:border-primary/50 dark:hover:border-gray-400 transition-colors"
        >
          {{ t.research.viewAllCta }}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'
import researchData from '../data/research.json'

const { lang, t } = useI18n()
const research = researchData
</script>
