<template>
  <div class="mb-10">
    <h1>{{ t.publications.archiveHeading }}</h1>
    <p class="text-neutral-500 text-sm mt-1">{{ t.publications.archiveDescription }}</p>
    <p v-if="lastUpdated" class="text-neutral-400 text-xs mt-2">
      {{ t.publications.lastUpdated }}: {{ formattedDate }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const props = defineProps<{
  lastUpdated?: string
}>()

const { t } = useI18n()

const formattedDate = computed(() => {
  if (!props.lastUpdated) return ''
  try {
    const date = new Date(props.lastUpdated)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return props.lastUpdated
  }
})
</script>
