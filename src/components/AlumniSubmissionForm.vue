<template>
  <div class="max-w-2xl">
    <!-- Signed out -->
    <div v-if="state === 'signed-out'" class="border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6">
      <p class="text-sm text-neutral-600 dark:text-gray-300 mb-4">{{ t.alumniSubmit.signInPrompt }}</p>
      <GitHubSignInButton :redirect-to="redirectTo" />
      <a
        :href="`/login?redirect=${encodeURIComponent('/alumni/submit')}`"
        class="block mt-3 text-sm font-mono text-accent hover:text-accent/80 transition-colors"
      >
        {{ t.alumniSubmit.backToLogin }}
      </a>
    </div>

    <!-- Pending review -->
    <div v-else-if="state === 'pending'" class="border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6">
      <h2 class="font-serif text-xl font-semibold text-primary dark:text-gray-100 mb-2">{{ t.alumniSubmit.pendingHeading }}</h2>
      <p class="text-sm text-neutral-600 dark:text-gray-300">{{ t.alumniSubmit.pendingMessage }}</p>
    </div>

    <!-- Already approved -->
    <div v-else-if="state === 'approved'" class="border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6">
      <h2 class="font-serif text-xl font-semibold text-primary dark:text-gray-100 mb-2">{{ t.alumniSubmit.approvedHeading }}</h2>
      <p class="text-sm text-neutral-600 dark:text-gray-300 mb-3">{{ t.alumniSubmit.approvedMessage }}</p>
      <a
        v-if="existingMemberId"
        :href="`/profile?id=${existingMemberId}`"
        class="text-sm font-mono text-accent hover:text-accent/80 transition-colors"
      >
        {{ t.alumniSubmit.viewProfileLink }} →
      </a>
    </div>

    <!-- Form -->
    <form v-else-if="state === 'form'" @submit.prevent="handleSubmit" class="border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6 space-y-4">
      <p class="text-xs text-neutral-400 dark:text-gray-500 leading-relaxed">{{ t.alumniSubmit.alreadyListedNote }}</p>

      <div v-if="errorMessage" class="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
        {{ errorMessage }}
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.nameLabel }} <span class="text-red-400">*</span></label>
          <input v-model="form.name" required class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.photoLabel }}</label>
          <MemberPhotoUpload v-model="form.photo" :upload-path-prefix="user?.id ?? ''" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.cohortYearLabel }} <span class="text-red-400">*</span></label>
          <input v-model.number="form.cohort_year" type="number" required class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.exitYearLabel }} <span class="text-red-400">*</span></label>
          <input v-model.number="form.exit_year" type="number" required class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.roleIdLabel }} <span class="text-red-400">*</span></label>
          <input v-model="form.role_id" required class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.roleEnLabel }} <span class="text-red-400">*</span></label>
          <input v-model="form.role_en" required class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.currentPositionIdLabel }}</label>
          <input v-model="form.current_role_id" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.currentPositionEnLabel }}</label>
          <input v-model="form.current_role_en" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.currentAffiliationIdLabel }}</label>
          <input v-model="form.current_organization_id" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.currentAffiliationEnLabel }}</label>
          <input v-model="form.current_organization_en" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.linkedinLabel }}</label>
          <input v-model="form.linkedin_url" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.profileUrlLabel }}</label>
          <input v-model="form.profile_url" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.githubLabel }}</label>
          <input v-model="form.github_url" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.alumniSubmit.streamsLabel }}</label>
          <div class="flex flex-wrap gap-3">
            <label
              v-for="stream in research"
              :key="stream.id"
              class="inline-flex items-center gap-1.5 text-xs font-mono text-primary dark:text-gray-100"
            >
              <input type="checkbox" :value="stream.id" v-model="form.streams" class="h-3.5 w-3.5" />
              {{ lang === 'id' ? stream.name.id : stream.name.en }}
            </label>
          </div>
        </div>

        <div class="sm:col-span-2">
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.researchTopicsLabel }} <span class="text-red-400">*</span></label>
          <textarea v-model="form.research_topics" rows="5" required class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.membersAdmin.careerUpdateLabel }}</label>
          <textarea v-model="form.career_update" rows="5" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
      </div>

      <TurnstileWidget
        ref="turnstileRef"
        @verify="turnstileToken = $event"
        @expire="turnstileToken = ''"
      />

      <button
        type="submit"
        :disabled="submitting || !turnstileToken"
        class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ submitting ? t.alumniSubmit.submittingLabel : t.alumniSubmit.submitBtn }}
      </button>
    </form>

    <!-- Loading -->
    <div v-else class="py-4">
      <div class="h-4 bg-primary/5 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useAuth } from '../composables/useAuth'
