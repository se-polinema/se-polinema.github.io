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

      <span class="w-px h-3.5 bg-primary/20 mx-1" />
      <span class="hidden sm:inline text-[11px] font-mono text-primary/55 whitespace-nowrap">
        &copy; {{ new Date().getFullYear() }} {{ t.footer.copyright }}
      </span>
    </div>

    <!-- Center: institution -->
    <span class="hidden sm:block text-[11px] font-mono text-primary/70 truncate mx-4">
      Jurusan Teknologi Informasi — Politeknik Negeri Malang
    </span>

    <!-- Right: account + theme toggle + language toggle + encoding -->
    <div class="flex items-center gap-0">
      <!-- Account / Sign In -->
      <AccountStatusItem />

      <span class="w-px h-3.5 bg-primary/20" />

      <!-- Theme toggle -->
      <button
        @click="toggleTheme"
        class="flex items-center justify-center h-6 min-w-[28px] px-1.5 text-[11px] font-mono text-primary font-semibold hover:bg-primary/10 transition-colors"
        :title="theme === 'dark' ? t.theme.switchToLight : t.theme.switchToDark"
        :aria-label="theme === 'dark' ? t.theme.switchToLight : t.theme.switchToDark"
      >
        <svg v-if="theme === 'dark'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </button>

      <span class="w-px h-3.5 bg-primary/20" />

      <!-- Language toggle -->
      <button
        @click="toggleLang"
        class="flex items-center justify-center h-6 min-w-[28px] px-1.5 text-[11px] font-mono text-primary font-semibold hover:bg-primary/10 transition-colors uppercase tracking-wider"
        :title="`Switch to ${lang === 'en' ? 'Bahasa Indonesia' : 'English'}`"
        :aria-label="lang === 'en' ? 'Switch to Indonesian' : 'Beralih ke Inggris'"
      >
        {{ lang === 'en' ? 'EN' : 'ID' }}
      </button>

      <span class="w-px h-3.5 bg-primary/20" />

      <!-- Palette switcher (discussion tool — cycles through candidate palettes) -->
      <button
        @click="cyclePalette"
        class="flex items-center gap-1 h-6 px-1.5 text-[11px] font-mono text-primary font-semibold hover:bg-primary/10 transition-colors capitalize"
        :title="`Palette: ${palette} — click to cycle`"
        :aria-label="`Switch color palette, current: ${palette}`"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="13.5" cy="6.5" r=".5"/>
          <circle cx="17.5" cy="10.5" r=".5"/>
          <circle cx="8.5" cy="7.5" r=".5"/>
          <circle cx="6.5" cy="12.5" r=".5"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        </svg>
        <span class="hidden md:inline">{{ palette }}</span>
      </button>

      <span class="text-[11px] font-mono text-primary/60 ml-1">UTF-8</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'
import { useI18n } from '../../composables/useI18n'
import { useTheme } from '../../composables/useTheme'
import { usePalette } from '../../composables/usePalette'
import AccountStatusItem from './AccountStatusItem.vue'

const { panelOpen, togglePanel } = useVSCodeLayout()
const { lang, t, toggleLang } = useI18n()
const { theme, toggleTheme } = useTheme()
const { palette, cyclePalette } = usePalette()
</script>
