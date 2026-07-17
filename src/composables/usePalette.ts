import { ref } from 'vue'

// Live-switchable color palette system for comparing theme directions —
// mirrors useTheme.ts's pattern exactly (module-singleton ref +
// localStorage + an attribute applied to <html>), so it stays in sync
// across every independently-mounted Vue island on a page.
//
// 'compass' is the current/default site look and maps to NO attribute at
// all (see applyPalette) — so anyone who never touches the switcher sees
// the exact same site as before this system existed. See
// src/styles/global.css for the [data-palette="..."] token blocks and
// the plan file for the intentional scope boundary (chrome regions +
// primary/accent ramps are palette-aware; a number of small decorative
// literals are not, yet).
export const PALETTES = ['compass', 'harbor', 'foundry', 'aurora', 'glacier'] as const
export type PaletteName = (typeof PALETTES)[number]

const STORAGE_KEY = 'se-lab-palette'
const DEFAULT_PALETTE: PaletteName = 'compass'

function isPaletteName(value: string | null): value is PaletteName {
  return value != null && (PALETTES as readonly string[]).includes(value)
}

function getInitialPalette(): PaletteName {
  if (typeof window === 'undefined') return DEFAULT_PALETTE
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isPaletteName(stored)) return stored
  } catch {}
  return DEFAULT_PALETTE
}

const currentPalette = ref<PaletteName>(getInitialPalette())

function applyPalette(palette: PaletteName) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (palette === DEFAULT_PALETTE) {
    root.removeAttribute('data-palette')
  } else {
    root.setAttribute('data-palette', palette)
  }
}

export function usePalette() {
  function setPalette(palette: PaletteName) {
    currentPalette.value = palette
    try {
      localStorage.setItem(STORAGE_KEY, palette)
    } catch {}
    applyPalette(palette)
  }

  function cyclePalette() {
    const idx = PALETTES.indexOf(currentPalette.value)
    setPalette(PALETTES[(idx + 1) % PALETTES.length])
  }

  return {
    palette: currentPalette,
    palettes: PALETTES,
    setPalette,
    cyclePalette,
  }
}
