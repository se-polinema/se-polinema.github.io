<template>
  <div class="px-8 py-5">
    <h1>{{ heading }}</h1>
    <p class="text-neutral-500 dark:text-gray-400 text-sm mt-1 mb-4">{{ description }}</p>

    <!-- Self-registration only exists for current students. Alumni are
         graduated members, not a separate signup (see
         20260722023755_member_graduation.sql). -->
    <div v-if="props.status === 'student'" class="mb-8">
      <a
        href="/members/submit"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 transition-colors"
      >
        {{ t.memberSubmit.addCta }}
      </a>
    </div>

    <div v-if="loading" class="text-center py-12 text-neutral-500 dark:text-gray-400">
      {{ t.events.admin.loading }}
    </div>

    <template v-else>
      <div v-for="cohort in groupedByCohort" :key="cohort.year">
        <h2 class="font-mono text-sm uppercase tracking-wider text-primary/50 dark:text-gray-400 mt-8 mb-4 border-b border-primary/10 dark:border-gray-600 pb-2">
          {{ t.alumni.cohortLabel }} {{ cohort.year }}
        </h2>

        <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          <article
            v-for="member in cohort.members"
            :key="member.id"
            class="group border border-primary/10 dark:border-gray-600 bg-neutral-50 dark:bg-gray-800 p-5 md:p-6 hover:border-primary/25 dark:hover:border-gray-500 transition-colors"
          >
            <a :href="`/profile?id=${member.id}`" class="flex items-start gap-3 md:gap-4 mb-5 no-underline">
              <div
                v-if="member.photo"
                class="relative h-20 w-16 md:h-24 md:w-[4.5rem] shrink-0 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-600 overflow-hidden"
              >
                <img
                  :src="member.photo"
                  :alt="member.name"
                  class="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div
                v-else
                class="relative h-20 w-16 md:h-24 md:w-[4.5rem] shrink-0 bg-primary/5 dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 flex items-center justify-center"
              >
                <span class="font-serif text-xl text-primary/30 dark:text-gray-500">{{ member.name.charAt(0) }}</span>
              </div>
              <div class="min-w-0">
                <h3 class="font-serif text-lg md:text-xl font-semibold text-primary dark:text-gray-100 leading-snug group-hover:text-accent-700 dark:group-hover:text-accent-400 transition-colors">
                  {{ member.name }}
                </h3>
              </div>
            </a>

            <div class="space-y-2 text-sm text-neutral-600 dark:text-gray-300">
              <div v-if="hasCurrentInfo(member)" class="space-y-0.5">
                <div>
                  <span class="text-xs font-mono uppercase tracking-wide text-primary/40 dark:text-gray-500">{{ t.alumni.now }} </span>
                  <span class="font-medium">{{ lang === 'id' ? member.current_role_id : member.current_role_en }}</span>
                </div>
                <div class="text-primary/40 dark:text-gray-500">
                  {{ t.alumni.at }} <span class="font-medium text-neutral-600 dark:text-gray-300">{{ lang === 'id' ? member.current_organization_id : member.current_organization_en }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4 mt-5">
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
          </article>
        </div>
      </div>

      <div v-if="members.length === 0" class="text-center py-12 text-neutral-500 dark:text-gray-400">
        {{ emptyText }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'

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
}

const props = defineProps<{
  status: 'alumni' | 'student'
}>()

const { lang, t } = useI18n()

const members = ref<MemberRow[]>([])
const loading = ref(true)

const heading = computed(() => (props.status === 'alumni' ? t.value.alumni.heading : t.value.members.heading))
const description = computed(() => (props.status === 'alumni' ? t.value.alumni.description : t.value.members.description))
const emptyText = computed(() => (props.status === 'alumni' ? t.value.alumni.empty : t.value.members.empty))

function hasCurrentInfo(member: MemberRow): boolean {
  return !!(member.current_role_id || member.current_role_en)
}

const groupedByCohort = computed(() => {
  const groups = new Map<number, MemberRow[]>()
  for (const member of members.value) {
    const year = member.cohort_year
    if (!groups.has(year)) {
      groups.set(year, [])
    }
    groups.get(year)!.push(member)
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, list]) => ({ year, members: list }))
})

onMounted(async () => {
  const { supabase } = await import('../lib/supabase')
  const { data } = await supabase
    .schema('se')
    .from('members')
    .select('*')
    .eq('status', props.status)
    .order('cohort_year', { ascending: false })

  members.value = data ?? []
  loading.value = false
})
</script>
