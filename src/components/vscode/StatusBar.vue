<template>
  <div
    class="flex items-center justify-between px-3 flex-shrink-0 select-none"
    style="height: 24px; background: #F5A100;"
    role="contentinfo"
    aria-label="Status Bar"
  >
    <!-- Left: git branch -->
    <div class="flex items-center gap-3">
      <span class="flex items-center gap-1 text-[11px] font-mono text-primary font-medium">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="6" y1="3" x2="6" y2="15"/>
          <circle cx="18" cy="6" r="3"/>
          <circle cx="6" cy="18" r="3"/>
          <path d="M18 9a9 9 0 01-9 9"/>
        </svg>
        main
      </span>
    </div>

    <!-- Center: institution (hidden on small screens) -->
    <span class="hidden sm:block text-[11px] font-mono text-primary/70 truncate mx-4">
      Jurusan Teknologi Informasi — Politeknik Negeri Malang
    </span>

    <!-- Right: language toggle + encoding -->
    <div class="flex items-center gap-3">
      <button
        @click="toggleLang"
        class="text-[11px] font-mono text-primary font-semibold hover:text-primary/70 transition-colors uppercase tracking-wider"
        :title="`Switch to ${lang === 'en' ? 'Bahasa Indonesia' : 'English'}`"
      >
        {{ lang === 'en' ? 'EN' : 'ID' }}
      </button>
      <span class="text-[11px] font-mono text-primary/60">UTF-8</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'

const { lang, toggleLang } = useI18n()
</script>
