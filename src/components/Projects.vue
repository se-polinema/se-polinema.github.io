<template>
  <section id="projects" class="py-20 md:py-32 bg-white">
    <div class="section-container">
      <div class="section-label">{{ t.projects.label }}</div>
      <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight mb-16">
        {{ t.projects.heading }}
      </h2>
      <div class="text-center py-20 border border-dashed border-primary/10">
        <div class="font-mono text-5xl text-primary/10 mb-4 select-none">&#123;&nbsp;&#125;</div>
        <p class="text-neutral-400 text-sm max-w-sm mx-auto">{{ t.projects.empty }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
const { t } = useI18n()
</script>
