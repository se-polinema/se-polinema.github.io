<template>
  <section id="publications" class="py-20 md:py-32 bg-neutral-50">
    <div class="section-container">
      <div class="section-label">{{ t.publications.label }}</div>
      <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight mb-16">
        {{ t.publications.heading }}
      </h2>
      <div class="text-center py-20 border border-dashed border-brand-navy/10">
        <div class="font-mono text-5xl text-brand-navy/10 mb-4 select-none">&para;</div>
        <p class="text-neutral-400 text-sm max-w-sm mx-auto">{{ t.publications.empty }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
const { t } = useI18n()
</script>
