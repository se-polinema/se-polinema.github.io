<template>
  <a :href="href"><slot :email="email">{{ email }}</slot></a>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { decodeEmail } from '../utils/email'

const props = defineProps<{
  encoded: string
  subject?: string
}>()

// Empty at SSR/initial render: nothing scrapeable in static HTML.
// Filled client-side after mount so hydration never mismatches.
const email = ref('')

onMounted(() => {
  email.value = decodeEmail(props.encoded)
})

const href = computed(() => {
  if (!email.value) return undefined
  return props.subject
    ? `mailto:${email.value}?subject=${encodeURIComponent(props.subject)}`
    : `mailto:${email.value}`
})
</script>
