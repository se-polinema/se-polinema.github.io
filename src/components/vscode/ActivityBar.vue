<template>
  <aside
    class="relative z-30 flex flex-col items-center py-2 flex-shrink-0 pointer-events-auto"
    style="width: 48px; background: var(--color-vscode-activitybar);"
    aria-label="Activity Bar"
  >
    <!-- Scrolls independently (min-h-0 lets it actually shrink instead of
         forcing the aside to overflow) so a short viewport clips nothing;
         the bottom account/command-palette/language group stays pinned via
         mt-auto below, matching real VS Code's own activity bar behavior
         when there are more icons than vertical space. -->
    <nav class="flex flex-col items-center flex-1 w-full overflow-y-auto min-h-0">
      <!-- Explorer -->
      <button
        @click="setView('explorer')"
        class="activity-btn"
        :class="activeSidebarView === 'explorer' ? 'activity-active' : 'activity-inactive'"
        title="Explorer"
        aria-label="Open Explorer"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
          <polyline points="13 2 13 9 20 9"/>
        </svg>
      </button>

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

      <!-- News & Blog -->
      <button
        @click="setView('blog')"
        class="activity-btn"
        :class="activeSidebarView === 'blog' ? 'activity-active' : 'activity-inactive'"
        title="Blog"
        aria-label="Open blog archive"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 11a9 9 0 0 1 9 9"/>
          <path d="M4 4a16 16 0 0 1 16 16"/>
          <circle cx="5" cy="19" r="1"/>
        </svg>
      </button>

      <!-- Events -->
      <button
        @click="setView('events')"
        class="activity-btn"
        :class="activeSidebarView === 'events' ? 'activity-active' : 'activity-inactive'"
        title="Events"
        aria-label="Open events calendar"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>

      <!-- Source Control / GitHub -->
      <button
        @click="setView('github')"
        class="activity-btn"
        :class="activeSidebarView === 'github' ? 'activity-active' : 'activity-inactive'"
        title="Source Control"
        aria-label="Open GitHub repository info"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="6" y1="3" x2="6" y2="15"/>
          <circle cx="18" cy="6" r="3"/>
          <circle cx="6" cy="18" r="3"/>
          <path d="M18 9a9 9 0 01-9 9"/>
        </svg>
      </button>

      <!-- Members -->
      <button
        @click="setView('members')"
        class="activity-btn"
        :class="activeSidebarView === 'members' ? 'activity-active' : 'activity-inactive'"
        title="Members"
        aria-label="Open researchers, students, and alumni directory"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10L12 5 2 10l10 5 10-5v6"/>
          <path d="M6 12v5c3 1.5 9 1.5 12 0v-5"/>
        </svg>
      </button>

      <!-- Publications -->
      <button
        @click="setView('publications')"
        class="activity-btn"
        :class="activeSidebarView === 'publications' ? 'activity-active' : 'activity-inactive'"
        title="Publications"
        aria-label="Open publications archive"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        </svg>
      </button>

      <!-- Achievements -->
      <button
        @click="setView('achievements')"
        class="activity-btn"
        :class="activeSidebarView === 'achievements' ? 'activity-active' : 'activity-inactive'"
        title="Achievements"
        aria-label="Open achievements archive"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="7"/>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
        </svg>
      </button>

      <!-- Decks -->
      <button
        @click="setView('decks')"
        class="activity-btn"
        :class="activeSidebarView === 'decks' ? 'activity-active' : 'activity-inactive'"
        title="Decks"
        aria-label="Open presentation decks"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
        </svg>
      </button>
    </nav>

    <!-- Bottom: account + command palette + language toggle -->
    <div class="mt-auto mb-2 w-full">
      <a
        :href="accountHref"
        class="activity-btn activity-inactive"
        :title="accountTitle"
        :aria-label="accountTitle"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="7" r="4"/>
          <path d="M5.5 21a6.5 6.5 0 0113 0"/>
        </svg>
      </a>
      <button
        @click="openCommandPalette"
        class="activity-btn activity-inactive"
        title="Command Palette (Ctrl+Shift+P)"
        aria-label="Open command palette"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      </button>
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
import { computed, onMounted, ref } from 'vue'
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'
import { useI18n } from '../../composables/useI18n'
import { useAuth } from '../../composables/useAuth'

const props = defineProps<{ initialPath?: string }>()

const { activeSidebarView, setView, restoreRouteState } = useVSCodeLayout(props.initialPath)
const { lang, t, toggleLang } = useI18n()
const { user } = useAuth()

// Mirrors AccountStatusItem.vue's signInHref/accountLabel logic: same
// module-singleton useAuth() instance, so this always agrees with the
// StatusBar's own account item. Unlike that component (which gates its
// whole signed-out branch behind `ready`, so it's always a fresh mount,
// never a hydration patch), this icon is always rendered, no `ready`
// gate, to avoid the icon rail shifting as it appears/disappears. That
// means the redirect path can't be read from `window.location` directly
// in a computed: Vue's hydration doesn't rectify attribute mismatches in
// production, so an SSR-vs-client `href` difference would silently keep
// the stale SSR value. Seed a safe SSR default ('') and correct it in
// onMounted instead: a normal reactive update after hydration, which
// does patch the DOM, same discipline used throughout this codebase for
// window-dependent state (see useVSCodeLayout.ts's restorePanelState()).
const redirectPath = ref('')

const accountHref = computed(() => {
  if (user.value) return '/account'
  return redirectPath.value ? `/login?redirect=${encodeURIComponent(redirectPath.value)}` : '/login'
})

const accountTitle = computed(() =>
  user.value ? t.value.account.accountLabel : t.value.account.signIn
)

function openSearch() {
  window.dispatchEvent(new CustomEvent('se-lab-open-search'))
}

function openCommandPalette() {
  window.dispatchEvent(new CustomEvent('se-lab-open-command-palette'))
}

onMounted(() => {
  restoreRouteState()
  redirectPath.value = window.location.pathname + window.location.search
})
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
  color: var(--color-vscode-chrome-fg);
  border-left-color: var(--color-accent);
}
.activity-inactive {
  color: var(--color-vscode-chrome-fg-muted);
}
.activity-inactive:hover {
  color: var(--color-vscode-chrome-fg);
}
</style>
