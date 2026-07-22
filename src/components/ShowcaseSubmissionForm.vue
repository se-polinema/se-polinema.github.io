<template>
  <div class="max-w-2xl">
    <!-- Signed out -->
    <div v-if="state === 'signed-out'" class="border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6">
      <p class="text-sm text-neutral-600 dark:text-gray-300 mb-4">{{ t.showcaseSubmit.signInPrompt }}</p>
      <GitHubSignInButton :redirect-to="redirectTo" />
      <a
        :href="`/login?redirect=${encodeURIComponent('/showcase/submit')}`"
        class="block mt-3 text-sm font-mono text-accent hover:text-accent/80 transition-colors"
      >
        {{ t.memberSubmit.backToLogin }}
      </a>
    </div>

    <!-- List of own submissions (a user may own several, unlike se.members) -->
    <div v-else-if="state === 'list'">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-serif text-xl font-semibold text-primary dark:text-gray-100">{{ t.showcaseSubmit.listHeading }}</h2>
        <button
          @click="openAddForm"
          class="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-semibold text-white bg-accent hover:bg-accent/90 transition-colors"
        >
          {{ t.showcaseSubmit.addNewCta }}
        </button>
      </div>

      <p v-if="ownProjects.length === 0" class="text-sm text-neutral-500 dark:text-gray-400">
        {{ t.showcaseSubmit.emptyList }}
      </p>

      <ul v-else class="divide-y divide-primary/10 dark:divide-gray-700 border border-primary/10 dark:border-gray-700">
        <li v-for="p in ownProjects" :key="p.id" class="flex items-center justify-between gap-3 px-4 py-3">
          <span class="text-sm font-medium text-primary dark:text-gray-100">{{ p.title }}</span>
          <div class="flex items-center gap-3 flex-shrink-0">
            <span
              class="inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
              :class="p.approved
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'"
            >
              {{ p.approved ? t.showcaseSubmit.approvedBadge : t.showcaseSubmit.pendingBadge }}
            </span>
            <a
              v-if="p.approved"
              :href="`/showcase/detail?id=${p.id}`"
              class="text-xs font-mono text-accent hover:text-accent/80 transition-colors"
            >
              {{ t.showcaseSubmit.viewLink }} →
            </a>
          </div>
        </li>
      </ul>
    </div>

    <!-- Add form -->
    <form v-else-if="state === 'form'" @submit.prevent="handleSubmit" class="border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="font-serif text-xl font-semibold text-primary dark:text-gray-100">{{ t.showcaseSubmit.addNewCta }}</h2>
        <button
          type="button"
          @click="state = 'list'"
          class="text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors"
        >
          {{ t.showcaseAdmin.cancelLabel }}
        </button>
      </div>

      <div v-if="errorMessage" class="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
        {{ errorMessage }}
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.titleLabel }} <span class="text-red-400">*</span></label>
          <input v-model="form.title" required class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.briefLabel }}</label>
          <p class="text-xs text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.briefHint }}</p>
          <textarea v-model="brief" rows="3" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
          <button
            type="button"
            @click="handleSuggest"
            :disabled="suggesting || !form.title.trim() || !brief.trim()"
            class="mt-2 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-semibold text-accent-700 dark:text-accent-400 border border-accent/40 hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ suggesting ? t.showcaseAdmin.suggestingLabel : t.showcaseAdmin.suggestBtn }}
          </button>
          <p v-if="suggestError" class="mt-2 text-xs font-mono text-red-600 dark:text-red-400">{{ suggestError }}</p>
        </div>

        <div class="sm:col-span-2">
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.imageLabel }}</label>
          <ImageUpload v-model="form.image" bucket="project-images" :upload-path-prefix="uploadPrefix" />
        </div>

        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.taglineEnLabel }}</label>
          <input v-model="form.tagline_en" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.taglineIdLabel }}</label>
          <input v-model="form.tagline_id" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.descriptionEnLabel }}</label>
          <textarea v-model="form.description_en" rows="4" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.descriptionIdLabel }}</label>
          <textarea v-model="form.description_id" rows="4" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.tagsLabel }}</label>
          <input v-model="tagsInput" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.repoUrlLabel }}</label>
          <input v-model="form.repo_url" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">{{ t.showcaseAdmin.demoUrlLabel }}</label>
          <input v-model="form.demo_url" class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors" />
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
        {{ submitting ? t.showcaseSubmit.submittingLabel : t.showcaseSubmit.submitBtn }}
      </button>
    </form>

    <!-- Loading -->
    <div v-else class="py-4">
      <div class="h-4 bg-primary/5 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useAuth } from '../composables/useAuth'
