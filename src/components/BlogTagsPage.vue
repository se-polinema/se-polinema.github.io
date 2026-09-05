<template>
  <div class="px-8 py-5">
    <h1>{{ heading }}</h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm mt-1 mb-8">{{ description }}</p>

    <div v-if="tags.length === 0" class="text-center py-20">
      <p class="text-neutral-400 dark:text-gray-500">{{ t.blog.noTags }}</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
      <a
        v-for="tag in tags"
        :key="tag.slug"
        :href="withBase(`/blog/tags/${tag.slug}`)"
        class="group flex flex-col items-center justify-center p-4 rounded-lg border border-neutral-200 dark:border-gray-700 hover:border-primary/40 dark:hover:border-gray-500 hover:bg-neutral-50 dark:hover:bg-gray-800/50 transition-colors no-underline"
      >
        <span class="text-sm font-mono font-semibold text-primary dark:text-gray-100 group-hover:text-primary/80 group-hover:underline">{{ lang === 'id' && tag.id ? tag.id : tag.en }}</span>
        <span class="text-xs text-neutral-400 dark:text-gray-500 mt-1">{{ postCountLabel(tag.count) }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'

const props = defineProps<{
  tags: Array<{ slug: string; en: string; id: string; count: number }>
}>()

const { lang, t } = useI18n()

const heading = computed(() => t.value.blog.tagsHeading)
const description = computed(() => t.value.blog.tagsDescription)

function postCountLabel(count: number): string {
  return t.value.blog.tagPostCount.replace('{count}', String(count))
}
</script>
