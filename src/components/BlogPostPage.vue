<template>
  <!-- Title — no class so .editor-body h1::before adds the # prefix -->
  <h1>{{ displayTitle }}</h1>

  <!-- Subtle metadata line, styled like a markdown italic comment -->
  <p class="font-mono text-[11.5px] text-neutral-400 mt-1 mb-8 italic">
    {{ displayDate }} &middot; {{ category }}
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const props = defineProps<{
  title: string
  titleId?: string
  category: string
  date: Date | string
}>()

const { lang } = useI18n()

const displayTitle = computed(() =>
  lang.value === 'id' && props.titleId ? props.titleId : props.title
)

const displayDate = computed(() => {
  const d = props.date instanceof Date ? props.date : new Date(props.date as string)
  return new Intl.DateTimeFormat(lang.value === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
})
</script>
