<template>
  <aside
    class="relative z-30 flex flex-col items-center py-2 flex-shrink-0 pointer-events-auto"
    style="width: 48px; background: var(--color-vscode-activitybar);"
    aria-label="Activity Bar"
  >
    <nav class="flex flex-col items-center flex-1 w-full">
      <!-- Search -->
      <button
        @click="openSearch"
        class="activity-btn"
        :class="'activity-inactive'"
        title="Search (Ctrl+K)"
        aria-label="Open search"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>

      <!-- Explorer -->
      <button
        @click="setView('explorer')"
        class="activity-btn"
        :class="activeSidebarView === 'explorer' ? 'activity-active' : 'activity-inactive'"
        title="Explorer"
        aria-label="Toggle Explorer"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
          <polyline points="13 2 13 9 20 9"/>
        </svg>
      </button>

      <!-- News & Blog -->
      <button
        @click="setView('blog')"
        class="activity-btn"
        :class="activeSidebarView === 'blog' ? 'activity-active' : 'activity-inactive'"
        title="News & Blog"
        aria-label="News and Blog"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>

      <!-- Source Control / GitHub -->
      <button
        @click="setView('github')"
        class="activity-btn"
        :class="activeSidebarView === 'github' ? 'activity-active' : 'activity-inactive'"
        title="Source Control"
        aria-label="GitHub repository info"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="6" y1="3" x2="6" y2="15"/>
          <circle cx="18" cy="6" r="3"/>
          <circle cx="6" cy="18" r="3"/>
          <path d="M18 9a9 9 0 01-9 9"/>
        </svg>
      </button>

      <!-- Researchers -->
      <button
        @click="setView('researchers')"
        class="activity-btn"
        :class="activeSidebarView === 'researchers' ? 'activity-active' : 'activity-inactive'"
        title="Researchers"
        aria-label="Researchers directory"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      </button>

      <!-- Publications -->
      <button
        @click="setView('publications')"
        class="activity-btn"
        :class="activeSidebarView === 'publications' ? 'activity-active' : 'activity-inactive'"
        title="Publications"
        aria-label="Publications archive"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        </svg>
      </button>

      <!-- Decks -->
      <button
        @click="setView('decks')"
        class="activity-btn"
        :class="activeSidebarView === 'decks' ? 'activity-active' : 'activity-inactive'"
        title="Decks"
        aria-label="Presentation decks"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
        </svg>
      </button>
    </nav>

    <!-- Bottom: language toggle -->
    <div class="mt-auto mb-2 w-full">
      <button
        @click="toggleLang"
        class="activity-btn activity-inactive"
        :title="`Switch to ${lang === 'en' ? 'Bahasa Indonesia' : 'English'}`"
        aria-label="Toggle language"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'
import { useI18n } from '../../composables/useI18n'

const { activeSidebarView, setView } = useVSCodeLayout()
const { lang, toggleLang } = useI18n()

function openSearch() {
  window.dispatchEvent(new CustomEvent('se-lab-open-search'))
}
</script>

<style scoped>
.activity-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  width: 48px;
  height: 48px;
  transition: color 0.15s ease;
  border-left: 2px solid transparent;
  flex-shrink: 0;
  pointer-events: auto;
  cursor: pointer;
}
.activity-active {
  color: rgba(255, 255, 255, 0.95);
  border-left-color: #F5A100;
}
.activity-inactive {
  color: rgba(255, 255, 255, 0.35);
}
.activity-inactive:hover {
  color: rgba(255, 255, 255, 0.8);
}
</style>
