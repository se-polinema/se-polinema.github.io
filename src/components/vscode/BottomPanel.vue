<template>
  <div
    class="flex-shrink-0 overflow-hidden transition-[height] duration-200 flex flex-col"
    :style="{ height: panelOpen ? '260px' : '0px' }"
    style="background: #0D1B2E; border-top: 1px solid rgba(255,255,255,0.08);"
    aria-label="Panel"
  >
    <!-- Panel tab bar -->
    <div
      class="flex items-center flex-shrink-0"
      style="height: 35px; background: #162032; border-bottom: 1px solid rgba(255,255,255,0.06);"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="openPanel(tab.id)"
        class="h-full px-4 text-[11px] font-mono uppercase tracking-wider border-t-2 transition-colors duration-100"
        :class="activePanelTab === tab.id
          ? 'text-white border-t-[#F5A100]'
          : 'text-white/35 border-transparent hover:text-white/65'"
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
      <div v-if="activePanelTab === 'contact'" class="p-5 space-y-4">
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
            <a href="mailto:imam.fahrur@polinema.ac.id" class="text-[#CE9178] hover:text-accent transition-colors">
              "imam.fahrur@polinema.ac.id"
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
      <div v-else-if="activePanelTab === 'output'" class="p-5 space-y-1">
        <p class="text-white/25">[SE Lab] Initializing workspace analysis...</p>
        <p>
          <span class="text-[#98C379]">[INFO]</span>
          <span class="text-white/60 ml-2">Researchers detected:</span>
          <span class="text-[#98C379] ml-1">6 active</span>
        </p>
        <p>
          <span class="text-[#98C379]">[INFO]</span>
          <span class="text-white/60 ml-2">Research focus areas:</span>
          <span class="text-[#98C379] ml-1">7</span>
        </p>
        <p>
          <span class="text-[#98C379]">[INFO]</span>
          <span class="text-white/60 ml-2">Publications indexed:</span>
          <span class="text-[#98C379] ml-1">20+</span>
        </p>
        <p>
          <span class="text-[#98C379]">[INFO]</span>
          <span class="text-white/60 ml-2">Department:</span>
          <span class="text-white/50 ml-1">Jurusan Teknologi Informasi</span>
        </p>
        <p>
          <span class="text-[#98C379]">[INFO]</span>
          <span class="text-white/60 ml-2">Institution:</span>
          <span class="text-white/50 ml-1">Politeknik Negeri Malang</span>
        </p>
        <p class="pt-1">
          <span class="text-accent">[SUCCESS]</span>
          <span class="text-white/60 ml-2">Workspace ready.</span>
        </p>
        <p class="text-accent/60 animate-pulse select-none">▌</p>
      </div>

      <!-- PROBLEMS -->
      <div v-else-if="activePanelTab === 'problems'" class="p-5">
        <p class="text-white/40 mb-4">
          No problems have been detected in the workspace.
        </p>
        <div class="flex items-center gap-6 text-[11px]">
          <span class="flex items-center gap-1.5 text-white/30">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            0 Errors
          </span>
          <span class="flex items-center gap-1.5 text-white/30">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            0 Warnings
          </span>
          <span class="flex items-center gap-1.5 text-white/30">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            0 Infos
          </span>
        </div>
        <p class="text-white/20 mt-6">// All systems operational — se-lab v1.0.0</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useVSCodeLayout } from '../../composables/useVSCodeLayout'
import { useI18n } from '../../composables/useI18n'

const { panelOpen, activePanelTab, togglePanel, openPanel } = useVSCodeLayout()
const { t } = useI18n()

const tabs = [
  { id: 'contact' as const,  label: 'Contact'  },
  { id: 'output'  as const,  label: 'Output'   },
  { id: 'problems' as const, label: 'Problems' },
]
</script>
