<template>
  <!-- Title — no class so .editor-body h1::before adds the # prefix -->
  <h1>{{ displayTitle }}</h1>

  <!-- Subtle metadata line, styled like a markdown italic comment -->
  <p class="font-mono text-[11.5px] text-neutral-400 dark:text-gray-500 mt-1 mb-2 italic">
    {{ displayDate }} &middot; <a :href="`/blog/category/${category}`" class="text-neutral-400 dark:text-gray-500 hover:text-primary dark:hover:text-gray-300 transition-colors no-underline hover:underline">{{ category }}</a> &middot; {{ readingTimeLabel }}
  </p>
  <p class="flex items-center gap-1.5 font-mono text-[11.5px] text-neutral-400 dark:text-gray-500 italic mb-3">
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
  <p v-if="displayTags.length > 0" class="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-neutral-400 dark:text-gray-500 mb-6">
    <span>{{ t.blog.tags }}:</span>
    <a
      v-for="tag in displayTags"
      :key="tag.slug"
      :href="`/blog/tags/${tag.slug}`"
      class="inline-block px-2 py-0.5 rounded border border-neutral-200 dark:border-gray-600 text-neutral-500 dark:text-gray-400 hover:text-primary dark:hover:text-gray-200 hover:border-primary/30 dark:hover:border-gray-400 transition-colors no-underline"
    >{{ tag.label }}</a>
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
  tags?: string[]
  tagsId?: string[]
}>()

const { lang, t } = useI18n()

const displayTitle = computed(() =>
  lang.value === 'id' && props.titleId ? props.titleId : props.title
)

const displayTags = computed(() => {
  const en = props.tags ?? []
  const id = props.tagsId ?? []
  const max = Math.max(en.length, id.length)
  const result: { label: string; slug: string }[] = []
  for (let i = 0; i < max; i++) {
    const label = (lang.value === 'id' && id[i]) ? id[i] : (en[i] ?? '')
    const slug = slugify(en[i] ?? id[i] ?? '')
    if (slug) result.push({ label, slug })
  }
  return result
})

function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

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
