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

    <!-- Sign in to register -->
    <div v-else-if="state === 'signed-out'" class="space-y-4">
      <GitHubSignInButton />
      <p class="text-[10px] text-neutral-400 dark:text-gray-500 mt-3 leading-relaxed">
        {{ lang === 'en' ? 'Your data is stored securely in Supabase. Read our' : 'Data Anda disimpan dengan aman di Supabase. Baca' }}
        <a href="/privacy" class="underline underline-offset-2 hover:text-primary dark:hover:text-gray-200 transition-colors">{{ t.privacy.navLabel }}</a>
      </p>
    </div>

    <!-- Loading skeleton -->
    <div v-else class="py-4">
      <div class="h-4 bg-primary/5 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { supabase } from '../lib/supabase'
import GitHubSignInButton from './GitHubSignInButton.vue'

const props = defineProps<{
  eventSlug: string
  eventTitle: string
}>()

const { t, lang } = useI18n()

type State = 'loading' | 'signed-out' | 'success' | 'waitlisted' | 'closed' | 'signed-in' | 'already-registered'

const state = ref<State>('loading')
const submitting = ref(false)
const errorMessage = ref('')
const currentUserEmail = ref('')
const currentUserId = ref('')

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

  state.value = 'signed-out'
})

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
</script>
