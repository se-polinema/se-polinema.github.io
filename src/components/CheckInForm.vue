<template>
  <div class="border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6 max-w-lg">
    <h1 class="font-serif text-2xl font-bold text-primary dark:text-gray-100 mb-1">
      {{ t.events.checkin.heading }}
    </h1>
    <p class="text-sm text-neutral-500 dark:text-gray-400 mb-6">
      {{ t.events.registrationNote }}
    </p>

    <!-- Success -->
    <div v-if="state === 'success'" class="flex flex-col gap-3 py-4">
      <div class="flex items-center gap-2 text-green-600 dark:text-green-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 13.01 9 10.01"/>
        </svg>
        <span class="font-mono text-sm font-semibold">{{ successTitle }}</span>
      </div>
      <p class="text-sm text-neutral-600 dark:text-gray-400">{{ successMessage }}</p>
    </div>

    <!-- No events -->
    <div v-else-if="events.length === 0" class="py-4">
      <p class="text-sm font-mono text-neutral-500 dark:text-gray-400">{{ t.events.noUpcoming }}</p>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="errorMessage" class="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
        {{ errorMessage }}
      </div>

      <div>
        <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
          {{ t.events.checkin.selectEvent }} <span class="text-red-400">*</span>
        </label>
        <select
          v-model="form.eventSlug"
          required
          class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
        >
          <option value="" disabled>{{ t.events.checkin.selectEventPlaceholder }}</option>
          <option v-for="ev in events" :key="ev.id" :value="ev.id">
            {{ lang === 'id' && ev.titleId ? ev.titleId : ev.title }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
          {{ t.events.checkin.emailLabel }} <span class="text-red-400">*</span>
        </label>
        <input
          v-model="form.email"
          type="email"
          required
          :placeholder="t.events.checkin.emailPlaceholder"
          class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
        />
      </div>

      <div>
        <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
          {{ t.events.checkin.codeLabel }} <span class="text-red-400">*</span>
        </label>
        <input
          v-model="form.code"
          type="text"
          required
          :placeholder="t.events.checkin.codePlaceholder"
          class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
        />
      </div>

      <div class="pt-2">
        <button
          type="submit"
          :disabled="state === 'submitting'"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="state === 'submitting'" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
          {{ state === 'submitting' ? t.events.checkin.submitting : t.events.checkin.submitBtn }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from '../composables/useI18n'
import { supabase } from '../lib/supabase'

defineProps<{
  events: Array<{ id: string; title: string; titleId?: string }>
}>()

const { lang, t } = useI18n()

type State = 'idle' | 'submitting' | 'success'

const state = ref<State>('idle')
const errorMessage = ref('')
const successTitle = ref('')
const successMessage = ref('')

const form = reactive({
  eventSlug: '',
  email: '',
  code: '',
})

async function handleSubmit() {
  state.value = 'submitting'
  errorMessage.value = ''

  const { data, error } = await supabase
    .schema('se')
    .rpc('check_in_participant', {
      p_event_slug: form.eventSlug,
      p_email: form.email.trim().toLowerCase(),
      p_check_in_code: form.code.trim(),
    })

  if (error) {
    state.value = 'idle'
    errorMessage.value = t.value.events.checkin.genericError
    return
  }

  const result = data as { success: boolean; error?: string; already_checked_in?: boolean }

  if (!result.success) {
    state.value = 'idle'
    if (result.error === 'invalid_code') {
      errorMessage.value = t.value.events.checkin.invalidCode
    } else if (result.error === 'not_found') {
      errorMessage.value = t.value.events.checkin.notFoundError
    } else {
      errorMessage.value = t.value.events.checkin.genericError
    }
    return
  }

  if (result.already_checked_in) {
    successTitle.value = t.value.events.checkin.successTitle
    successMessage.value = t.value.events.checkin.alreadyCheckedIn
  } else {
    successTitle.value = t.value.events.checkin.successTitle
    successMessage.value = t.value.events.checkin.successMessage
  }

  state.value = 'success'
}
</script>
