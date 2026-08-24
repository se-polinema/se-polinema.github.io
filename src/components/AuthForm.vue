<template>
  <div class="max-w-sm mx-auto">
    <div class="border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6">
      <h1 class="font-serif text-2xl font-bold text-primary dark:text-gray-100 mb-6">
        {{ t.events.auth.loginHeading }}
      </h1>

      <p v-if="oauthError" class="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
        {{ oauthError }}
      </p>

      <GitHubSignInButton :redirect-to="oauthRedirectTo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import GitHubSignInButton from './GitHubSignInButton.vue'
import { readOAuthError } from '../lib/oauthError'

// Sign-in and sign-up are the same action with GitHub OAuth (it creates
// the account on first use), so there's only one entry point left:
// /register redirects here (see src/pages/register.astro), and no more
// login/register mode to branch on.
const { t } = useI18n()

// Supabase redirects failed OAuth attempts back here with an error param.
// Seeded empty for SSR, filled in onMounted (post-hydration reactive
// update, not subject to Vue's production hydration-patch suppression).
const oauthError = ref('')
onMounted(() => {
  oauthError.value = readOAuthError()
})

// Same ?redirect= convention register.astro's redirect preserves,
// resolved to an absolute URL since Supabase's OAuth redirectTo requires one.
const oauthRedirectTo = typeof window !== 'undefined'
  ? (() => {
      const redirect = new URLSearchParams(window.location.search).get('redirect')
      return redirect ? new URL(redirect, window.location.origin).toString() : window.location.origin + '/'
    })()
  : undefined
</script>
