<template>
  <!-- Auth gate overlay — hidden once admin is confirmed -->
  <div
    v-if="gateState !== 'ready'"
    class="fixed inset-0 z-50 flex items-center justify-center bg-[#f8f7f4] dark:bg-gray-950"
  >
    <!-- Loading -->
    <div v-if="gateState === 'loading'" class="text-sm font-mono text-neutral-400 dark:text-gray-500">
      {{ t.events.admin.loading }}
    </div>

    <!-- Sign-in form -->
    <div v-else-if="gateState === 'unauthenticated'" class="w-full max-w-sm px-8">
      <div class="mb-6">
        <div class="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-gray-500 mb-1">
          SE Lab · Presentation
        </div>
        <h1 class="font-serif text-2xl font-bold text-primary dark:text-gray-100">
          {{ t.events.presentation.signInToView }}
        </h1>
      </div>

      <form @submit.prevent="handleSignIn" class="space-y-4">
        <div v-if="signInError" class="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-mono">
          {{ signInError }}
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
            {{ t.events.auth.emailLabel }}
          </label>
          <input
            v-model="signInForm.email"
            type="email"
            required
            :placeholder="t.events.auth.emailPlaceholder"
            class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 placeholder-neutral-400 dark:placeholder-gray-600 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label class="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-gray-500 mb-1.5">
            {{ t.events.auth.passwordLabel }}
          </label>
          <input
            v-model="signInForm.password"
            type="password"
            required
            :placeholder="t.events.auth.passwordPlaceholder"
            class="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-gray-900 border border-primary/20 dark:border-gray-600 text-primary dark:text-gray-100 focus:outline-none focus:border-accent dark:focus:border-accent transition-colors"
          />
        </div>
        <button
          type="submit"
          :disabled="signingIn"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="signingIn" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
          {{ signingIn ? t.events.auth.submittingLogin : t.events.auth.loginBtn }}
        </button>
      </form>
    </div>

    <!-- Unauthorized -->
    <div v-else-if="gateState === 'unauthorized'" class="max-w-sm px-8 text-center">
      <div class="mb-4 text-4xl">🔒</div>
      <p class="text-sm font-mono text-red-600 dark:text-red-400 mb-4">
        {{ t.events.presentation.adminOnly }}
      </p>
      <button
        @click="handleSignOut"
        class="text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors underline"
      >
        {{ t.events.admin.signOut }}
      </button>
    </div>

    <!-- Boot error -->
    <div v-else-if="gateState === 'error'" class="max-w-sm px-8 text-center">
      <p class="text-sm font-mono text-red-600 dark:text-red-400 mb-4">
        {{ t.events.presentation.bootError }}
      </p>
      <button
        @click="() => location.reload()"
        class="text-xs font-mono text-primary/40 dark:text-gray-500 hover:text-primary dark:hover:text-gray-100 transition-colors underline"
      >
        Reload
      </button>
    </div>
  </div>

  <!-- Hint bar — floats above the reveal deck once authorized -->
  <div
    v-if="gateState === 'ready'"
    class="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-1.5 bg-black/60 text-white text-[11px] font-mono select-none"
  >
    <span class="opacity-60">{{ presentationTitle }}</span>
    <div class="flex items-center gap-4 opacity-60">
      <span>{{ t.events.presentation.speakerViewHint }}</span>
      <button @click="downloadPdf" class="hover:opacity-100 transition-opacity underline">
        {{ t.events.presentation.downloadPdf }}
      </button>
      <button @click="handleSignOut" class="hover:opacity-100 transition-opacity">
        {{ t.events.admin.signOut }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { supabase } from '../lib/supabase'
// Static imports so Vite emits these CSS files and links them in <head> —
// dynamic CSS imports inside client:load islands are not reliably served by GitHub Pages.
import 'reveal.js/reveal.css'
import 'reveal.js/plugin/highlight/monokai.css'
import '../styles/presentation.css'

const props = defineProps<{
  presentationSlug: string
  presentationTitle: string
  theme: 'auto' | 'light' | 'dark'
}>()

const { t } = useI18n()

type GateState = 'loading' | 'unauthenticated' | 'unauthorized' | 'ready' | 'error'

const gateState = ref<GateState>('loading')
const signingIn = ref(false)
const signInError = ref('')
const signInForm = reactive({ email: '', password: '' })

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    gateState.value = 'unauthenticated'
    return
  }
  await checkRoleAndLoad(user.id)
})

async function checkRoleAndLoad(userId: string) {
  const { data: profile } = await supabase
    .schema('se')
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (!profile || profile.role !== 'admin') {
    gateState.value = 'unauthorized'
    return
  }

  await bootReveal()
}

async function bootReveal() {
  try {
    // Apply forced theme class when not auto
    if (props.theme === 'light') {
      document.documentElement.classList.add('theme-light')
      document.documentElement.classList.remove('theme-dark')
    } else if (props.theme === 'dark') {
      document.documentElement.classList.add('theme-dark')
      document.documentElement.classList.remove('theme-light', 'dark')
    }

    // Reveal the slides container (was hidden to prevent flash before auth)
    const revealEl = document.querySelector('.reveal') as HTMLElement | null
    if (revealEl) revealEl.removeAttribute('hidden')

    // Dynamically import reveal + plugins (lazy-load the engine for admins only)
    const [
      { default: Reveal },
      { default: Markdown },
      { default: Notes },
      { default: Highlight },
    ] = await Promise.all([
      import('reveal.js'),
      import('reveal.js/plugin/markdown'),
      import('reveal.js/plugin/notes'),
      import('reveal.js/plugin/highlight'),
    ])

    const deck = new (Reveal as any)(revealEl!, {
      plugins: [Markdown, Notes, Highlight],
      hash: true,
      slideNumber: 'c/t',
      progress: true,
      controls: true,
      center: false,
      transition: 'slide',
      transitionSpeed: 'fast',
      ...(location.search.includes('print-pdf') ? { view: 'print' } : {}),
    })

    await deck.initialize()
    gateState.value = 'ready'
  } catch (err) {
    console.error('[PresentationGate] bootReveal failed:', err)
    gateState.value = 'error'
  }
}

async function handleSignIn() {
  signingIn.value = true
  signInError.value = ''

  const { data, error } = await supabase.auth.signInWithPassword({
    email: signInForm.email.trim().toLowerCase(),
    password: signInForm.password,
  })

  signingIn.value = false

  if (error || !data.user) {
    signInError.value = error?.message ?? t.value.events.auth.loginError
    return
  }

  await checkRoleAndLoad(data.user.id)
}

async function handleSignOut() {
  await supabase.auth.signOut()
  gateState.value = 'unauthenticated'
  signInForm.email = ''
  signInForm.password = ''
}

function downloadPdf() {
  const url = new URL(location.href)
  url.searchParams.set('print-pdf', '')
  location.href = url.href
}
</script>
