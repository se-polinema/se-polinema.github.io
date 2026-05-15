<template>
  <nav
    class="lg:hidden flex items-center justify-around flex-shrink-0"
    style="height: 52px; background: #002D6B; border-top: 1px solid rgba(255,255,255,0.08);"
    aria-label="Mobile navigation"
  >
    <!-- Home / Explorer -->
    <a
      href="/"
      class="mobile-btn"
      :class="currentPage === 'home' ? 'mobile-active' : 'mobile-inactive'"
      aria-label="Home"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
        <polyline points="13 2 13 9 20 9"/>
      </svg>
    </a>

    <!-- Blog / News -->
    <a
      href="/blog"
      class="mobile-btn"
      :class="currentPage === 'news' ? 'mobile-active' : 'mobile-inactive'"
      aria-label="News and Blog"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </a>

    <!-- Researchers -->
    <a
      href="/researchers"
      class="mobile-btn"
      :class="currentPage === 'researchers' ? 'mobile-active' : 'mobile-inactive'"
      aria-label="Researchers"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    </a>

    <!-- Publications -->
    <a
      href="/publications"
      class="mobile-btn"
      :class="currentPage === 'publications' ? 'mobile-active' : 'mobile-inactive'"
      aria-label="Publications"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    </a>

    <!-- Source Control / GitHub panel -->
    <button
      @click="setView('github')"
      class="mobile-btn"
      :class="activeSidebarView === 'github' && sidebarOpen ? 'mobile-active' : 'mobile-inactive'"
      aria-label="Source Control"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="6" y1="3" x2="6" y2="15"/>
        <circle cx="18" cy="6" r="3"/>
        <circle cx="6" cy="18" r="3"/>
        <path d="M18 9a9 9 0 01-9 9"/>
      </svg>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'

const { currentPage, activeSidebarView, sidebarOpen, setView } = useVSCodeLayout()
</script>

<style scoped>
.mobile-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 52px;
  transition: color 0.15s ease;
  border-top: 2px solid transparent;
}
.mobile-active {
  color: rgba(255, 255, 255, 0.95);
  border-top-color: #F5A100;
}
.mobile-inactive {
  color: rgba(255, 255, 255, 0.35);
}
.mobile-inactive:hover,
.mobile-inactive:active {
  color: rgba(255, 255, 255, 0.75);
}
</style>
