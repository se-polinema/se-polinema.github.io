<template>
  <div class="px-8 py-5">
    <!-- Heading -->
    <div class="section-label mb-2">{{ t.projects.label }}</div>
    <h1 class="font-serif text-2xl md:text-3xl font-bold text-primary dark:text-gray-100 leading-tight mb-2">
      {{ t.projects.archiveHeading }}
    </h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl mb-8">
      {{ t.projects.archiveDescription }}
    </p>

    <!-- Filter bar -->
    <div class="flex items-center gap-4 mb-6">
      <select
        v-model="selectedMember"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.projects.allMembers }}</option>
        <option v-for="m in members" :key="m.id" :value="m.id">{{ m.name }}</option>
      </select>
    </div>

    <!-- Result count -->
    <div class="mb-6 text-sm text-neutral-500 dark:text-gray-400">
      {{ filtered.length }}
      {{ filtered.length === 1 ? t.projects.resultSingle : t.projects.resultPlural }}
    </div>

    <!-- Grid -->
    <template v-if="filtered.length > 0">
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <li
          v-for="project in filtered"
          :key="project.repo"
          class="border border-primary/10 dark:border-gray-600 bg-white dark:bg-gray-800 p-5 flex flex-col gap-3 hover:border-primary/20 dark:hover:border-gray-500 transition-colors"
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
        </li>
      </ul>
    </template>

    <!-- Empty state -->
    <template v-else>
      <div class="text-center py-20 border border-dashed border-primary/10 dark:border-gray-600">
        <div class="font-mono text-5xl text-primary/10 dark:text-gray-600 mb-4 select-none">&#123;&nbsp;&#125;</div>
        <p class="text-neutral-400 dark:text-gray-500 text-sm max-w-sm mx-auto">{{ t.projects.empty }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'

interface MemberProject {
  name?: string
  nameId?: string
  repo: string
  description?: string
  descriptionId?: string
  researcherId: string
  researcherName: string
}

const props = defineProps<{
  projects: MemberProject[]
  members: { id: string; name: string }[]
}>()

const { lang, t } = useI18n()
const selectedMember = ref('')

const filtered = computed(() =>
  selectedMember.value
    ? props.projects.filter((p) => p.researcherId === selectedMember.value)
    : props.projects,
)
</script>
