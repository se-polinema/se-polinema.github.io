<template>
  <div class="mb-10">
    <h1>{{ t.publications.archiveHeading }}</h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm mt-1">{{ t.publications.archiveDescription }}</p>
    <p v-if="formattedDate" class="text-neutral-400 dark:text-gray-500 text-xs mt-2">{{ t.publications.lastUpdated }}: {{ formattedDate }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const props = defineProps<{
  lastUpdated?: string | null
}>()

const { t } = useI18n()

const formattedDate = computed(() => {
  if (!props.lastUpdated) return null
  return new Date(props.lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>
