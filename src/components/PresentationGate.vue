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

    <!-- Sign-in -->
    <div v-else-if="gateState === 'unauthenticated'" class="w-full max-w-sm px-8">
      <div class="mb-6">
        <div class="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-gray-500 mb-1">
          SE Lab · Presentation
        </div>
        <h1 class="font-serif text-2xl font-bold text-primary dark:text-gray-100">
          {{ t.events.presentation.signInToView }}
        </h1>
      </div>

      <GitHubSignInButton />
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
import { ref, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { supabase } from '../lib/supabase'
import GitHubSignInButton from './GitHubSignInButton.vue'
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

async function handleSignOut() {
  await supabase.auth.signOut()
  gateState.value = 'unauthenticated'
}

function downloadPdf() {
  const url = new URL(location.href)
  url.searchParams.set('print-pdf', '')
  location.href = url.href
}
</script>