import GitHubSignInButton from './GitHubSignInButton.vue'
import MemberPhotoUpload from './MemberPhotoUpload.vue'
import TurnstileWidget from './TurnstileWidget.vue'
import research from '../data/research.json'

const { t, lang } = useI18n()
const { user, ready } = useAuth()

type SubmissionState = 'loading' | 'signed-out' | 'pending' | 'approved' | 'form'

const state = ref<SubmissionState>('loading')
const existingMemberId = ref<string | null>(null)
const submitting = ref(false)
const errorMessage = ref('')
const turnstileToken = ref('')
const turnstileRef = ref<InstanceType<typeof TurnstileWidget> | null>(null)

const redirectTo = typeof window !== 'undefined' ? window.location.href : undefined

const form = reactive({
  name: '',
  photo: null as string | null,
  // cohort_year is enrollment year (angkatan), not exit year — an alumnus
  // has always already enrolled by the time they submit, so default to
  // the 4-year D-IV convention (currentYear - 4) rather than today's year.
  cohort_year: new Date().getFullYear() - 4,
  exit_year: new Date().getFullYear(),
  // Pre-filled with the site's old hardcoded default (every self-
  // submission used to be forced to this regardless of what the alumnus
  // actually did in the lab) — now just a starting point the submitter
  // can edit, e.g. "Lab Coordinator" / "Koordinator Lab".
  role_id: 'Mahasiswa',
  role_en: 'Student',
  current_role_id: '',
  current_role_en: '',
  current_organization_id: '',
  current_organization_en: '',
  linkedin_url: '',
  profile_url: '',
  github_url: '',
  streams: [] as string[],
  research_topics: '',
  career_update: '',
})

watch(
  () => ready.value,
  async (isReady) => {
    if (!isReady) return

    if (!user.value) {
      state.value = 'signed-out'
      return
    }

    const { supabase } = await import('../lib/supabase')
    const { data } = await supabase
      .schema('se')
      .from('members')
      .select('id, approved')
      .eq('user_id', user.value.id)
      .maybeSingle()

    if (data) {
      existingMemberId.value = data.id
      state.value = data.approved ? 'approved' : 'pending'
      return
    }

    const meta = user.value.user_metadata as Record<string, string> | undefined
    form.name = meta?.full_name || meta?.name || meta?.user_name || ''
    // GitHub OAuth metadata includes the handle as user_name — prefill the
    // profile link from it (still editable, in case it's stale or wrong).
    if (meta?.user_name) {
      form.github_url = `https://github.com/${meta.user_name}`
    }
    state.value = 'form'
  },
  { immediate: true }
)

async function handleSubmit() {
  if (!user.value || !turnstileToken.value) return

  submitting.value = true
  errorMessage.value = ''

  const { supabase } = await import('../lib/supabase')
  const { error } = await supabase.functions.invoke('submit-alumni', {
    body: {
      name: form.name.trim(),
      photo: form.photo || null,
      cohort_year: form.cohort_year,
      exit_year: form.exit_year,
      role_id: form.role_id.trim(),
      role_en: form.role_en.trim(),
      current_role_id: form.current_role_id.trim() || null,
      current_role_en: form.current_role_en.trim() || null,
      current_organization_id: form.current_organization_id.trim() || null,
      current_organization_en: form.current_organization_en.trim() || null,
      linkedin_url: form.linkedin_url.trim() || null,
      profile_url: form.profile_url.trim() || null,
      github_url: form.github_url.trim() || null,
      streams: form.streams,
      research_topics: form.research_topics.trim() || null,
      career_update: form.career_update.trim() || null,
      turnstileToken: turnstileToken.value,
    },
  })

  submitting.value = false

  if (error) {
    turnstileRef.value?.reset()
    turnstileToken.value = ''
    // functions.invoke() surfaces non-2xx responses as a generic SDK error
    // without parsing the JSON body — recover the actual server message
    // (submit-alumni returns { error: <postgres error message> }) from
    // the raw Response on error.context.
    let serverMessage: string | null = null
    try {
      const body = await (error as { context?: Response }).context?.json()
      serverMessage = body?.error ?? null
    } catch {}
    errorMessage.value = serverMessage || t.value.alumniSubmit.genericError
    return
  }

  state.value = 'pending'
}
</script>
