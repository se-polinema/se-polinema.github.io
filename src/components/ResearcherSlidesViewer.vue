<template>
  <!-- Hint bar — floats above the reveal deck (public, no auth gate) -->
  <div
    class="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-1.5 bg-black/60 text-white text-[11px] font-mono select-none"
  >
    <span class="opacity-60">{{ title }}</span>
    <div class="flex items-center gap-4 opacity-60">
      <span class="hidden sm:inline">{{ t.events.presentation.speakerViewHint }}</span>
      <button @click="downloadPdf" class="hover:opacity-100 transition-opacity underline">
        {{ t.events.presentation.downloadPdf }}
      </button>
      <a :href="backUrl" class="hover:opacity-100 transition-opacity underline">
        {{ t.team.backToProfile }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
// Static imports so Vite emits these CSS files and links them in <head> —
// dynamic CSS imports inside client:load islands are not reliably served by GitHub Pages.
import 'reveal.js/reveal.css'
import 'reveal.js/plugin/highlight/monokai.css'
import '../styles/presentation.css'

const props = defineProps<{
  title: string
  theme: 'auto' | 'light' | 'dark'
  backUrl: string
}>()

const { t } = useI18n()

onMounted(async () => {
  try {
    // Apply forced theme class when not auto (auto follows site dark mode)
    if (props.theme === 'light') {
      document.documentElement.classList.add('theme-light')
      document.documentElement.classList.remove('theme-dark')
    } else if (props.theme === 'dark') {
      document.documentElement.classList.add('theme-dark')
      document.documentElement.classList.remove('theme-light', 'dark')
    }

    // Reveal the slides container (hidden to prevent flash before reveal boots)
    const revealEl = document.querySelector('.reveal') as HTMLElement | null
    if (revealEl) revealEl.removeAttribute('hidden')

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
  } catch (err) {
    console.error('[ResearcherSlidesViewer] boot failed:', err)
    const revealEl = document.querySelector('.reveal') as HTMLElement | null
    if (revealEl) revealEl.removeAttribute('hidden')
  }
})

function downloadPdf() {
  const url = new URL(location.href)
  url.searchParams.set('print-pdf', '')
  location.href = url.href
}
</script>
