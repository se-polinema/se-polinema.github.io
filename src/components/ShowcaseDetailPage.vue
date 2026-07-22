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

      <!-- Gallery: single image, prev/next when multiple, initial-letter placeholder when none -->
      <div
        v-if="project.images && project.images.length"
        class="relative w-full h-56 md:h-72 mb-6 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-600 overflow-hidden"
      >
        <img :src="project.images[galleryIndex]" :alt="project.title" class="h-full w-full object-cover" loading="lazy" />
        <template v-if="project.images.length > 1">
          <button
            type="button"
            @click="galleryIndex = (galleryIndex - 1 + project.images.length) % project.images.length"
            :aria-label="t.showcaseDetail.prevImage"
            class="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 text-primary dark:text-gray-100 hover:bg-white dark:hover:bg-gray-900 transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            @click="galleryIndex = (galleryIndex + 1) % project.images.length"
            :aria-label="t.showcaseDetail.nextImage"
            class="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 text-primary dark:text-gray-100 hover:bg-white dark:hover:bg-gray-900 transition-colors"
          >
            ›
          </button>
          <span class="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-mono bg-black/60 text-white">
            {{ galleryIndex + 1 }} / {{ project.images.length }}
          </span>
        </template>
      </div>
      <div
        v-else
        class="relative w-full h-56 md:h-72 mb-6 bg-primary/5 dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 flex items-center justify-center"
      >
        <span class="font-serif text-3xl text-primary/30 dark:text-gray-500">{{ project.title.charAt(0) }}</span>
      </div>

      <div class="flex items-center gap-2">
        <h1 class="font-serif text-2xl md:text-3xl font-semibold text-primary dark:text-gray-100 leading-snug">
          {{ project.title }}
        </h1>
        <span
          v-if="project.featured"
          class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-accent text-white"
        >
          {{ t.showcase.featuredBadge }}
        </span>
      </div>
      <p v-if="tagline" class="mt-1 text-base text-primary/50 dark:text-gray-400">
        {{ tagline }}
      </p>
      <span
        v-if="project.status"
        class="inline-block mt-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-primary/10 text-primary dark:text-gray-300"
      >
        {{ statusLabel }}
      </span>

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

      <div v-if="project.stream" class="mt-6">
        <h2 class="text-xs font-mono uppercase tracking-wider text-primary/40 dark:text-gray-500 mb-2">
          {{ t.showcaseDetail.streamLabel }}
        </h2>
        <a :href="`/research/${project.stream}`" class="text-sm text-accent hover:text-accent/80 transition-colors">
          {{ streamName }}
        </a>
      </div>

      <div v-if="resolvedResearchers.length" class="mt-6">
        <h2 class="text-xs font-mono uppercase tracking-wider text-primary/40 dark:text-gray-500 mb-2">
          {{ t.showcaseDetail.researchersLabel }}
        </h2>
        <div class="flex flex-wrap gap-3">
          <a
            v-for="r in resolvedResearchers"
            :key="r.id"
            :href="`/researchers/${r.id}`"
            class="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            {{ r.name }}
          </a>
        </div>
      </div>

      <div v-if="project.contributors && project.contributors.length" class="mt-6">
        <h2 class="text-xs font-mono uppercase tracking-wider text-primary/40 dark:text-gray-500 mb-2">
          {{ t.showcaseDetail.contributorsLabel }}
        </h2>
        <p class="text-sm text-neutral-600 dark:text-gray-300">{{ project.contributors.join(', ') }}</p>
      </div>

      <div v-if="project.video_url" class="mt-6">
        <h2 class="text-xs font-mono uppercase tracking-wider text-primary/40 dark:text-gray-500 mb-2">
          {{ t.showcaseDetail.videoLabel }}
        </h2>
        <div class="relative w-full aspect-video bg-black">
          <iframe :src="project.video_url" class="absolute inset-0 h-full w-full" allowfullscreen loading="lazy" />
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
          {{ project.private ? t.showcaseDetail.privateRepo : t.showcaseDetail.repoLabel }} ↗
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
import research from '../data/research.json'

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
  images: string[] | null
  status: string | null
  stream: string | null
  researchers: string[] | null
  contributors: string[] | null
  featured: boolean
  private: boolean
  video_url: string | null
}

const { lang, t } = useI18n()

const project = ref<ProjectRow | null>(null)
const loading = ref(true)
const galleryIndex = ref(0)
const researcherOptions = ref<{ id: string; name: string }[]>([])

const tagline = computed(() => {
  if (!project.value) return ''
  return (lang.value === 'id' ? project.value.tagline_id : project.value.tagline_en) || ''
})

const description = computed(() => {
  if (!project.value) return ''
  return (lang.value === 'id' ? project.value.description_id : project.value.description_en) || ''
})

const STATUS_LABEL_KEYS: Record<string, 'statusActive' | 'statusCompleted' | 'statusPrototype' | 'statusUnderDevelopment'> = {
  active: 'statusActive',
  completed: 'statusCompleted',
  prototype: 'statusPrototype',
  'under-development': 'statusUnderDevelopment',
}

const statusLabel = computed(() => {
  const key = project.value?.status ? STATUS_LABEL_KEYS[project.value.status] : undefined
  return key ? t.value.showcaseDetail[key] : ''
})

const streamName = computed(() => {
  const stream = research.find((s) => s.id === project.value?.stream)
  if (!stream) return project.value?.stream ?? ''
  return lang.value === 'id' ? stream.name.id : stream.name.en
})

// Resolve researcher slug ids to display names — same client-side
// resolution already used by Sidebar.vue, avoids denormalizing names
// into the DB (researchers live in the content collection, not a table).
const resolvedResearchers = computed(() => {
  const ids = project.value?.researchers ?? []
  return ids
    .map((id) => researcherOptions.value.find((r) => r.id === id))
    .filter((r): r is { id: string; name: string } => !!r)
})

onMounted(async () => {
  fetch('/api/researchers.json')
    .then((r) => r.json())
    .then((data) => { researcherOptions.value = data })
    .catch(() => { researcherOptions.value = [] })

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
