<template>
  <div class="border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6">
    <h2 class="font-mono text-xs uppercase tracking-wider text-primary/50 dark:text-gray-400 mb-5">
      {{ t.events.registration.heading }}
    </h2>

    <!-- Success -->
    <div v-if="state === 'success'" class="flex flex-col items-start gap-3 py-4">
      <div class="flex items-center gap-2 text-green-600 dark:text-green-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 13.01 9 10.01"/>
        </svg>
        <span class="font-mono text-sm font-semibold">{{ t.events.registration.successTitle }}</span>
      </div>
      <p class="text-sm text-neutral-600 dark:text-gray-400">{{ t.events.registration.successMessage }}</p>
    </div>

    <!-- Waitlisted -->
    <div v-else-if="state === 'waitlisted'" class="flex flex-col items-start gap-3 py-4">
      <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span class="font-mono text-sm font-semibold">{{ t.events.registration.waitlistedTitle }}</span>
      </div>
      <p class="text-sm text-neutral-600 dark:text-gray-400">{{ t.events.registration.waitlistedMessage }}</p>
    </div>

    <!-- Registration closed -->
    <div v-else-if="state === 'closed'" class="py-4">
      <p class="text-sm font-mono text-neutral-500 dark:text-gray-400">{{ t.events.registration.closedMessage }}</p>
    </div>

    <!-- Already registered -->
    <div v-else-if="state === 'already-registered'" class="flex flex-col items-start gap-3 py-4">
      <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 13.01 9 10.01"/>
        </svg>
        <span class="font-mono text-sm font-semibold">{{ t.events.registration.alreadyRegistered }}</span>
      </div>
    </div>

    <!-- Signed-in quick register -->
    <div v-else-if="state === 'signed-in'" class="py-2 flex flex-col gap-3">
      <p class="text-sm text-neutral-600 dark:text-gray-400">
        {{ t.events.registration.signedInAs }}
        <strong class="font-mono">{{ currentUserEmail }}</strong>
      </p>
      <div v-if="errorMessage" class="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
        {{ errorMessage }}
      </div>
      <button
        @click="registerExistingUser"
        :disabled="submitting"
        class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg v-if="submitting" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        {{ submitting ? t.events.registration.submitting : t.events.registration.registerThisEvent }}
      </button>
    </div>

    <!-- Register / Sign-in form -->
    <form v-else-if="state === 'idle'" @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="errorMessage" class="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
        {{ errorMessage }}
      </div>

      <GitHubSignInButton />

      <div class="flex items-center gap-3">
        <div class="flex-1 h-px bg-primary/10 dark:bg-gray-700"></div>
        <span class="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500">{{ t.events.auth.orDivider }}</span>
        <div class="flex-1 h-px bg-primary/10 dark:bg-gray-700"></div>
      </div>

      <!-- Name — register mode only -->
      <div v-if="mode === 'register'">
        <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
          {{ t.events.auth.nameLabel }} <span class="text-red-400">*</span>
        </label>
        <input
          v-model="form.name"
          type="text"
          required
          :placeholder="t.events.auth.namePlaceholder"
          class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
        />
      </div>

      <div>
        <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
          {{ t.events.auth.emailLabel }} <span class="text-red-400">*</span>
        </label>
        <input
          v-model="form.email"
          type="email"
          required
          :placeholder="t.events.auth.emailPlaceholder"
          class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
        />
      </div>

      <div>
        <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
          {{ t.events.auth.passwordLabel }} <span class="text-red-400">*</span>
        </label>
        <input
          v-model="form.password"
          type="password"
          required
          placeholder="••••••••"
          class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
        />
      </div>

      <!-- Confirm password — register mode only -->
      <div v-if="mode === 'register'">
        <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
          {{ t.events.registration.confirmPasswordLabel }} <span class="text-red-400">*</span>
        </label>
        <input
          v-model="form.confirmPassword"
          type="password"
          required
          placeholder="••••••••"
          class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
        />
      </div>

      <TurnstileWidget
        ref="turnstileRef"
        @verify="turnstileToken = $event"
        @expire="turnstileToken = ''"
      />

      <div class="flex items-center justify-between pt-2">
        <button
          type="submit"
          :disabled="submitting || !turnstileToken"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="submitting" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
          {{ submitting
            ? (mode === 'register' ? t.events.registration.submitting : t.events.registration.signingIn)
            : (mode === 'register' ? t.events.auth.registerBtn : t.events.auth.loginBtn)
          }}
        </button>
        <button
          type="button"
          @click="toggleMode"
          class="text-xs font-mono text-primary/50 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors underline"
        >
          {{ mode === 'register' ? t.events.registration.signInPrompt : t.events.registration.registerPrompt }}
        </button>
      </div>
      <p class="text-[10px] text-neutral-400 dark:text-gray-500 mt-3 leading-relaxed">
        {{ lang === 'en' ? 'Your data is stored securely in Supabase. Read our' : 'Data Anda disimpan dengan aman di Supabase. Baca' }}
        <a href="/privacy" class="underline underline-offset-2 hover:text-primary dark:hover:text-gray-200 transition-colors">{{ t.privacy.navLabel }}</a>
      </p>
    </form>

    <!-- Loading skeleton -->
    <div v-else class="py-4">
      <div class="h-4 bg-primary/5 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { supabase } from '../lib/supabase'
