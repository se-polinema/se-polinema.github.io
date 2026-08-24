import { ref } from 'vue'

interface DragResizeOptions {
  axis: 'x' | 'y'
  min: number
  max: () => number
  // Set true when the handle sits on the "far" edge relative to the
  // resized element's growth direction, e.g. the bottom panel's handle
  // is on its TOP edge, so dragging up (decreasing clientY) should
  // increase height, the opposite of the raw pointer delta.
  invert?: boolean
  onChange: (value: number) => void
  onCommit: () => void
}

const STEP = 20
const STEP_LARGE = 40

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// Shared pointer-drag + keyboard resize handler for the sidebar/panel
// resize handles (Sidebar.vue, BottomPanel.vue). `getValue` reads the
// current size (owned by the caller, e.g. useVSCodeLayout's
// sidebarWidth/panelHeight) so this composable holds no size state of
// its own: it only translates pointer/keyboard input into clamped
// onChange calls, firing onCommit once at the end (drag release, or
// immediately after a keyboard step) so callers can persist without
// writing to localStorage on every pointermove.
export function useDragResize(getValue: () => number, options: DragResizeOptions) {
  const dragging = ref(false)
  let startPos = 0
  let startValue = 0

  function onPointerMove(e: PointerEvent) {
    if (!dragging.value) return
    const pos = options.axis === 'x' ? e.clientX : e.clientY
    const rawDelta = pos - startPos
    const delta = options.invert ? -rawDelta : rawDelta
    options.onChange(clamp(startValue + delta, options.min, options.max()))
  }

  function onPointerUp() {
    dragging.value = false
    if (typeof document !== 'undefined') document.body.style.userSelect = ''
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    options.onCommit()
  }

  function onPointerDown(e: PointerEvent) {
    dragging.value = true
    startPos = options.axis === 'x' ? e.clientX : e.clientY
    startValue = getValue()
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  function onKeydown(e: KeyboardEvent) {
    const step = e.shiftKey ? STEP_LARGE : STEP
    let delta = 0
    if (options.axis === 'x') {
      if (e.key === 'ArrowLeft') delta = options.invert ? step : -step
      else if (e.key === 'ArrowRight') delta = options.invert ? -step : step
    } else {
      if (e.key === 'ArrowUp') delta = options.invert ? step : -step
      else if (e.key === 'ArrowDown') delta = options.invert ? -step : step
    }
    if (delta === 0) return
    e.preventDefault()
    options.onChange(clamp(getValue() + delta, options.min, options.max()))
    options.onCommit()
  }

  return { dragging, onPointerDown, onKeydown }
}
