<template>
  <div class="max-w-sm mx-auto">
    <div class="border border-primary/10 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800/50 p-6">
      <h1 class="font-serif text-2xl font-bold text-primary dark:text-gray-100 mb-6">
        {{ t.events.auth.loginHeading }}
      </h1>

      <GitHubSignInButton :redirect-to="oauthRedirectTo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import GitHubSignInButton from './GitHubSignInButton.vue'

// Sign-in and sign-up are the same action with GitHub OAuth (it creates
// the account on first use), so there's only one entry point left —
// /register redirects here (see src/pages/register.astro) — and no more
// login/register mode to branch on.
const { t } = useI18n()

// Same ?redirect= convention register.astro's redirect preserves,
// resolved to an absolute URL since Supabase's OAuth redirectTo requires one.
const oauthRedirectTo = typeof window !== 'undefined'
  ? (() => {
      const redirect = new URLSearchParams(window.location.search).get('redirect')
      return redirect ? new URL(redirect, window.location.origin).toString() : window.location.origin + '/'
    })()
  : undefined
</script>
