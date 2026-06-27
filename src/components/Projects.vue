<template>
  <section id="projects" class="py-20 md:py-32 bg-neutral-50 dark:bg-gray-800">
    <div class="section-container">
      <div class="flex items-end justify-between mb-3">
        <div class="section-label">{{ t.projects.label }}</div>
        <a
          v-if="projects.length > 0"
          href="/projects"
          class="text-[13px] font-mono text-primary/60 dark:text-gray-400 hover:text-accent dark:hover:text-yellow-300 transition-colors hidden sm:block"
        >{{ t.projects.viewAll }} →</a>
      </div>
      <div class="flex items-end justify-between mb-16">
        <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-gray-100 leading-tight">
          {{ t.projects.heading }}
        </h2>
      </div>

      <!-- Carousel -->
      <template v-if="projects.length > 0">
        <CardCarousel>
          <div
            v-for="project in projects"
            :key="project.repo"
            class="flex-shrink-0 w-80 snap-start border border-primary/10 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 flex flex-col gap-3 hover:border-primary/20 dark:hover:border-gray-500 transition-colors"
          >
            <a
              :href="`https://github.com/${project.repo}`"
              target="_blank"
              rel="noopener"
              class="font-mono text-[13px] text-primary dark:text-blue-300 hover:text-accent dark:hover:text-yellow-300 transition-colors break-all leading-snug"
            >{{ lang === 'id' && project.nameId ? project.nameId : (project.name ?? project.repo) }}</a>
            <p v-if="project.description || project.descriptionId" class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed flex-1">
              {{ lang === 'id' && project.descriptionId ? project.descriptionId : project.description }}
            </p>
            <div class="flex items-center gap-1.5 mt-auto pt-1 border-t border-primary/5 dark:border-gray-600">
              <span class="text-[12px] text-neutral-400 dark:text-gray-500">{{ t.projects.by }}</span>
              <a
                :href="`/researchers/${project.researcherId}`"
                class="text-[12px] text-primary/70 dark:text-gray-300 hover:text-accent dark:hover:text-yellow-300 transition-colors"
              >{{ project.researcherName }}</a>
            </div>
          </div>
        </CardCarousel>
        <div class="mt-6 sm:hidden">
          <a href="/projects" class="text-[13px] font-mono text-primary/60 dark:text-gray-400 hover:text-accent dark:hover:text-yellow-300 transition-colors">{{ t.projects.viewAll }} →</a>
        </div>
      </template>

      <!-- Empty state -->
      <template v-else>
        <div class="text-center py-20 border border-dashed border-primary/10 dark:border-gray-600">
          <div class="font-mono text-5xl text-primary/10 mb-4 select-none">&#123;&nbsp;&#125;</div>
          <p class="text-neutral-400 dark:text-gray-500 text-sm max-w-sm mx-auto">{{ t.projects.empty }}</p>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import CardCarousel from './CardCarousel.vue'
import { useI18n } from '../composables/useI18n'

export interface MemberProject {
  name?: string
  nameId?: string
  repo: string
  description?: string
  descriptionId?: string
  researcherId: string
  researcherName: string
}

defineProps<{ projects: MemberProject[] }>()

const { lang, t } = useI18n()
</script>
