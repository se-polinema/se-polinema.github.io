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
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <select
        v-if="members.length > 0"
        v-model="selectedMember"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.projects.allMembers }}</option>
        <option v-for="m in members" :key="m.id" :value="m.id">{{ m.name }}</option>
      </select>
      <select
        v-if="streams.length > 0"
        v-model="selectedStream"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.projects.allStreams }}</option>
        <option v-for="s in streams" :key="s.id" :value="s.id">
          {{ lang === 'id' ? s.nameId : s.nameEn }}
        </option>
      </select>
      <select
        v-model="selectedStatus"
        class="text-sm border border-primary/15 dark:border-gray-600 text-primary dark:text-gray-100 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-none focus:outline-none focus:border-primary/40"
      >
        <option value="">{{ t.projects.allStatuses }}</option>
        <option value="active">{{ t.projects.statusActive }}</option>
        <option value="completed">{{ t.projects.statusCompleted }}</option>
        <option value="prototype">{{ t.projects.statusPrototype }}</option>
        <option value="under-development">{{ t.projects.statusUnderDevelopment }}</option>
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
          :key="project.repo + (project.slug ?? '')"
          class="border border-primary/10 dark:border-gray-600 bg-white dark:bg-gray-800 flex flex-col hover:border-primary/20 dark:hover:border-gray-500 transition-colors overflow-hidden rounded-lg"
        >
          <!-- Thumbnail / Placeholder -->
          <a
            :href="project.slug ? `/projects/${project.slug}` : `https://github.com/${project.repo}`"
            :target="project.slug ? undefined : '_blank'"
            :rel="project.slug ? undefined : 'noopener'"
            class="block aspect-video bg-neutral-100 dark:bg-gray-800 overflow-hidden border-b border-primary/5 dark:border-gray-700"
          >
            <img
              v-if="projectImage(project)"
              :src="projectImage(project)"
              :alt="lang === 'id' && project.nameId ? project.nameId : (project.name ?? project.repo)"
              class="w-full h-full object-cover"
              loading="lazy"
              @error="onImageError"
            />
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-neutral-300 dark:text-gray-600 gap-1.5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.4">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span class="text-[10px] font-mono">{{ t.projects.noScreenshot }}</span>
            </div>
          </a>

          <div class="p-5 flex flex-col gap-3 flex-1">
            <div class="flex items-start justify-between gap-2">
              <a
                :href="project.slug ? `/projects/${project.slug}` : `https://github.com/${project.repo}`"
                :target="project.slug ? undefined : '_blank'"
                :rel="project.slug ? undefined : 'noopener'"
                class="font-mono text-[13px] text-primary dark:text-blue-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors break-all leading-snug"
              >{{ lang === 'id' && project.nameId ? project.nameId : (project.name ?? project.repo) }}</a>
              <span
                v-if="project.status"
                class="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded border"
                :class="statusBadgeClass(project.status)"
              >{{ statusLabel(project.status) }}</span>
            </div>
            <p v-if="project.description || project.descriptionId" class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed flex-1">
              {{ lang === 'id' && project.descriptionId ? project.descriptionId : project.description }}
            </p>
            <div v-if="project.techStack && project.techStack.length > 0" class="flex flex-wrap gap-1">
              <span
                v-for="tech in project.techStack.slice(0, 4)"
                :key="tech"
                class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-gray-700 text-neutral-500 dark:text-gray-400"
              >{{ tech }}</span>
              <span v-if="project.techStack.length > 4" class="text-[10px] font-mono text-neutral-400">+{{ project.techStack.length - 4 }}</span>
            </div>
            <div class="flex items-center gap-1.5 mt-auto pt-1 border-t border-primary/5 dark:border-gray-600">
              <span class="text-[12px] text-neutral-400 dark:text-gray-500">{{ t.projects.by }}</span>
              <a
                :href="`/researchers/${project.researcherId}`"
                class="text-[12px] text-primary/70 dark:text-gray-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors"
              >{{ project.researcherName }}</a>
              <template v-if="project.slug">
                <span class="text-[12px] text-neutral-300 dark:text-gray-600">|</span>
                <a
                  :href="`https://github.com/${project.repo}`"
                  target="_blank"
                  rel="noopener"
                  class="text-[12px] text-neutral-400 dark:text-gray-500 hover:text-accent-700 dark:hover:text-accent-400 transition-colors font-mono"
                >GitHub</a>
              </template>
            </div>
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
  slug?: string
  status?: string
  stream?: string
  techStack?: string[]
  images?: string[]
  demoUrl?: string
}

interface StreamOption {
  id: string
  nameEn: string
  nameId: string
}

const props = defineProps<{
  projects: MemberProject[]
  members: { id: string; name: string }[]
  streams?: StreamOption[]
}>()

const { lang, t } = useI18n()
const selectedMember = ref('')
const selectedStream = ref('')
const selectedStatus = ref('')

const filtered = computed(() => {
  let result = props.projects
  if (selectedMember.value) {
    result = result.filter((p) => p.researcherId === selectedMember.value)
  }
  if (selectedStream.value) {
    result = result.filter((p) => p.stream === selectedStream.value)
  }
  if (selectedStatus.value) {
    result = result.filter((p) => p.status === selectedStatus.value)
  }
  return result
})

function projectImage(project: MemberProject): string | undefined {
  if (project.images && project.images.length > 0) return project.images[0]
  if (project.demoUrl) return `https://image.thum.io/get/maxAge/12/width/400/crop/300/${encodeURIComponent(project.demoUrl)}`
  return undefined
}

function onImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

function statusBadgeClass(status: string) {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    prototype: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    'under-development': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  }
  return map[status] ?? ''
}

function statusLabel(status: string) {
  const labels: Record<string, { en: string; id: string }> = {
    active: { en: 'Active', id: 'Aktif' },
    completed: { en: 'Completed', id: 'Selesai' },
    prototype: { en: 'Prototype', id: 'Prototipe' },
    'under-development': { en: 'Under Development', id: 'Dalam Pengembangan' },
  }
  const entry = labels[status]
  return entry ? (lang.value === 'id' ? entry.id : entry.en) : status
}
</script>
