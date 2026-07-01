<template>
  <div class="px-8 py-5">
    <h1>{{ t.alumni.heading }}</h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm mt-1 mb-8">{{ t.alumni.description }}</p>

    <div v-for="cohort in groupedByCohort" :key="cohort.year">
      <h2 class="font-mono text-sm uppercase tracking-wider text-primary/50 dark:text-gray-400 mt-8 mb-4 border-b border-primary/10 dark:border-gray-600 pb-2">
        {{ t.alumni.cohortLabel }} {{ cohort.year }}
      </h2>

      <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        <article
          v-for="alum in cohort.members"
          :key="alum.id"
          class="group border border-primary/10 dark:border-gray-600 bg-neutral-50 dark:bg-gray-800 p-5 md:p-6 hover:border-primary/25 dark:hover:border-gray-500 transition-colors"
        >
          <div class="flex items-start gap-3 md:gap-4 mb-5">
            <div
              v-if="alum.photo"
              class="relative h-20 w-16 md:h-24 md:w-[4.5rem] shrink-0 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-600 overflow-hidden"
            >
              <img
                :src="alum.photo"
                :alt="alum.name"
                class="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <div
              v-else
              class="relative h-20 w-16 md:h-24 md:w-[4.5rem] shrink-0 bg-primary/5 dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 flex items-center justify-center"
            >
              <span class="font-serif text-xl text-primary/30 dark:text-gray-500">{{ alum.name.charAt(0) }}</span>
            </div>
            <div class="min-w-0">
              <h3 class="font-serif text-lg md:text-xl font-semibold text-primary dark:text-gray-100 leading-snug">
                {{ alum.name }}
              </h3>
              <p class="mt-1 text-sm text-primary/50 dark:text-gray-400">
                {{ lang === 'id' ? alum.role.id : alum.role.en }}
              </p>
            </div>
          </div>

          <div class="space-y-2 text-sm text-neutral-600 dark:text-gray-300">
            <div>
              <span class="text-xs font-mono uppercase tracking-wide text-primary/40 dark:text-gray-500">{{ t.alumni.now }} </span>
              <span class="font-medium">{{ lang === 'id' ? alum.currentRole.id : alum.currentRole.en }}</span>
              <span class="text-primary/40 dark:text-gray-500"> {{ t.alumni.at }} </span>
              <span class="font-medium">{{ lang === 'id' ? alum.currentOrganization.id : alum.currentOrganization.en }}</span>
            </div>
            <div class="text-xs text-primary/40 dark:text-gray-500 font-mono">
              {{ t.alumni.period }}: {{ alum.cohortYear }} – {{ alum.exitYear }}
            </div>
          </div>

          <div class="flex items-center gap-4 mt-5">
            <a
              v-if="alum.linkedinUrl"
              :href="alum.linkedinUrl"
              target="_blank"
              rel="noopener"
              class="text-sm font-mono text-primary/50 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors"
            >
              LinkedIn ↗
            </a>
            <a
              v-if="alum.profileUrl"
              :href="alum.profileUrl"
              target="_blank"
              rel="noopener"
              class="text-sm font-mono text-primary/50 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors"
            >
              {{ t.alumni.profile }} ↗
            </a>
          </div>
        </article>
      </div>
    </div>

    <div v-if="alumni.length === 0" class="text-center py-12 text-neutral-500 dark:text-gray-400">
      {{ t.alumni.empty }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const props = defineProps<{
  alumni: Array<{
    id: string
    name: string
    photo?: string
    cohortYear: number
    exitYear: number
    role: { id: string; en: string }
    currentRole: { id: string; en: string }
    currentOrganization: { id: string; en: string }
    linkedinUrl?: string
    profileUrl?: string
    streams?: string[]
  }>
}>()

const { lang, t } = useI18n()

const groupedByCohort = computed(() => {
  const groups = new Map<number, typeof props.alumni>()
  for (const alum of props.alumni) {
    const year = alum.cohortYear
    if (!groups.has(year)) {
      groups.set(year, [])
    }
    groups.get(year)!.push(alum)
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, members]) => ({ year, members }))
})
</script>
