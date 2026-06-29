<template>
  <!-- Title — no class so .editor-body h1::before adds the # prefix -->
  <h1>{{ displayTitle }}</h1>

  <!-- Subtle metadata line, styled like a markdown italic comment -->
  <p class="font-mono text-[11.5px] text-neutral-400 dark:text-gray-500 mt-1 mb-2 italic">
    {{ displayDate }} &middot; {{ category }} &middot; {{ readingTimeLabel }}
  </p>
  <p class="flex items-center gap-1.5 font-mono text-[11.5px] text-neutral-400 dark:text-gray-500 italic mb-8">
    <span>{{ t.blog.authorBy }}</span>
    <template v-if="props.matchedResearcher">
      <a
        :href="`/researchers/${props.matchedResearcher.id}`"
        class="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline hover:underline"
      >
        <img
          :src="props.matchedResearcher.photo"
          :alt="props.matchedResearcher.name"
          class="w-4 h-4 rounded-full object-cover"
          width="16"
          height="16"
        />
        <span>{{ props.matchedResearcher.name }}</span>
      </a>
    </template>
    <template v-else>
      <span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-300 dark:bg-neutral-600 text-[9px] font-bold text-neutral-600 dark:text-neutral-300 not-italic leading-none">SE</span>
      <span>{{ props.author }}</span>
    </template>
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
  author: string
  readingTime?: number
  matchedResearcher?: { id: string; name: string; photo: string }
}>()

const { lang, t } = useI18n()

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

const readingTimeLabel = computed(() => {
  if (!props.readingTime) return ''
  return t.value.blog.readingTime.replace('{minutes}', String(props.readingTime))
})
</script>
