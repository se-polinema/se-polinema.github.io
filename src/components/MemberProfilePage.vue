<template>
  <div class="px-8 py-5 max-w-3xl">
    <div v-if="loading" class="text-center py-12 text-neutral-500 dark:text-gray-400">
      {{ t.memberProfile.loading }}
    </div>

    <div v-else-if="!member" class="text-center py-12 text-neutral-500 dark:text-gray-400">
      {{ t.memberProfile.notFound }}
    </div>

    <template v-else>
      <a
        :href="member.status === 'alumni' ? '/members?filter=alumni' : '/members?filter=students'"
        class="inline-flex items-center gap-1 text-sm font-mono text-primary/50 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors mb-6"
      >
        ← {{ t.memberProfile.backToMembers }}
      </a>

      <div class="flex items-start gap-4 md:gap-6 mb-8">
        <div
          v-if="member.photo"
          class="relative h-28 w-24 md:h-36 md:w-28 shrink-0 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-600 overflow-hidden"
        >
          <img :src="member.photo" :alt="member.name" class="h-full w-full object-cover object-top" loading="lazy" />
        </div>
        <div
          v-else
          class="relative h-28 w-24 md:h-36 md:w-28 shrink-0 bg-primary/5 dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 flex items-center justify-center"
        >
          <span class="font-serif text-3xl text-primary/30 dark:text-gray-500">{{ member.name.charAt(0) }}</span>
        </div>

        <div class="min-w-0 pt-1">
          <span
            class="inline-block mb-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
            :class="member.status === 'alumni' ? 'bg-accent/10 text-accent-700 dark:text-accent-400' : 'bg-primary/10 text-primary dark:text-gray-300'"
          >
            {{ member.status === 'alumni' ? t.membersAdmin.statusAlumni : t.membersAdmin.statusStudent }}
          </span>
          <h1 class="font-serif text-2xl md:text-3xl font-semibold text-primary dark:text-gray-100 leading-snug">
            {{ member.name }}
          </h1>
          <p class="mt-1 text-base text-primary/50 dark:text-gray-400">
            {{ lang === 'id' ? member.role_id : member.role_en }}
          </p>
          <p class="mt-2 text-xs text-primary/40 dark:text-gray-500 font-mono">
            <template v-if="member.status === 'alumni'">
              {{ t.alumni.period }}: {{ member.cohort_year }} – {{ member.exit_year }}
            </template>
            <template v-else>
              {{ t.alumni.sinceLabel }} {{ member.cohort_year }}
            </template>
          </p>
        </div>
      </div>

      <div v-if="hasCurrentInfo" class="mb-8 text-sm text-neutral-600 dark:text-gray-300 space-y-0.5">
        <div>
          <span class="text-xs font-mono uppercase tracking-wide text-primary/40 dark:text-gray-500">{{ t.alumni.now }} </span>
          <span class="font-medium">{{ lang === 'id' ? member.current_role_id : member.current_role_en }}</span>
        </div>
        <div class="text-primary/40 dark:text-gray-500">
          {{ t.alumni.at }} <span class="font-medium text-neutral-600 dark:text-gray-300">{{ lang === 'id' ? member.current_organization_id : member.current_organization_en }}</span>
        </div>
      </div>

      <div v-if="member.streams && member.streams.length" class="mb-8">
        <h2 class="text-xs font-mono uppercase tracking-wider text-primary/40 dark:text-gray-500 mb-2">
          {{ t.memberProfile.streamsLabel }}
        </h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="stream in member.streams"
            :key="stream"
            class="px-2 py-1 text-xs font-mono bg-primary/5 dark:bg-gray-800 text-primary/70 dark:text-gray-300 border border-primary/10 dark:border-gray-700"
          >
            {{ streamName(stream) }}
          </span>
        </div>
      </div>

      <div v-if="member.research_topics" class="mb-8">
        <h2 class="text-xs font-mono uppercase tracking-wider text-primary/40 dark:text-gray-500 mb-2">
          {{ t.memberProfile.researchTopicsLabel }}
        </h2>
        <p class="text-sm text-neutral-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{{ member.research_topics }}</p>
      </div>

      <div v-if="member.career_update" class="mb-8">
        <h2 class="text-xs font-mono uppercase tracking-wider text-primary/40 dark:text-gray-500 mb-2">
          {{ t.memberProfile.careerUpdateLabel }}
        </h2>
        <p class="text-sm text-neutral-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{{ member.career_update }}</p>
      </div>

      <div class="flex items-center gap-4">
        <a
          v-if="member.linkedin_url"
          :href="member.linkedin_url"
          target="_blank"
          rel="noopener"
          class="text-sm font-mono text-primary/50 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors"
        >
          LinkedIn ↗
        </a>
        <a
          v-if="member.profile_url"
          :href="member.profile_url"
          target="_blank"
          rel="noopener"
          class="text-sm font-mono text-primary/50 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors"
        >
          {{ t.alumni.profile }} ↗
        </a>
        <a
          v-if="member.github_url"
          :href="member.github_url"
          target="_blank"
          rel="noopener"
          class="text-sm font-mono text-primary/50 dark:text-gray-400 hover:text-primary dark:hover:text-gray-100 transition-colors"
        >
          GitHub ↗
        </a>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import research from '../data/research.json'

interface MemberRow {
  id: string
  name: string
  photo: string | null
  status: 'student' | 'alumni'
  cohort_year: number
  exit_year: number | null
  role_id: string
  role_en: string
  current_role_id: string | null
  current_role_en: string | null
  current_organization_id: string | null
  current_organization_en: string | null
  linkedin_url: string | null
  profile_url: string | null
  github_url: string | null
  streams: string[] | null
  research_topics: string | null
  career_update: string | null
}

const { lang, t } = useI18n()

const member = ref<MemberRow | null>(null)
const loading = ref(true)

const hasCurrentInfo = computed(() => !!(member.value?.current_role_id || member.value?.current_role_en))

function streamName(id: string): string {
  const stream = research.find((s) => s.id === id)
  if (!stream) return id
  return lang.value === 'id' ? stream.name.id : stream.name.en
}

onMounted(async () => {
  const id = new URLSearchParams(window.location.search).get('id')
  if (!id) {
    loading.value = false
    return
  }

  const { supabase } = await import('../lib/supabase')
  const { data } = await supabase
    .schema('se')
    .from('members')
    .select('*')
    .eq('id', id)
    .single()

  member.value = data ?? null
  loading.value = false
})
</script>