import GitHubSignInButton from './GitHubSignInButton.vue'
import TurnstileWidget from './TurnstileWidget.vue'

const props = defineProps<{
  eventSlug: string
  eventTitle: string
}>()

const { t, lang } = useI18n()

type State = 'loading' | 'idle' | 'success' | 'waitlisted' | 'closed' | 'signed-in' | 'already-registered'
type Mode = 'register' | 'sign-in'

const state = ref<State>('loading')
const mode = ref<Mode>('register')
const submitting = ref(false)
const errorMessage = ref('')
const currentUserEmail = ref('')
const currentUserId = ref('')
const turnstileToken = ref('')
const turnstileRef = ref<InstanceType<typeof TurnstileWidget> | null>(null)

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

onMounted(async () => {
  // 1. Check registration is open
  const { data: event } = await supabase
    .schema('se')
    .from('events')
    .select('registration_open')
    .eq('slug', props.eventSlug)
    .single()

  if (event && !event.registration_open) {
    state.value = 'closed'
    return
  }

  // 2. Check for existing session
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    currentUserEmail.value = user.email ?? ''
    currentUserId.value = user.id

    const { data: existing } = await supabase
      .schema('se')
      .from('participants')
      .select('id')
      .eq('event_slug', props.eventSlug)
      .eq('user_id', user.id)
      .maybeSingle()

    state.value = existing ? 'already-registered' : 'signed-in'
    return
  }

  state.value = 'idle'
})

function toggleMode() {
  mode.value = mode.value === 'register' ? 'sign-in' : 'register'
  errorMessage.value = ''
  form.password = ''
  form.confirmPassword = ''
}

async function registerExistingUser() {
  submitting.value = true
  errorMessage.value = ''

  const { data: result, error } = await supabase
    .schema('se')
    .rpc('register_participant', { p_event_slug: props.eventSlug })

  submitting.value = false

  if (error || !result?.success) {
    if (result?.error === 'already_registered') {
      state.value = 'already-registered'
    } else {
      errorMessage.value = t.value.events.registration.genericError
    }
    return
  }

  state.value = result.status === 'waitlisted' ? 'waitlisted' : 'success'
}

async function handleSubmit() {
  errorMessage.value = ''

  if (!turnstileToken.value) return

  if (mode.value === 'register' && form.password !== form.confirmPassword) {
    errorMessage.value = t.value.events.registration.passwordMismatch
    return
  }

  submitting.value = true

  if (mode.value === 'register') {
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: { data: { name: form.name.trim() }, captchaToken: turnstileToken.value },
    })

    if (error) {
      submitting.value = false
      turnstileRef.value?.reset()
      turnstileToken.value = ''
      errorMessage.value = error.message ?? t.value.events.registration.genericError
      return
    }

    // With confirmations off, duplicate email returns user with empty identities array.
    if (!data.user || (data.user.identities && data.user.identities.length === 0)) {
      submitting.value = false
      turnstileRef.value?.reset()
      turnstileToken.value = ''
      errorMessage.value = t.value.events.registration.emailExists
      return
    }

    // Store full_name on profile (trigger creates the row; update sets the name).
    await supabase
      .schema('se')
      .from('profiles')
      .update({ full_name: form.name.trim() })
      .eq('id', data.user.id)

    const { data: result, error: rpcError } = await supabase
      .schema('se')
      .rpc('register_participant', { p_event_slug: props.eventSlug })

    submitting.value = false

    if (rpcError || !result?.success) {
      turnstileRef.value?.reset()
      turnstileToken.value = ''
      if (result?.error === 'already_registered') {
        state.value = 'already-registered'
      } else {
        state.value = 'idle'
        errorMessage.value = t.value.events.registration.genericError
      }
      return
    }

    state.value = result.status === 'waitlisted' ? 'waitlisted' : 'success'
  } else {
    // Sign-in mode
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: { captchaToken: turnstileToken.value },
    })

    if (error || !data.user) {
      submitting.value = false
      turnstileRef.value?.reset()
      turnstileToken.value = ''
      errorMessage.value = error?.message ?? t.value.events.registration.genericError
      return
    }

    currentUserEmail.value = data.user.email ?? ''
    currentUserId.value = data.user.id

    // register_participant() already checks already-registered atomically,
    // so no separate pre-check query is needed here anymore.
    const { data: result, error: rpcError } = await supabase
      .schema('se')
      .rpc('register_participant', { p_event_slug: props.eventSlug })

    submitting.value = false

    if (rpcError || !result?.success) {
      turnstileRef.value?.reset()
      turnstileToken.value = ''
      if (result?.error === 'already_registered') {
        state.value = 'already-registered'
      } else {
        state.value = 'idle'
        errorMessage.value = t.value.events.registration.genericError
      }
      return
    }

    state.value = result.status === 'waitlisted' ? 'waitlisted' : 'success'
  }
}
</script>
