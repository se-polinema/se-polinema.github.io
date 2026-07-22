<template>
  <div class="px-8 py-5">
    <h1>{{ t.showcase.heading }}</h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm mt-1 mb-4">{{ t.showcase.description }}</p>

    <div class="mb-8">
      <a
        href="/showcase/submit"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 transition-colors"
      >
        {{ t.showcase.addCta }}
      </a>
    </div>

    <div v-if="loading" class="text-center py-12 text-neutral-500 dark:text-gray-400">
      {{ t.showcase.loading }}
    </div>

    <template v-else>
      <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        <article
          v-for="p in projects"
          :key="p.id"
          class="group border border-primary/10 dark:border-gray-600 bg-neutral-50 dark:bg-gray-800 p-5 md:p-6 hover:border-primary/25 dark:hover:border-gray-500 transition-colors"
        >
          <a :href="`/showcase/detail?id=${p.id}`" class="block no-underline">
            <div
              v-if="p.image"
              class="relative h-36 w-full mb-4 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-600 overflow-hidden"
            >
              <img :src="p.image" :alt="p.title" class="h-full w-full object-cover" loading="lazy" />
            </div>
            <div
              v-else
              class="relative h-36 w-full mb-4 bg-primary/5 dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 flex items-center justify-center"
            >
              <span class="font-serif text-xl text-primary/30 dark:text-gray-500">{{ p.title.charAt(0) }}</span>
            </div>

            <h3 class="font-serif text-lg font-semibold text-primary dark:text-gray-100 leading-snug group-hover:text-accent-700 dark:group-hover:text-accent-400 transition-colors mb-1">
              {{ p.title }}
            </h3>
            <p v-if="tagline(p)" class="text-sm text-neutral-600 dark:text-gray-300 mb-3">
              {{ tagline(p) }}
            </p>
          </a>

          <div v-if="p.tags && p.tags.length" class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in p.tags"
              :key="tag"
              class="px-2 py-0.5 text-[10px] font-mono bg-primary/5 dark:bg-gray-700 text-primary/70 dark:text-gray-300 border border-primary/10 dark:border-gray-600"
            >
              {{ tag }}
            </span>
          </div>
        </article>
      </div>

      <div v-if="projects.length === 0" class="text-center py-12 text-neutral-500 dark:text-gray-400">
        {{ t.showcase.empty }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'

interface ProjectRow {
  id: string
  title: string
  tagline_en: string | null
  tagline_id: string | null
  tags: string[] | null
  image: string | null
}

const { lang, t } = useI18n()

const projects = ref<ProjectRow[]>([])
const loading = ref(true)

function tagline(p: ProjectRow): string {
  return (lang.value === 'id' ? p.tagline_id : p.tagline_en) || ''
}

onMounted(async () => {
  const { supabase } = await import('../lib/supabase')
  const { data } = await supabase
    .schema('se')
    .from('projects')
    .select('id, title, tagline_en, tagline_id, tags, image')
    .eq('approved', true)
    .order('created_at', { ascending: false })

  projects.value = data ?? []
  loading.value = false
})
</script>
