<template>
  <div class="px-8 py-5">
    <div class="flex flex-col items-center justify-center text-center py-16 md:py-24">
      <span class="font-mono text-[8rem] md:text-[10rem] font-bold text-primary/[0.06] leading-none select-none pointer-events-none" aria-hidden="true">404</span>

      <h1 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-gray-100 leading-tight mt-2">
        {{ t.notFound.heading }}
      </h1>

      <p class="text-neutral-500 dark:text-gray-400 leading-relaxed mt-4 max-w-lg">
        {{ t.notFound.description }}
      </p>

      <nav class="flex flex-wrap items-center justify-center gap-4 mt-8" aria-label="404 navigation">
        <a :href="withBase('/')" class="text-[13px] font-mono text-primary/60 dark:text-gray-400 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">
          {{ t.notFound.home }}
        </a>
        <a :href="withBase('/blog')" class="text-[13px] font-mono text-primary/60 dark:text-gray-400 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">
          {{ t.notFound.blog }}
        </a>
        <a :href="withBase('/members?filter=researchers')" class="text-[13px] font-mono text-primary/60 dark:text-gray-400 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">
          {{ t.notFound.researchers }}
        </a>
        <a :href="withBase('/publications')" class="text-[13px] font-mono text-primary/60 dark:text-gray-400 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">
          {{ t.notFound.publications }}
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'

const { t } = useI18n()
</script>
