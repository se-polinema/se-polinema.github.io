<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div
        v-if="mode"
        class="qio-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="mode === 'search' ? 'Search' : 'Command Palette'"
        @click.self="close"
        @keydown="onTrapKeydown"
      >
        <SearchOverlay v-if="mode === 'search'" @close="close" @handoff="openCommand" />
        <CommandPalette v-else-if="mode === 'command'" :prefill-query="commandPrefill" @close="close" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// Owns the ONE shared Teleport/Transition/backdrop shell for both the
// search overlay (Ctrl+K) and the command palette (Ctrl+Shift+P),
// switching which content renders via a single `mode` ref (v-if/
// v-else-if) instead of each dialog managing its own separate Teleport.
//
// This split exists because two independent `<Teleport to="body">`
// instances (each dialog previously its own component with its own
// Teleport) reliably corrupt Vue's Teleport DOM patching the moment one
// closes and the other opens shortly after, reproduced with real mouse
// clicks in both directions on Vue 3.5.34: the second Teleport's mount
// throws "Cannot read properties of null (reading 'insertBefore')" and
// never renders. Neither the Transition wrapper nor the focus trap nor
// which Vue app/island owns each dialog made a difference: only
// collapsing to a single Teleport did. A same-Teleport v-if/v-else-if
// swap is the same well-trodden pattern already used elsewhere in this
// codebase (e.g. Sidebar.vue's panel switcher) and has never shown this
// issue.
import { ref, onMounted, onUnmounted } from 'vue'
import SearchOverlay from './SearchOverlay.vue'
import CommandPalette from './CommandPalette.vue'
import { useFocusTrap } from '../../composables/useFocusTrap'

const mode = ref<'search' | 'command' | null>(null)
const commandPrefill = ref('')

const { activate: trapActivate, deactivate: trapDeactivate, onKeydown: onTrapKeydown } = useFocusTrap()

function openSearch() {
  trapActivate()
  mode.value = 'search'
}

function openCommand(prefillQuery?: string) {
  trapActivate()
  commandPrefill.value = prefillQuery ?? ''
  mode.value = 'command'
}

function close() {
  mode.value = null
  trapDeactivate()
}

function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    openSearch()
  } else if (((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'p') || e.key === 'F1') {
    e.preventDefault()
    openCommand()
  } else if (e.key === 'Escape' && mode.value) {
    e.preventDefault()
    close()
  }
}

function onOpenSearchEvent() {
  openSearch()
}

function onOpenCommandEvent(e: Event) {
  openCommand((e as CustomEvent<string>).detail)
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
  window.addEventListener('se-lab-open-search', onOpenSearchEvent)
  window.addEventListener('se-lab-open-command-palette', onOpenCommandEvent)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
  window.removeEventListener('se-lab-open-search', onOpenSearchEvent)
  window.removeEventListener('se-lab-open-command-palette', onOpenCommandEvent)
})
</script>

<style scoped>
.qio-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  padding-top: 14vh;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
}

.overlay-fade-enter-active {
  transition: opacity 0.12s ease;
}

.overlay-fade-leave-active {
  transition: opacity 0.1s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.overlay-fade-enter-to,
.overlay-fade-leave-from {
  opacity: 1;
}
</style>
