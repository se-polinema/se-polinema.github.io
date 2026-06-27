import { ref } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'se-lab-theme'
const currentTheme = ref<Theme>('light')
let initialized = false

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function useTheme() {
  if (typeof window !== 'undefined' && !initialized) {
    const theme = getInitialTheme()
    currentTheme.value = theme
    applyTheme(theme)
    initialized = true
  }

  function setTheme(theme: Theme) {
    currentTheme.value = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
    applyTheme(theme)
  }

  function toggleTheme() {
    setTheme(currentTheme.value === 'light' ? 'dark' : 'light')
  }

  return {
    theme: currentTheme,
    setTheme,
    toggleTheme,
  }
}
