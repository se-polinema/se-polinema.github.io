<template>
  <div class="border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6">
    <h2 class="font-mono text-xs uppercase tracking-wider text-primary/50 dark:text-gray-400 mb-5">
      {{ t.events.registration.heading }}
    </h2>

    <!-- Success state -->
    <div v-if="regState === 'success'" class="flex flex-col items-start gap-3 py-4">
      <div class="flex items-center gap-2 text-green-600 dark:text-green-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 13.01 9 10.01"/>
        </svg>
        <span class="font-mono text-sm font-semibold">{{ t.events.registration.successTitle }}</span>
      </div>
      <p class="text-sm text-neutral-600 dark:text-gray-400">{{ t.events.registration.successMessage }}</p>
    </div>

    <!-- Already registered -->
    <div v-else-if="regState === 'already_registered'" class="py-4">
      <p class="text-sm font-mono text-neutral-500 dark:text-gray-400">{{ t.events.registration.alreadyRegistered }}</p>
    </div>

    <!-- Closed state -->
    <div v-else-if="regState === 'closed'" class="py-4">
      <p class="text-sm font-mono text-neutral-500 dark:text-gray-400">{{ t.events.registration.closedMessage }}</p>
    </div>

    <!-- Register prompt -->
    <div v-else>
      <div v-if="errorMessage" class="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono mb-4">
        {{ errorMessage }}
      </div>

      <p class="text-sm text-neutral-600 dark:text-gray-400 mb-4">{{ t.events.registration.registerPrompt }}</p>

      <button
        :disabled="regState === 'registering'"
        class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="handleRegister"
      >
        <svg v-if="regState === 'registering'" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        {{ regState === 'registering' ? t.events.registration.registeringBtn : t.events.registration.registerBtn }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { supabase } from '../lib/supabase'

const props = defineProps<{
  eventSlug: string
  eventTitle: string
}>()

const { t } = useI18n()

type RegState = 'idle' | 'registering' | 'success' | 'already_registered' | 'closed'

const regState = ref<RegState>('idle')
const errorMessage = ref('')

async function handleRegister() {
  errorMessage.value = ''

  const { data: event } = await supabase
    .schema('se')
    .from('events')
    .select('registration_open')
    .eq('slug', props.eventSlug)
    .single()

  if (event && !event.registration_open) {
    regState.value = 'closed'
    return
  }

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) {
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
    return
  }

  regState.value = 'registering'

  const { data: profile } = await supabase
    .schema('se')
    .from('profiles')
    .select('full_name')
    .eq('id', authData.user.id)
    .single()

  const { error } = await supabase
    .schema('se')
    .from('participants')
    .insert({
      event_slug: props.eventSlug,
      user_id: authData.user.id,
      name: profile?.full_name || authData.user.email || 'Participant',
      email: authData.user.email || '',
    })

  if (error) {
    if (error.code === '23505') {
      regState.value = 'already_registered'
    } else {
      regState.value = 'idle'
      errorMessage.value = t.value.events.registration.genericError
    }
    return
  }

  regState.value = 'success'
}
</script>
