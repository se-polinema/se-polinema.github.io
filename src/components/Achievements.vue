<template>
  <section id="achievements" class="py-20 md:py-32 bg-white dark:bg-gray-900">
    <div class="section-container">
      <div class="flex items-end justify-between mb-16">
        <div class="relative overflow-hidden">
          <span class="absolute -top-4 right-0 font-mono text-[8rem] font-bold text-primary/[0.04] leading-none select-none pointer-events-none" aria-hidden="true">05</span>
          <div class="section-label">{{ t.achievements.label }}</div>
          <h2 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-gray-100 leading-tight">
            {{ t.achievements.heading }}
          </h2>
        </div>
        <a
          v-if="achievements.length > 0"
          :href="withBase('/achievements')"
          class="inline-flex items-center gap-2 text-sm text-primary/60 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors"
        >
          {{ t.achievements.viewAll }}
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div v-if="achievements.length > 0" class="space-y-4">
        <div
          v-for="item in achievements"
          :key="item.title"
          class="group flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 p-5 bg-neutral-50 dark:bg-gray-800 border border-neutral-100 dark:border-gray-700 hover:border-primary/10 dark:hover:border-gray-600 transition-colors"
        >
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <span
              class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 shrink-0"
              :class="typeStyle(item.type)"
            >
              {{ typeLabel(item.type) }}
            </span>
            <time
              :datetime="item.date"
              class="text-xs text-neutral-400 dark:text-gray-500"
            >
              {{ formatDate(item.date) }}
            </time>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-serif text-base font-semibold text-primary dark:text-gray-100 mb-1 group-hover:text-primary/80 dark:group-hover:text-gray-300 transition-colors">
              <a
                v-if="item.url"
                :href="withBase(item.url)"
                target="_blank"
                rel="noopener"
                class="hover:underline decoration-primary/20 underline-offset-4"
              >
                {{ lang === 'id' && item.titleId ? item.titleId : item.title }}
              </a>
              <span v-else>
                {{ lang === 'id' && item.titleId ? item.titleId : item.title }}
              </span>
            </h3>
            <p class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed">
              {{ lang === 'id' && item.descriptionId ? item.descriptionId : item.description }}
            </p>
            <p v-if="item.issuer" class="text-xs text-primary/40 dark:text-gray-500 mt-1">
              {{ t.achievements.issuer }}: {{ item.issuer }}
            </p>
            <p v-if="item.members && item.members.length > 0" class="text-xs text-primary/40 dark:text-gray-500 mt-1">
              {{ t.achievements.members }}:
              <a
                v-for="(memberId, idx) in item.members"
                :key="memberId"
                :href="withBase(`/researchers/${memberId}`)"
                class="text-primary/60 dark:text-gray-400 hover:text-primary dark:hover:text-gray-200"
              >
                {{ memberNameMap[memberId] || memberId }}<span v-if="idx < item.members.length - 1">, </span>
              </a>
            </p>
            <p v-else-if="item.members !== undefined && item.members.length === 0" class="text-xs text-primary/40 dark:text-gray-500 mt-1">
              {{ t.achievements.labMembers }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-neutral-400 dark:text-gray-500 py-16">
        <p>{{ t.achievements.empty }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import { withBase } from '../lib/paths'
import teamData from '../data/team.json'

defineProps<{
  achievements: Array<{
    title: string
    titleId?: string
    date: string
    type: string
    description?: string
    descriptionId?: string
    url?: string
    issuer?: string
    members?: string[]
  }>
}>()

const { lang, t } = useI18n()

const memberNameMap = computed(() => {
  const map: Record<string, string> = {}
  for (const member of teamData) {
    map[member.id] = member.name
  }
  return map
})

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat(lang.value === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

function typeStyle(type: string): string {
  const styles: Record<string, string> = {
    Grant: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Award: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Certification: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Milestone: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  }
  return styles[type] || 'bg-neutral-100 text-neutral-500 dark:bg-gray-700 dark:text-gray-300'
}

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    Grant: t.value.achievements.typeGrant,
    Award: t.value.achievements.typeAward,
    Certification: t.value.achievements.typeCertification,
    Milestone: t.value.achievements.typeMilestone,
  }
  return map[type] ?? type
}
</script>
