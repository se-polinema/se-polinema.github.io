<template>
  <div class="section-container py-16 md:py-24">
    <div class="mb-16">
      <div class="section-label">{{ t.achievements.label }}</div>
      <h1 class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-gray-100 leading-tight mb-4">
        {{ t.achievements.archiveHeading }}
      </h1>
      <p class="text-base text-neutral-500 dark:text-gray-400 max-w-2xl leading-relaxed">
        {{ t.achievements.archiveDescription }}
      </p>
    </div>

    <div class="flex flex-wrap gap-2 mb-10">
      <button
        v-for="typeOption in typeOptions"
        :key="typeOption.value"
        @click="selectedType = typeOption.value"
        class="px-3 py-1.5 text-xs font-mono rounded-sm border transition-colors"
        :class="selectedType === typeOption.value
          ? 'bg-primary text-white border-primary dark:bg-yellow-300 dark:text-primary dark:border-yellow-300'
          : 'bg-transparent text-primary/60 dark:text-gray-400 border-primary/20 dark:border-gray-600 hover:border-primary/40 dark:hover:border-gray-400'"
      >
        {{ typeOption.label }}
      </button>
    </div>

    <div v-if="filteredAchievements.length > 0" class="space-y-12">
      <div v-for="group in groupedAchievements" :key="group.year">
        <div class="flex items-center gap-4 mb-6">
          <h2 class="font-mono text-2xl font-bold text-primary dark:text-gray-100">{{ group.year }}</h2>
          <div class="flex-1 h-px bg-primary/10 dark:bg-gray-700" />
          <span class="text-xs text-primary/40 dark:text-gray-500 font-mono">{{ group.items.length }} {{ group.items.length === 1 ? t.achievements.resultSingle : t.achievements.resultPlural }}</span>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in group.items"
            :key="item.title"
            class="group border-l-2 border-primary/10 dark:border-gray-700 hover:border-accent dark:hover:border-accent-400 transition-colors pl-5 py-3"
          >
            <div class="flex flex-wrap items-center gap-3 mb-2">
              <span
                class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5"
                :class="typeTagStyle(item.type)"
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

            <h3 class="font-serif text-lg font-semibold text-primary dark:text-gray-100 mb-1.5 group-hover:text-primary/80 dark:group-hover:text-gray-300 transition-colors">
              <a
                v-if="item.url"
                :href="item.url"
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

            <p class="text-sm text-neutral-500 dark:text-gray-400 leading-relaxed mb-2">
              {{ lang === 'id' && item.descriptionId ? item.descriptionId : item.description }}
            </p>

            <p v-if="item.issuer" class="text-xs text-primary/40 dark:text-gray-500">
              {{ t.achievements.issuer }}: {{ item.issuer }}
            </p>
            <p v-if="item.members && item.members.length > 0" class="text-xs text-primary/40 dark:text-gray-500 mt-0.5">
              {{ t.achievements.members }}:
              <a
                v-for="(memberId, idx) in item.members"
                :key="memberId"
                :href="`/researchers/${memberId}`"
                class="text-primary/60 dark:text-gray-400 hover:text-primary dark:hover:text-gray-200"
              >
                {{ memberNameMap[memberId] || memberId }}<span v-if="idx < item.members.length - 1">, </span>
              </a>
            </p>
            <p v-else-if="item.members !== undefined && item.members.length === 0" class="text-xs text-primary/40 dark:text-gray-500 mt-0.5">
              {{ t.achievements.labMembers }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-neutral-400 dark:text-gray-500 py-20">
      <p>{{ t.achievements.empty }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import teamData from '../data/team.json'

const props = defineProps<{
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

const selectedType = ref('')

const typeOptions = computed(() => [
  { value: '', label: t.value.achievements.allTypes },
  { value: 'Grant', label: t.value.achievements.typeGrant },
  { value: 'Award', label: t.value.achievements.typeAward },
  { value: 'Certification', label: t.value.achievements.typeCertification },
  { value: 'Milestone', label: t.value.achievements.typeMilestone },
])

const filteredAchievements = computed(() => {
  if (!selectedType.value) return props.achievements
  return props.achievements.filter((a) => a.type === selectedType.value)
})

const groupedAchievements = computed(() => {
  const groups = new Map<string, typeof props.achievements>()
  for (const item of filteredAchievements.value) {
    const year = new Date(item.date).getFullYear().toString()
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year)!.push(item)
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({ year, items }))
})

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat(lang.value === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

function typeTagStyle(type: string): string {
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
