<template>
  <div
    class="flex-shrink-0 overflow-hidden transition-[height] duration-200 flex flex-col"
    :style="{ height: panelOpen ? '180px' : '0px' }"
    style="background: var(--color-vscode-panel); border-top: 1px solid rgba(255,255,255,0.08);"
    aria-label="Panel"
  >
    <!-- Panel tab bar -->
    <div
      class="flex items-center flex-shrink-0"
      style="height: 35px; background: var(--color-vscode-panel-tab); border-bottom: 1px solid rgba(255,255,255,0.06);"
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
          ? 'text-white border-t-[#F5A100]'
          : 'text-white/35 border-transparent hover:text-white/65'"
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
        class="w-9 h-full flex items-center justify-center text-white/35 hover:text-white/70 transition-colors"
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
          <p class="text-white/25 mb-2">// {{ t.contact.affiliation }}</p>
          <p>
            <span class="text-[#9CDCFE]">"address"</span>
            <span class="text-white/40">: </span>
            <span class="text-[#CE9178]">"{{ t.contact.address }}"</span>
          </p>
          <p class="mt-1">
            <span class="text-[#9CDCFE]">"email"</span>
            <span class="text-white/40">: </span>
            <a :href="`mailto:${t.contact.email}`" class="text-[#CE9178] hover:text-accent transition-colors">
              "{{ t.contact.email }}"
            </a>
          </p>
        </div>

        <div class="flex flex-wrap gap-2 pt-1">
          <a
            href="https://jti.polinema.ac.id"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono text-primary font-medium transition-colors"
            style="background: #F5A100;"
          >
            JTI Polinema ↗
          </a>
          <a
            href="https://polinema.ac.id"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono text-white/70 hover:text-white transition-colors"
            style="border: 1px solid rgba(255,255,255,0.15);"
          >
            Polinema ↗
          </a>
          <a
            href="https://github.com/se-polinema"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono text-white/70 hover:text-white transition-colors"
            style="border: 1px solid rgba(255,255,255,0.15);"
          >
            GitHub ↗
          </a>
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
        <p class="text-white/25">[SE Lab] {{ t.panel.outputInit }}</p>
        <template v-if="stats">
          <p>
            <span class="text-[#98C379]">[INFO]</span>
            <span class="text-white/60 ml-2">{{ t.panel.outputResearchers }}</span>
            <span class="text-[#98C379] ml-1">{{ stats.researchers }} active</span>
          </p>
          <p>
            <span class="text-[#98C379]">[INFO]</span>
            <span class="text-white/60 ml-2">{{ t.panel.outputFocusAreas }}</span>
            <span class="text-[#98C379] ml-1">{{ stats.focusAreas }}</span>
          </p>
          <p>
            <span class="text-[#98C379]">[INFO]</span>
            <span class="text-white/60 ml-2">{{ t.panel.outputPublications }}</span>
            <span class="text-[#98C379] ml-1">{{ stats.publications }}</span>
          </p>
          <p>
            <span class="text-[#98C379]">[INFO]</span>
            <span class="text-white/60 ml-2">{{ t.panel.outputProjects }}</span>
            <span class="text-[#98C379] ml-1">{{ stats.projects }}</span>
          </p>
          <p>
            <span class="text-[#98C379]">[INFO]</span>
            <span class="text-white/60 ml-2">{{ t.panel.outputBooks }}</span>
            <span class="text-[#98C379] ml-1">{{ stats.books }}</span>
          </p>
          <p>
            <span class="text-[#98C379]">[INFO]</span>
            <span class="text-white/60 ml-2">{{ t.panel.outputDept }}</span>
            <span class="text-white/50 ml-1">Jurusan Teknologi Informasi</span>
          </p>
          <p>
            <span class="text-[#98C379]">[INFO]</span>
            <span class="text-white/60 ml-2">{{ t.panel.outputInst }}</span>
            <span class="text-white/50 ml-1">Politeknik Negeri Malang</span>
          </p>
          <p v-if="lastUpdated" class="text-white/30">
            {{ t.panel.outputLastUpdated }} {{ lastUpdated }}
          </p>
          <p class="pt-1">
            <span class="text-accent">[SUCCESS]</span>
            <span class="text-white/60 ml-2">{{ t.panel.outputReady }}</span>
          </p>
        </template>
        <template v-else>
          <p class="text-white/30">{{ t.panel.outputInit }}</p>
        </template>
        <p class="text-accent/60 animate-pulse select-none">▌</p>
      </div>

      <!-- PROBLEMS -->
      <div
        v-show="activePanelTab === 'problems'"
        class="p-5"
        role="tabpanel"
        :id="`panel-body-problems`"
        :aria-labelledby="`panel-tab-problems`"
      >
        <p class="text-white/40 mb-4">{{ t.panel.problemsNone }}</p>
        <div class="flex items-center gap-6 text-[11px]">
          <span class="flex items-center gap-1.5 text-white/30">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            0 {{ t.panel.problemsErrors }}
          </span>
          <span class="flex items-center gap-1.5 text-white/30">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            0 {{ t.panel.problemsWarnings }}
          </span>
          <span class="flex items-center gap-1.5 text-white/30">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            0 {{ t.panel.problemsInfos }}
          </span>
        </div>
        <p class="text-white/20 mt-6">// {{ t.panel.problemsVersion }}</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'
import { useI18n } from '../../composables/useI18n'

const { panelOpen, activePanelTab, togglePanel, openPanel } = useVSCodeLayout()
const { t } = useI18n()

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
  { id: 'contact'  as const, get label() { return t.value.panel.contact  } },
  { id: 'output'   as const, get label() { return t.value.panel.output   } },
  { id: 'problems' as const, get label() { return t.value.panel.problems } },
]

const tabIds = ['contact', 'output', 'problems'] as const

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
  try {
    const res = await fetch('/api/lab-stats.json')
    if (res.ok) {
      const data = await res.json()
      stats.value = data
      if (data.lastUpdated) {
        lastUpdated.value = new Date(data.lastUpdated).toLocaleDateString()
      }
    }
  } catch {
    // silently ignore — panel degrades gracefully
  }
})
</script>
