// Shared Tab-trap for modal overlays (SearchOverlay, CommandPalette).
// Bind onKeydown directly on the modal's root element: it reads the
// container from the event itself (e.currentTarget), so no extra
// template ref is needed. It only intercepts Tab, so it's safe to layer
// over a component's own arrow-key/Enter handler. Call activate()/
// deactivate() from the component's own show()/close().
export function useFocusTrap() {
  let previouslyFocused: HTMLElement | null = null

  function getFocusable(container: HTMLElement): HTMLElement[] {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null)
  }

  function activate() {
    previouslyFocused = document.activeElement as HTMLElement | null
  }

  function deactivate() {
    previouslyFocused?.focus?.()
    previouslyFocused = null
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return
    const container = e.currentTarget as HTMLElement | null
    if (!container) return
    const focusable = getFocusable(container)
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return { activate, deactivate, onKeydown }
}
