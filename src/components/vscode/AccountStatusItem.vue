<template>
  <!-- Gate on `ready` so we don't flash "Sign In" before getSession() resolves
       for an already-logged-in user. -->
  <template v-if="ready">
    <a
      v-if="!user"
      :href="signInHref"
      class="flex items-center gap-1 h-6 px-1.5 text-[11px] font-mono text-primary font-semibold hover:bg-primary/10 transition-colors"
      :title="t.account.accountLabel"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="7" r="4"/>
        <path d="M5.5 21a6.5 6.5 0 0113 0"/>
      </svg>
      <span class="hidden sm:inline">{{ t.account.signIn }}</span>
    </a>

    <div v-else class="flex items-center h-6">
      <span
        class="flex items-center gap-1 h-6 px-1.5 text-[11px] font-mono text-primary font-semibold"
        :title="t.account.accountLabel"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="7" r="4"/>
          <path d="M5.5 21a6.5 6.5 0 0113 0"/>
        </svg>
        <span class="hidden sm:inline max-w-[10rem] truncate">{{ displayName }}</span>
      </span>
      <button
        @click="handleSignOut"
        :disabled="signingOut"
        class="flex items-center justify-center h-6 min-w-[24px] px-1.5 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
        :title="t.account.signOut"
        :aria-label="t.account.signOut"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useI18n } from '../../composables/useI18n'

const { user, ready, signOut } = useAuth()
const { t } = useI18n()

const signingOut = ref(false)

// Mirrors AuthForm.vue's `?redirect=` convention so signing in from anywhere
// in the chrome returns the user to the page they were on. StatusBar is
// mounted client:only, so `window` is always available here.
const signInHref = typeof window !== 'undefined'
  ? `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`
  : '/login'

const displayName = computed(() => {
  const meta = user.value?.user_metadata as Record<string, string> | undefined
  return meta?.name || meta?.user_name || meta?.full_name || user.value?.email?.split('@')[0] || ''
})

async function handleSignOut() {
  signingOut.value = true
  await signOut()
  window.location.reload()
}
</script>
