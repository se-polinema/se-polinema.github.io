<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="isOpen"
        class="vscode-dialog-overlay"
        role="alertdialog"
        aria-modal="true"
        :aria-label="activeTitle"
        @click.self="handleCancel"
      >
        <div ref="panelEl" class="vscode-dialog-panel" tabindex="-1" @keydown="onKeydown">
          <div class="vscode-dialog-icon" :class="iconClass">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h2 class="vscode-dialog-title">{{ activeTitle }}</h2>
          <p class="vscode-dialog-message">{{ activeMessage }}</p>

          <div class="vscode-dialog-actions">
            <template v-if="mode === 'confirm'">
              <button ref="cancelBtn" class="vscode-dialog-btn vscode-dialog-btn-ghost" @click="handleCancel">
                {{ confirmOptions?.cancelLabel ?? 'Cancel' }}
              </button>
              <button
                class="vscode-dialog-btn"
                :class="variant === 'danger' ? 'vscode-dialog-btn-danger' : 'vscode-dialog-btn-primary'"
                @click="handleConfirmYes"
              >
                {{ confirmOptions?.confirmLabel ?? 'OK' }}
              </button>
            </template>
            <template v-else>
              <button ref="cancelBtn" class="vscode-dialog-btn vscode-dialog-btn-ghost" @click="handleUnsaved('cancel')">
                {{ unsavedOptions?.cancelLabel ?? 'Cancel' }}
              </button>
              <button class="vscode-dialog-btn vscode-dialog-btn-ghost" @click="handleUnsaved('discard')">
                {{ unsavedOptions?.discardLabel ?? "Don't Save" }}
              </button>
              <button class="vscode-dialog-btn vscode-dialog-btn-primary" @click="handleUnsaved('save')">
                {{ unsavedOptions?.saveLabel ?? 'Save' }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useConfirmDialog } from '../../composables/useConfirmDialog'
import '../../styles/vscode-dialog.css'

const { isOpen, mode, confirmOptions, unsavedOptions, resolveWithConfirm, resolveWithUnsaved } = useConfirmDialog()

const panelEl = ref<HTMLElement | null>(null)
const cancelBtn = ref<HTMLButtonElement | null>(null)

const variant = computed(() => confirmOptions.value?.variant ?? 'info')

const iconClass = computed(() => {
  if (mode.value === 'unsaved') return 'vscode-dialog-icon-warning'
  if (variant.value === 'danger') return 'vscode-dialog-icon-danger'
  if (variant.value === 'warning') return 'vscode-dialog-icon-warning'
  return 'vscode-dialog-icon-info'
})

const activeTitle = computed(() => {
  return mode.value === 'confirm' ? (confirmOptions.value?.title ?? '') : (unsavedOptions.value?.title ?? '')
})

const activeMessage = computed(() => {
  return mode.value === 'confirm' ? (confirmOptions.value?.message ?? '') : (unsavedOptions.value?.message ?? '')
})

function handleConfirmYes() {
  resolveWithConfirm(true)
}

function handleCancel() {
  if (mode.value === 'confirm') {
    resolveWithConfirm(false)
  } else {
    resolveWithUnsaved('cancel')
  }
}

function handleUnsaved(result: 'save' | 'discard' | 'cancel') {
  resolveWithUnsaved(result)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    handleCancel()
  }
}

watch(isOpen, (open) => {
  if (open) {
    nextTick(() => {
      panelEl.value?.focus()
      cancelBtn.value?.focus()
    })
  }
})
</script>
