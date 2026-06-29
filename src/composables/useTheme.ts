import { ref } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'se-lab-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

const currentTheme = ref<Theme>(getInitialTheme())

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function useTheme() {
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
