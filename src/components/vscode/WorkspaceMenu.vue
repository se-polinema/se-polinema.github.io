<template>
  <div ref="rootEl" class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center justify-center w-5 h-5 text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)] transition-colors"
      :title="t.nav.menuLabel"
      :aria-label="t.nav.menuLabel"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      role="menu"
      class="absolute left-0 top-[calc(100%+4px)] z-50 min-w-[180px] py-1 text-[12px] font-mono"
      style="background: var(--color-vscode-overlay-bg); border: 1px solid var(--color-vscode-overlay-border); color: var(--color-vscode-overlay-fg);"
    >
      <a
        v-for="item in contentItems"
        :key="item.href"
        :href="withBase(item.href)"
        role="menuitem"
        class="menu-item block px-3 py-1.5"
        @click="isOpen = false"
      >
        {{ item.label }}
      </a>
      <div class="my-1 h-px" style="background: var(--color-vscode-overlay-border);" />
      <a
        v-for="item in utilityItems"
        :key="item.href"
        :href="withBase(item.href)"
        role="menuitem"
        class="menu-item block px-3 py-1.5"
        @click="isOpen = false"
      >
        {{ item.label }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { withBase } from '../../lib/paths'

const { t } = useI18n()
const isOpen = ref(false)
const rootEl = ref<HTMLElement | null>(null)

const contentItems = computed(() => [
  { label: t.value.nav.partners, href: '/partners' },
  { label: t.value.nav.resources, href: '/resources' },
  { label: t.value.nav.glossary, href: '/glossary' },
  { label: t.value.nav.faq, href: '/faq' },
  { label: t.value.nav.join, href: '/join' },
  { label: t.value.nav.contact, href: '/contact' },
  { label: t.value.nav.newsletter, href: '/newsletter' },
  { label: t.value.nav.privacy, href: '/privacy' },
])

const utilityItems = computed(() => [
  { label: t.value.nav.login, href: '/login' },
  { label: t.value.nav.register, href: '/register' },
  { label: t.value.nav.admin, href: '/admin' },
  { label: t.value.nav.checkin, href: '/checkin' },
])

function onDocumentClick(event: MouseEvent) {
  if (isOpen.value && rootEl.value && !rootEl.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.menu-item {
  color: var(--color-vscode-overlay-fg);
  white-space: nowrap;
  text-decoration: none;
}
.menu-item:hover {
  background: var(--color-vscode-overlay-hover);
}
</style>
