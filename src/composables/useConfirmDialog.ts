import { ref } from 'vue'

export type ConfirmVariant = 'danger' | 'warning' | 'info'
export type UnsavedResult = 'save' | 'discard' | 'cancel'

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
}

export interface UnsavedOptions {
  title: string
  message: string
  saveLabel?: string
  discardLabel?: string
  cancelLabel?: string
}

type DialogMode = 'confirm' | 'unsaved'

// Module-level singleton state, same pattern as useConsent/useVSCodeLayout —
// shared across independently-mounted client:load islands on the same page.
// One <ConfirmDialog /> is mounted globally (VSCodeLayout.astro) and renders
// whatever this state currently holds; callers await a typed result instead
// of using the browser's native confirm().
const isOpen = ref(false)
const mode = ref<DialogMode>('confirm')
const confirmOptions = ref<ConfirmOptions | null>(null)
const unsavedOptions = ref<UnsavedOptions | null>(null)

let resolveConfirm: ((value: boolean) => void) | null = null
let resolveUnsaved: ((value: UnsavedResult) => void) | null = null

export function useConfirmDialog() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    mode.value = 'confirm'
    confirmOptions.value = options
    isOpen.value = true
    return new Promise((resolve) => {
      resolveConfirm = resolve
    })
  }

  function confirmUnsaved(options: UnsavedOptions): Promise<UnsavedResult> {
    mode.value = 'unsaved'
    unsavedOptions.value = options
    isOpen.value = true
    return new Promise((resolve) => {
      resolveUnsaved = resolve
    })
  }

  function resolveWithConfirm(value: boolean) {
    isOpen.value = false
    resolveConfirm?.(value)
    resolveConfirm = null
  }

  function resolveWithUnsaved(value: UnsavedResult) {
    isOpen.value = false
    resolveUnsaved?.(value)
    resolveUnsaved = null
  }

  return {
    isOpen,
    mode,
    confirmOptions,
    unsavedOptions,
    confirm,
    confirmUnsaved,
    resolveWithConfirm,
    resolveWithUnsaved,
  }
}
