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
        class="flex items-center gap-1.5 px-2 h-6 text-[11px] font-mono text-[color:var(--color-vscode-statusbar-fg)] font-medium hover:bg-[color:var(--color-vscode-statusbar-border)] transition-colors"
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

      <span class="w-px h-3.5 bg-[color:var(--color-vscode-statusbar-border)] mx-1" />

      <!-- Branch -->
      <span class="flex items-center gap-1 px-1 text-[11px] font-mono text-[color:var(--color-vscode-statusbar-fg)] font-medium">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="6" y1="3" x2="6" y2="15"/>
          <circle cx="18" cy="6" r="3"/>
          <circle cx="6" cy="18" r="3"/>
          <path d="M18 9a9 9 0 01-9 9"/>
        </svg>
        main
      </span>

      <span class="w-px h-3.5 bg-[color:var(--color-vscode-statusbar-border)] mx-1" />

      <!-- Account / Sign In -->
      <AccountStatusItem />

      <span class="w-px h-3.5 bg-[color:var(--color-vscode-statusbar-border)] mx-1" />
      <span class="hidden sm:inline text-[11px] font-mono text-[color:var(--color-vscode-statusbar-fg-muted)] whitespace-nowrap">
        &copy; {{ new Date().getFullYear() }} {{ t.footer.copyright }}
      </span>
    </div>

    <!-- Center: institution -->
    <span class="hidden sm:block text-[11px] font-mono text-[color:var(--color-vscode-statusbar-fg-muted)] truncate mx-4">
      Jurusan Teknologi Informasi — Politeknik Negeri Malang
    </span>

    <!-- Right: theme toggle + language toggle + encoding -->
    <div class="flex items-center gap-0">
      <!-- Theme toggle -->
      <button
        @click="toggleTheme"
        class="flex items-center justify-center h-6 min-w-[28px] px-1.5 text-[11px] font-mono text-[color:var(--color-vscode-statusbar-fg)] font-semibold hover:bg-[color:var(--color-vscode-statusbar-border)] transition-colors"
        :title="theme === 'dark' ? t.theme.switchToLight : t.theme.switchToDark"
        :aria-label="theme === 'dark' ? t.theme.switchToLight : t.theme.switchToDark"
      >
        <!--
          v-show, not v-if/v-else: `theme` is seeded from localStorage at
          module-init (useTheme.ts), which is client-only info a static
          build can never bake into SSR HTML. Under client:load hydration,
          a v-if/v-else element swap here would be a structural mismatch
          for any visitor whose stored theme differs from the SSR default,
          which misaligns Vue's hydration walk for this button's later
          siblings (language/palette toggles) too — v-show keeps both
          icons always present so only a display style toggles, never the
          element structure.
        -->
        <svg v-show="theme === 'dark'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        <svg v-show="theme !== 'dark'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </button>

      <span class="w-px h-3.5 bg-[color:var(--color-vscode-statusbar-border)]" />

      <!-- Language toggle -->
      <button
        @click="toggleLang"
        class="flex items-center justify-center h-6 min-w-[28px] px-1.5 text-[11px] font-mono text-[color:var(--color-vscode-statusbar-fg)] font-semibold hover:bg-[color:var(--color-vscode-statusbar-border)] transition-colors uppercase tracking-wider"
        :title="`Switch to ${lang === 'en' ? 'Bahasa Indonesia' : 'English'}`"
        :aria-label="lang === 'en' ? 'Switch to Indonesian' : 'Beralih ke Inggris'"
      >
        {{ lang === 'en' ? 'EN' : 'ID' }}
      </button>

      <span class="w-px h-3.5 bg-[color:var(--color-vscode-statusbar-border)]" />

      <span class="text-[11px] font-mono text-[color:var(--color-vscode-statusbar-fg-muted)] ml-1">UTF-8</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'
import { useI18n } from '../../composables/useI18n'
import { useTheme } from '../../composables/useTheme'
import AccountStatusItem from './AccountStatusItem.vue'

const { panelOpen, togglePanel } = useVSCodeLayout()
const { lang, t, toggleLang } = useI18n()
const { theme, toggleTheme } = useTheme()
</script>
