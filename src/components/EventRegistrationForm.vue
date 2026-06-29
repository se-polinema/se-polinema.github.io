<template>
  <div class="border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6">
    <h2 class="font-mono text-xs uppercase tracking-wider text-primary/50 dark:text-gray-400 mb-5">
      {{ t.events.registration.heading }}
    </h2>

    <!-- Success state -->
    <div v-if="state === 'success'" class="flex flex-col items-start gap-3 py-4">
      <div class="flex items-center gap-2 text-green-600 dark:text-green-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 13.01 9 10.01"/>
        </svg>
        <span class="font-mono text-sm font-semibold">{{ t.events.registration.successTitle }}</span>
      </div>
      <p class="text-sm text-neutral-600 dark:text-gray-400">{{ t.events.registration.successMessage }}</p>
    </div>

    <!-- Closed state -->
    <div v-else-if="state === 'closed'" class="py-4">
      <p class="text-sm font-mono text-neutral-500 dark:text-gray-400">{{ t.events.registration.closedMessage }}</p>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="errorMessage" class="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
        {{ errorMessage }}
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
            {{ t.events.registration.nameLabel }} <span class="text-red-400">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            :placeholder="t.events.registration.namePlaceholder"
            class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
            {{ t.events.registration.emailLabel }} <span class="text-red-400">*</span>
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            :placeholder="t.events.registration.emailPlaceholder"
            class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
            {{ t.events.registration.identifierLabel }}
          </label>
          <input
            v-model="form.identifier"
            type="text"
            :placeholder="t.events.registration.identifierPlaceholder"
            class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
            {{ t.events.registration.phoneLabel }}
          </label>
          <input
            v-model="form.phone"
            type="tel"
            :placeholder="t.events.registration.phonePlaceholder"
            class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
          />
        </div>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button
          type="submit"
          :disabled="state === 'submitting'"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="state === 'submitting'" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
          {{ state === 'submitting' ? t.events.registration.submitting : t.events.registration.submitBtn }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from '../composables/useI18n'
import { supabase } from '../lib/supabase'

const props = defineProps<{
  eventSlug: string
  eventTitle: string
}>()

const { t } = useI18n()

type State = 'idle' | 'submitting' | 'success' | 'closed'

const state = ref<State>('idle')
const errorMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  identifier: '',
  phone: '',
})

async function handleSubmit() {
  state.value = 'submitting'
  errorMessage.value = ''

  // Check registration is open
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

  const { error } = await supabase
    .schema('se')
    .from('participants')
    .insert({
      event_slug: props.eventSlug,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      identifier: form.identifier.trim() || null,
      phone: form.phone.trim() || null,
    })

  if (error) {
    state.value = 'idle'
    if (error.code === '23505') {
      errorMessage.value = t.value.events.registration.duplicateError
    } else {
      errorMessage.value = t.value.events.registration.genericError
    }
    return
  }

  state.value = 'success'
}
</script>
