<template>
  <div
    class="relative flex-shrink-0 overflow-hidden flex flex-col"
    :class="isResizing ? '' : 'transition-[height] duration-200'"
    :style="{ height: panelOpen ? panelHeight + 'px' : '0px' }"
    style="background: var(--color-vscode-panel); border-top: 1px solid var(--color-vscode-chrome-border);"
    aria-label="Panel"
  >
    <!-- Resize handle: flush with the inner top edge -->
    <div
      v-if="panelOpen"
      class="panel-resize-handle"
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize panel"
      :aria-valuenow="panelHeight"
      aria-valuemin="80"
      :aria-valuemax="panelMaxHeight()"
      tabindex="0"
      @pointerdown="onResizePointerDown"
      @keydown="onResizeKeydown"
    />

    <!-- Panel tab bar -->
    <div
      class="flex items-center flex-shrink-0"
      style="height: 35px; background: var(--color-vscode-panel-tab); border-bottom: 1px solid var(--color-vscode-chrome-border);"
      role="tablist"
      :aria-label="'Panel tabs'"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="openPanel(tab.id)"
        @keydown="onTabKeydown($event, tab.id)"
        class="h-full px-4 text-[11px] font-mono uppercase tracking-wider border-t-2 transition-colors duration-100"
        :class="activePanelTab === tab.id
          ? 'text-[color:var(--color-vscode-chrome-fg)] border-t-accent'
          : 'text-[color:var(--color-vscode-chrome-fg-muted)] border-transparent hover:text-[color:var(--color-vscode-chrome-fg)]'"
        role="tab"
        :aria-selected="activePanelTab === tab.id"
        :aria-controls="`panel-body-${tab.id}`"
        :id="`panel-tab-${tab.id}`"
        :tabindex="activePanelTab === tab.id ? 0 : -1"
      >
        {{ tab.label }}
      </button>

      <div class="flex-1" />

      <!-- Close -->
      <button
        @click="togglePanel"
        class="w-9 h-full flex items-center justify-center text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)] transition-colors"
        aria-label="Close panel"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </div>

    <!-- Panel body -->
    <div class="flex-1 overflow-y-auto font-mono text-xs leading-relaxed">

      <!-- CONTACT -->
      <div
        v-show="activePanelTab === 'contact'"
        class="p-5 space-y-4"
        role="tabpanel"
        :id="`panel-body-contact`"
        :aria-labelledby="`panel-tab-contact`"
      >
        <div>
          <p class="text-[color:var(--color-vscode-chrome-fg-muted)] mb-2">// {{ t.contact.affiliation }}</p>
          <p>
            <span class="text-[#9CDCFE]">"address"</span>
            <span class="text-[color:var(--color-vscode-chrome-fg-muted)]">: </span>
            <span class="text-[#CE9178]">"{{ t.contact.address }}"</span>
          </p>
          <p class="mt-1">
            <span class="text-[#9CDCFE]">"email"</span>
            <span class="text-[color:var(--color-vscode-chrome-fg-muted)]">: </span>
            <span class="text-[color:var(--color-vscode-chrome-fg-muted)]">"</span><ObfuscatedEmail :encoded="LAB_EMAIL_ENCODED" class="text-[#CE9178] hover:text-accent transition-colors" /><span class="text-[color:var(--color-vscode-chrome-fg-muted)]">"</span>
          </p>
        </div>


      </div>

      <!-- OUTPUT -->
      <div
        v-show="activePanelTab === 'output'"
        class="p-5 space-y-1"
        role="tabpanel"
        :id="`panel-body-output`"
        :aria-labelledby="`panel-tab-output`"
      >
        <p class="text-[color:var(--color-vscode-chrome-fg-muted)]">[SE Lab] {{ t.panel.outputInit }}</p>
        <template v-if="stats">
          <p>
            <span class="text-[#98C379]">[INFO]</span>
            <span class="text-[color:var(--color-vscode-chrome-fg-muted)] ml-2">{{ t.panel.outputResearchers }}</span>
            <span class="text-[#98C379] ml-1">{{ stats.researchers }} active</span>
          </p>
          <p>
            <span class="text-[#98C379]">[INFO]</span>
            <span class="text-[color:var(--color-vscode-chrome-fg-muted)] ml-2">{{ t.panel.outputFocusAreas }}</span>
            <span class="text-[#98C379] ml-1">{{ stats.focusAreas }}</span>
          </p>
          <p>
            <span class="text-[#98C379]">[INFO]</span>
            <span class="text-[color:var(--color-vscode-chrome-fg-muted)] ml-2">{{ t.panel.outputPublications }}</span>
            <span class="text-[#98C379] ml-1">{{ stats.publications }}</span>
          </p>
          <p>
            <span class="text-[#98C379]">[INFO]</span>
            <span class="text-[color:var(--color-vscode-chrome-fg-muted)] ml-2">{{ t.panel.outputProjects }}</span>
            <span class="text-[#98C379] ml-1">{{ stats.projects }}</span>
          </p>
          <p>
            <span class="text-[#98C379]">[INFO]</span>
            <span class="text-[color:var(--color-vscode-chrome-fg-muted)] ml-2">{{ t.panel.outputBooks }}</span>
            <span class="text-[#98C379] ml-1">{{ stats.books }}</span>
          </p>
          <p>
            <span class="text-[#98C379]">[INFO]</span>
            <span class="text-[color:var(--color-vscode-chrome-fg-muted)] ml-2">{{ t.panel.outputDept }}</span>
            <span class="text-[color:var(--color-vscode-chrome-fg-muted)] ml-1">Jurusan Teknologi Informasi</span>
          </p>
          <p>
            <span class="text-[#98C379]">[INFO]</span>
            <span class="text-[color:var(--color-vscode-chrome-fg-muted)] ml-2">{{ t.panel.outputInst }}</span>
            <span class="text-[color:var(--color-vscode-chrome-fg-muted)] ml-1">Politeknik Negeri Malang</span>
          </p>
          <p v-if="lastUpdated" class="text-[color:var(--color-vscode-chrome-fg-muted)]">
            {{ t.panel.outputLastUpdated }} {{ lastUpdated }}
          </p>
          <p class="pt-1">
            <span class="text-accent">[SUCCESS]</span>
            <span class="text-[color:var(--color-vscode-chrome-fg-muted)] ml-2">{{ t.panel.outputReady }}</span>
          </p>
        </template>
        <template v-else>
          <p class="text-[color:var(--color-vscode-chrome-fg-muted)]">{{ t.panel.outputInit }}</p>
        </template>
        <p class="text-accent/60 animate-pulse select-none">▌</p>
      </div>

      <!-- QUICK LINKS -->
      <div
        v-show="activePanelTab === 'quickLinks'"
        class="p-3 @container"
        role="tabpanel"
        :id="`panel-body-quickLinks`"
        :aria-labelledby="`panel-tab-quickLinks`"
      >
        <div class="grid grid-cols-2 @sm:grid-cols-3 gap-1">
          <a
            v-for="link in quickLinks"
            :key="link.href"
            :href="withBase(link.href)"
            class="flex items-center gap-2 px-2 py-1.5 rounded text-[11.5px] text-[color:var(--color-vscode-chrome-fg-muted)] hover:text-[color:var(--color-vscode-chrome-fg)] hover:bg-[color:var(--color-vscode-chrome-border)] transition-colors leading-relaxed"
          >
            <svg
              width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
              class="flex-shrink-0 text-accent/70"
            >
              <polyline points="9 6 15 12 9 18"/>
            </svg>
            <span class="truncate">{{ link.label }}</span>
          </a>
        </div>
      </div>

      <!-- NEWSLETTER -->
      <div
        v-show="activePanelTab === 'newsletter'"
        class="p-4"
        role="tabpanel"
        :id="`panel-body-newsletter`"
        :aria-labelledby="`panel-tab-newsletter`"
      >
        <h4 class="font-mono text-[12px] text-[color:var(--color-vscode-chrome-fg)] mb-1">{{ t.newsletter.heading }}</h4>
        <p class="font-mono text-[11px] text-[color:var(--color-vscode-chrome-fg-muted)] leading-relaxed mb-3">{{ t.newsletter.description }}</p>
        <NewsletterForm compact :showInterests="false" :minimal="true" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'
import { useI18n } from '../../composables/useI18n'
import { useDragResize } from '../../composables/useDragResize'
import { withBase } from '../../lib/paths'
import NewsletterForm from '../NewsletterForm.vue'
import ObfuscatedEmail from '../ObfuscatedEmail.vue'
import { LAB_EMAIL_ENCODED } from '../../utils/email'

const {
  panelOpen, activePanelTab, panelHeight,
  togglePanel, openPanel, restorePanelState,
  setPanelHeight, persistPanelHeight, panelMaxHeight,
} = useVSCodeLayout()
const { t } = useI18n()

const {
  dragging: isResizing,
  onPointerDown: onResizePointerDown,
  onKeydown: onResizeKeydown,
} = useDragResize(() => panelHeight.value, {
  axis: 'y',
  min: 80,
  max: panelMaxHeight,
  invert: true,
  onChange: setPanelHeight,
  onCommit: persistPanelHeight,
})

interface Stats {
  researchers: number
  publications: number
  projects: number
  books: number
  focusAreas: number
}

const stats = ref<Stats | null>(null)
const lastUpdated = ref<string | null>(null)

const tabs = [
  { id: 'contact'    as const, get label() { return t.value.panel.contact    } },
  { id: 'output'     as const, get label() { return t.value.panel.output     } },
  { id: 'quickLinks' as const, get label() { return t.value.panel.quickLinks } },
  { id: 'newsletter' as const, get label() { return t.value.panel.newsletter } },
]

const tabIds = ['contact', 'output', 'quickLinks', 'newsletter'] as const

const quickLinks = computed(() => [
  { href: '/faq', label: t.value.nav.faq },
  { href: '/learning-paths', label: t.value.learningPaths?.label || 'Learning Paths' },
  { href: '/members', label: t.value.nav.members },
  { href: '/books', label: t.value.nav.books },
  { href: '/#research', label: t.value.nav.research },
  { href: '/contact', label: t.value.nav.contact },
])

function onTabKeydown(event: KeyboardEvent, currentId: typeof tabIds[number]) {
  const idx = tabIds.indexOf(currentId)
  let next = idx
  if (event.key === 'ArrowRight') next = (idx + 1) % tabIds.length
  else if (event.key === 'ArrowLeft') next = (idx - 1 + tabIds.length) % tabIds.length
  else return
  event.preventDefault()
  openPanel(tabIds[next])
  const btn = document.getElementById(`panel-tab-${tabIds[next]}`)
  btn?.focus()
}

onMounted(async () => {
  restorePanelState()

  try {
    const res = await fetch(withBase('/api/lab-stats.json'))
    if (res.ok) {
      const data = await res.json()
      stats.value = data
      if (data.lastUpdated) {
        lastUpdated.value = new Date(data.lastUpdated).toLocaleDateString()
      }
    }
  } catch {
    // silently ignore; panel degrades gracefully
  }
})
</script>

<style scoped>
.panel-resize-handle {
  /* Flush with the inner edge (not overflowing outside it): the panel
     container clips overflow, which would silently eat pointer events on
     any sliver positioned outside its own bounds. */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  cursor: row-resize;
  z-index: 25;
  touch-action: none;
}
.panel-resize-handle:hover,
.panel-resize-handle:focus-visible {
  background: var(--color-accent);
  opacity: 0.5;
  outline: none;
}
</style>
