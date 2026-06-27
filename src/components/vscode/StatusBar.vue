<template>
  <div
    class="flex items-center justify-between px-3 flex-shrink-0 select-none"
    style="height: 24px; background: var(--color-vscode-statusbar);"
    role="contentinfo"
    aria-label="Status Bar"
  >
    <!-- Left: git branch + panel toggle -->
    <div class="flex items-center gap-0">
      <!-- Panel toggle -->
      <button
        @click="togglePanel"
        class="flex items-center gap-1.5 px-2 h-6 text-[11px] font-mono text-primary font-medium hover:bg-primary/10 transition-colors"
        :title="panelOpen ? 'Close Panel' : 'Open Panel'"
        aria-label="Toggle bottom panel"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          class="transition-transform duration-200"
          :class="panelOpen ? 'rotate-180' : ''"
        >
          <polyline points="18 15 12 9 6 15"/>
        </svg>
        <span class="hidden sm:inline">Panel</span>
      </button>

      <span class="w-px h-3.5 bg-primary/20 mx-1" />

      <!-- Branch -->
      <span class="flex items-center gap-1 px-1 text-[11px] font-mono text-primary font-medium">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="6" y1="3" x2="6" y2="15"/>
          <circle cx="18" cy="6" r="3"/>
          <circle cx="6" cy="18" r="3"/>
          <path d="M18 9a9 9 0 01-9 9"/>
        </svg>
        main
      </span>
    </div>

    <!-- Center: institution -->
    <span class="hidden sm:block text-[11px] font-mono text-primary/70 truncate mx-4">
      Jurusan Teknologi Informasi — Politeknik Negeri Malang
    </span>

    <!-- Right: theme toggle + language toggle + encoding -->
    <div class="flex items-center gap-3">
      <ThemeToggle />
      <span class="w-px h-3.5 bg-primary/20" />
      <button
        @click="toggleLang"
        class="text-[11px] font-mono text-primary font-semibold hover:text-primary/60 transition-colors uppercase tracking-wider"
        :title="`Switch to ${lang === 'en' ? 'Bahasa Indonesia' : 'English'}`"
      >
        {{ lang === 'en' ? 'EN' : 'ID' }}
      </button>
      <span class="text-[11px] font-mono text-primary/60">UTF-8</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from '../ThemeToggle.vue'
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'
import { useI18n } from '../../composables/useI18n'

const { panelOpen, togglePanel } = useVSCodeLayout()
const { lang, toggleLang } = useI18n()
</script>
