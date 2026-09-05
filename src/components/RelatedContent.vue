<template>
  <section v-if="displayItems.length > 0" class="mt-12 pt-8 border-t border-neutral-200 dark:border-gray-700">
    <h2 class="font-serif text-xl font-bold text-primary dark:text-gray-100 mb-4">{{ heading }}</h2>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <a
        v-for="item in displayItems"
        :key="item.id"
        :href="withBase(item.url)"
        class="block p-4 rounded-lg border border-neutral-200 dark:border-gray-700 bg-neutral-50/50 dark:bg-gray-800/50 hover:bg-neutral-100 dark:hover:bg-gray-700/70 hover:border-primary/30 dark:hover:border-primary/40 transition-colors group"
      >
        <div class="flex items-start gap-1.5 mb-1.5">
          <span
            v-if="item.badge"
            :class="item.badgeClass ?? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/80'"
            class="inline-block px-2 py-0.5 text-[10px] font-mono font-medium rounded-full"
          >
            {{ item.badge }}
          </span>
        </div>
        <h3 class="font-semibold text-sm text-neutral-800 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-primary/90 transition-colors line-clamp-2">
          {{ displayTitle(item) }}
        </h3>
        <p v-if="item.description" class="mt-1 text-xs text-neutral-500 dark:text-gray-400 line-clamp-2">
          {{ displayDescription(item) }}
        </p>
        <div v-if="item.meta" class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-neutral-400 dark:text-gray-500 font-mono">
          <span v-if="item.metaYear">{{ item.metaYear }}</span>
          <span v-if="item.metaVenue" aria-hidden="true">·</span>
          <span v-if="item.metaVenue" class="truncate">{{ item.metaVenue }}</span>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'

export interface RelatedContentItem {
  id: string
  title: string
  titleId?: string
  description?: string
  descriptionId?: string
  url: string
  badge?: string
  badgeClass?: string
  metaYear?: number | string
  metaVenue?: string
  __source: 'blog' | 'publication' | 'project' | 'researcher' | 'resource'
}

const props = defineProps<{
  items: RelatedContentItem[]
  context: 'blog' | 'publication'
}>()

const { lang, t } = useI18n()

const heading = computed(() =>
  props.context === 'blog' ? t.value.blog.relatedHeading : t.value.publications.relatedHeading
)

const displayItems = computed(() => props.items.slice(0, 5))

function displayTitle(item: RelatedContentItem): string {
  return lang.value === 'id' && item.titleId ? item.titleId : item.title
}

function displayDescription(item: RelatedContentItem): string {
  if (lang.value === 'id' && item.descriptionId) return item.descriptionId
  return item.description ?? ''
}
</script>
