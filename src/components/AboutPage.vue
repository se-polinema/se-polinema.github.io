<template>
  <div class="px-8 py-8 max-w-4xl bilingual-post">
    <a
      :href="withBase('/')"
      class="inline-flex items-center gap-1 text-xs font-mono text-neutral-400 dark:text-gray-500 hover:text-primary dark:hover:text-accent transition-colors mb-8"
    >
      <span lang="en">&larr; Back to Home</span>
      <span lang="id">&larr; Kembali ke Beranda</span>
    </a>

    <div class="section-label">{{ t.about.label }}</div>
    <h1 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-gray-100 leading-tight mt-2 mb-8">
      {{ t.about.heading }}
    </h1>

    <div class="grid md:grid-cols-[3fr_2fr] gap-12 md:gap-20">
      <div>
        <p class="text-neutral-600 dark:text-gray-300 leading-relaxed mb-5">
          {{ t.about.p1 }}
        </p>
        <p class="text-neutral-600 dark:text-gray-300 leading-relaxed mb-5">
          {{ t.about.p2 }}
        </p>
        <p class="text-neutral-600 dark:text-gray-300 leading-relaxed">
          {{ t.about.institution }}
        </p>

        <div class="flex flex-wrap gap-3 mt-10">
          <a
            :href="withBase('/research')"
            class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-white hover:bg-accent hover:text-primary transition-colors"
          >
            <span lang="en">Explore Research Areas</span>
            <span lang="id">Jelajahi Bidang Riset</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
          <a
            :href="withBase('/join')"
            class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-primary dark:text-blue-300 border border-primary/20 dark:border-gray-500 hover:border-primary/50 dark:hover:border-gray-400 transition-colors"
          >
            {{ t.nav.join }}
          </a>
          <a
            :href="withBase('/contact')"
            class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-primary/70 dark:text-gray-300 hover:text-primary dark:hover:text-blue-200 border border-transparent hover:border-primary/20 dark:hover:border-gray-500 transition-colors"
          >
            {{ t.nav.contact }}
          </a>
        </div>
      </div>

      <div class="relative">
        <div class="md:sticky md:top-24">
          <!-- JSDoc-style vision block -->
          <div class="font-mono text-sm leading-loose bg-neutral-50 dark:bg-gray-800 border border-neutral-200 dark:border-gray-600 p-6">
            <p class="text-accent-700 dark:text-accent-400 font-semibold">/**</p>
            <p class="text-primary/40 dark:text-gray-500"> * {{ t.about.vision.label }}</p>
            <p class="text-primary/70 dark:text-gray-300 mt-1 leading-relaxed"> * {{ t.about.vision.text }}</p>
            <p class="text-primary/70 dark:text-gray-300 mt-1"> *</p>
            <p class="text-primary/40 dark:text-gray-500"> * @institution Politeknik Negeri Malang</p>
            <p class="text-primary/40 dark:text-gray-500"> * @unit Jurusan Teknologi Informasi</p>
            <p class="text-accent-700 dark:text-accent-400 font-semibold mt-1"> */</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'

const { t } = useI18n()
</script>
