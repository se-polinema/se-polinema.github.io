<template>
  <div class="px-8 py-5 max-w-3xl">
    <div v-if="loading" class="text-center py-12 text-neutral-500 dark:text-gray-400">
      {{ t.showcase.loading }}
    </div>

    <div v-else-if="!project" class="text-center py-12 text-neutral-500 dark:text-gray-400">
      {{ t.showcaseDetail.notFound }}
    </div>

    <template v-else>
      <a
        href="/showcase"
        class="inline-flex items-center gap-1 text-sm font-mono text-primary/50 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors mb-6"
      >
        ← {{ t.showcaseDetail.back }}
      </a>

      <div
        v-if="project.image"
        class="relative w-full h-56 md:h-72 mb-6 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-600 overflow-hidden"
      >
        <img :src="project.image" :alt="project.title" class="h-full w-full object-cover" loading="lazy" />
      </div>

      <h1 class="font-serif text-2xl md:text-3xl font-semibold text-primary dark:text-gray-100 leading-snug">
        {{ project.title }}
      </h1>
      <p v-if="tagline" class="mt-1 text-base text-primary/50 dark:text-gray-400">
        {{ tagline }}
      </p>

      <p v-if="description" class="mt-6 text-sm text-neutral-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {{ description }}
      </p>

      <div v-if="project.tags && project.tags.length" class="mt-6">
        <h2 class="text-xs font-mono uppercase tracking-wider text-primary/40 dark:text-gray-500 mb-2">
          {{ t.showcaseDetail.tagsLabel }}
        </h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="px-2 py-1 text-xs font-mono bg-primary/5 dark:bg-gray-800 text-primary/70 dark:text-gray-300 border border-primary/10 dark:border-gray-700"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-4 mt-8">
        <a
          v-if="project.repo_url"
          :href="project.repo_url"
          target="_blank"
          rel="noopener"
          class="text-sm font-mono text-primary/50 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors"
        >
          {{ t.showcaseDetail.repoLabel }} ↗
        </a>
        <a
          v-if="project.demo_url"
          :href="project.demo_url"
          target="_blank"
          rel="noopener"
          class="text-sm font-mono text-primary/50 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors"
        >
          {{ t.showcaseDetail.demoLabel }} ↗
        </a>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'

interface ProjectRow {
  id: string
  title: string
  tagline_en: string | null
  tagline_id: string | null
  description_en: string | null
  description_id: string | null
  tags: string[] | null
  repo_url: string | null
  demo_url: string | null
  image: string | null
}

const { lang, t } = useI18n()

const project = ref<ProjectRow | null>(null)
const loading = ref(true)

const tagline = computed(() => {
  if (!project.value) return ''
  return (lang.value === 'id' ? project.value.tagline_id : project.value.tagline_en) || ''
})

const description = computed(() => {
  if (!project.value) return ''
  return (lang.value === 'id' ? project.value.description_id : project.value.description_en) || ''
})

onMounted(async () => {
  const id = new URLSearchParams(window.location.search).get('id')
  if (!id) {
    loading.value = false
    return
  }

  const { supabase } = await import('../lib/supabase')
  const { data } = await supabase
    .schema('se')
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('approved', true)
    .single()

  project.value = data ?? null
  loading.value = false
})
</script>
