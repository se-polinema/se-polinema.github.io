<template>
  <div class="mb-10">
    <h1>{{ t.publications.archiveHeading }}</h1>
    <p class="text-neutral-500 text-sm mt-1">{{ t.publications.archiveDescription }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>
