<template>
  <section id="about" class="py-20 md:py-32 bg-white dark:bg-gray-900">
    <div class="section-container">
      <div class="relative overflow-hidden mb-0">
        <span class="absolute -top-4 right-0 font-mono text-[8rem] font-bold text-primary/[0.04] leading-none select-none pointer-events-none" aria-hidden="true">01</span>
        <div class="section-label">{{ t.about.label }}</div>
      </div>

      <div class="grid md:grid-cols-[3fr_2fr] gap-12 md:gap-20">
        <div>
          <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-gray-100 leading-tight mb-8">
            {{ t.about.heading }}
          </h2>
          <p class="text-neutral-600 dark:text-gray-300 leading-relaxed mb-5">
            {{ t.about.p1 }}
          </p>
          <p class="text-neutral-600 dark:text-gray-300 leading-relaxed">
            {{ t.about.p2 }}
          </p>
        </div>

        <div class="relative">
          <div class="md:sticky md:top-24">
            <!-- JSDoc-style vision block -->
            <div class="font-mono text-sm leading-loose bg-neutral-50 dark:bg-gray-800 border border-neutral-200 dark:border-gray-600 p-6">
              <p class="text-accent dark:text-yellow-300 font-semibold">/**</p>
              <p class="text-primary/40 dark:text-gray-500"> * {{ t.about.vision.label }}</p>
              <p class="text-primary/70 dark:text-gray-300 mt-1 leading-relaxed"> * {{ t.about.vision.text }}</p>
              <p class="text-primary/70 dark:text-gray-300 mt-1"> *</p>
              <p class="text-primary/40 dark:text-gray-500"> * @institution Politeknik Negeri Malang</p>
              <p class="text-primary/40 dark:text-gray-500"> * @unit Jurusan Teknologi Informasi</p>
              <p class="text-accent dark:text-yellow-300 font-semibold mt-1"> */</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>
