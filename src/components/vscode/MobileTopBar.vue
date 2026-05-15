<template>
  <div
    class="lg:hidden flex items-center justify-between px-4 flex-shrink-0"
    style="height: 40px; background: #002D6B;"
  >
    <!-- Hamburger -->
    <button
      @click="toggleSidebar"
      class="flex items-center justify-center w-8 h-8 text-white/60 hover:text-white transition-colors"
      :aria-expanded="sidebarOpen"
      aria-controls="vscode-sidebar"
      aria-label="Toggle navigation"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    <!-- Logo -->
    <span class="font-mono text-[11px] tracking-[0.2em] text-white/50 select-none">
      { SE Lab }
    </span>

    <!-- Language toggle -->
    <button
      @click="toggleLang"
      class="text-[11px] font-mono text-white/60 hover:text-white transition-colors uppercase tracking-wider font-medium"
      :title="`Switch to ${lang === 'en' ? 'Bahasa Indonesia' : 'English'}`"
    >
      {{ lang === 'en' ? 'EN' : 'ID' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'
import { useI18n } from '../../composables/useI18n'

const { sidebarOpen, toggleSidebar } = useVSCodeLayout()
const { lang, toggleLang } = useI18n()
</script>
