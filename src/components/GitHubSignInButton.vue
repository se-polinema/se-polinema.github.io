<template>
  <div>
    <button
      type="button"
      @click="handleClick"
      :disabled="loading"
      class="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold text-primary dark:text-gray-100 bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 hover:bg-neutral-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <svg v-if="!loading" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
      <svg v-else class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
      {{ t.events.auth.githubBtn }}
    </button>
    <p v-if="errorMessage" class="mt-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { supabase } from '../lib/supabase'

// redirectTo: where Supabase should send the browser back to after the GitHub
// OAuth round-trip. Defaults to the current page, so islands embedded in an
// event/checkin page naturally land the user back where they started; AuthForm
// overrides this to honor its `?redirect=` convention.
const props = defineProps<{
  redirectTo?: string
}>()

const { t } = useI18n()

const loading = ref(false)
const errorMessage = ref('')

async function handleClick() {
  loading.value = true
  errorMessage.value = ''

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: props.redirectTo || window.location.href,
    },
  })

  if (error) {
    loading.value = false
    errorMessage.value = error.message || t.value.events.auth.githubError
  }
  // On success the browser navigates to GitHub immediately, so there's no
  // further local state to update here.
}
</script>
