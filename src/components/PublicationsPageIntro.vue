<template>
  <div class="max-w-3xl mb-16">
    <div class="section-label">{{ t.publications.label }}</div>
    <h1 class="font-serif text-4xl md:text-5xl font-bold text-primary leading-tight mb-6">
      {{ t.publications.archiveHeading }}
    </h1>
    <p class="text-neutral-600 leading-relaxed text-lg">
      {{ t.publications.archiveDescription }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>