import GitHubSignInButton from './GitHubSignInButton.vue'
import ImageUpload from './ImageUpload.vue'
import TurnstileWidget from './TurnstileWidget.vue'
import { suggestProjectContent } from '../lib/suggestProject'

const { t } = useI18n()
const { user, ready } = useAuth()

// Unlike MemberSubmissionForm's single-row state machine (a member is one
// identity, capped at one row), a project is an artifact a person
// contributes — one user can submit several. So this is list-based: the
// signed-in user sees all their own submissions (each independently
// pending/approved) plus an "Add New" action, rather than a single
// terminal pending/approved screen.
type SubmissionState = 'loading' | 'signed-out' | 'list' | 'form'

interface OwnProject {
  id: string
  title: string
  approved: boolean
}

const state = ref<SubmissionState>('loading')
const ownProjects = ref<OwnProject[]>([])
const submitting = ref(false)
const errorMessage = ref('')
const turnstileToken = ref('')
const turnstileRef = ref<InstanceType<typeof TurnstileWidget> | null>(null)

// Transient — describes the project for the AI-suggest call, not itself
// submitted.
const brief = ref('')
const suggesting = ref(false)
const suggestError = ref('')

// A fresh id per opened form: project cover images live at
// {uid}/{this-uuid}/photo.jpg so multiple projects from the same user
// don't collide (members' fixed {uid}/photo.jpg only works because a
// member is capped at one row).
const uploadPrefix = ref('')

const redirectTo = typeof window !== 'undefined' ? window.location.href : undefined

function emptyForm() {
  return {
    title: '',
    tagline_en: '',
    tagline_id: '',
    description_en: '',
    description_id: '',
    tags: [] as string[],
    repo_url: '',
    demo_url: '',
    image: null as string | null,
  }
}

const form = reactive(emptyForm())

const tagsInput = computed({
  get: () => form.tags.join(', '),
  set: (val: string) => {
    form.tags = val.split(',').map((s) => s.trim()).filter(Boolean)
  },
})

async function loadOwnProjects() {
  if (!user.value) return
  const { supabase } = await import('../lib/supabase')
  const { data } = await supabase
    .schema('se')
    .from('projects')
    .select('id, title, approved')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })

  ownProjects.value = data ?? []
}

watch(
  () => ready.value,
  async (isReady) => {
    if (!isReady) return

    if (!user.value) {
      state.value = 'signed-out'
      return
    }

    await loadOwnProjects()
    state.value = 'list'
  },
  { immediate: true }
)

function openAddForm() {
  Object.assign(form, emptyForm())
  brief.value = ''
  errorMessage.value = ''
  suggestError.value = ''
  turnstileToken.value = ''
  uploadPrefix.value = `${user.value?.id ?? ''}/${crypto.randomUUID()}`
  state.value = 'form'
}

async function handleSuggest() {
  suggesting.value = true
  suggestError.value = ''

  const { suggestion } = await suggestProjectContent({
    title: form.title,
    brief: brief.value,
    repo_url: form.repo_url,
  })

  suggesting.value = false

  if (!suggestion) {
    suggestError.value = t.value.showcaseAdmin.suggestError
    return
  }

  form.tagline_en = suggestion.tagline_en
  form.tagline_id = suggestion.tagline_id
  form.description_en = suggestion.description_en
  form.description_id = suggestion.description_id
  form.tags = suggestion.tags
}

async function handleSubmit() {
  if (!user.value || !turnstileToken.value) return

  submitting.value = true
  errorMessage.value = ''

  const { supabase } = await import('../lib/supabase')
  const { error } = await supabase.functions.invoke('submit-project', {
    body: {
      title: form.title.trim(),
      tagline_en: form.tagline_en.trim() || null,
      tagline_id: form.tagline_id.trim() || null,
      description_en: form.description_en.trim() || null,
      description_id: form.description_id.trim() || null,
      tags: form.tags,
      repo_url: form.repo_url.trim() || null,
      demo_url: form.demo_url.trim() || null,
      image: form.image || null,
      turnstileToken: turnstileToken.value,
    },
  })

  submitting.value = false

  if (error) {
    turnstileRef.value?.reset()
    turnstileToken.value = ''
    // functions.invoke() surfaces non-2xx responses as a generic SDK error
    // without parsing the JSON body — recover the actual server message
    // (submit-project returns { error: <postgres error message> }) from
    // the raw Response on error.context.
    let serverMessage: string | null = null
    try {
      const body = await (error as { context?: Response }).context?.json()
      serverMessage = body?.error ?? null
    } catch {
      // ignore — fall through to the generic error below
    }
    errorMessage.value = serverMessage || t.value.showcaseSubmit.genericError
    return
  }

  await loadOwnProjects()
  state.value = 'list'
}
</script>
