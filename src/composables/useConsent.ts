import { ref } from 'vue'

export type ConsentState = 'granted' | 'denied' | 'pending'

const STORAGE_KEY = 'se-lab-consent'

function getInitialConsent(): ConsentState {
  if (typeof window === 'undefined') return 'pending'
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'granted' || stored === 'denied') return stored
  } catch {}
  return 'pending'
}

const consent = ref<ConsentState>(getInitialConsent())

export function useConsent() {
  function grant() {
    consent.value = 'granted'
    try {
      localStorage.setItem(STORAGE_KEY, 'granted')
    } catch {}

    if (typeof window !== 'undefined') {
      const loadAnalytics = (window as any).__seLabLoadAnalytics
      if (typeof loadAnalytics === 'function') {
        try {
          loadAnalytics()
        } catch {}
      }
    }
  }

  function deny() {
    consent.value = 'denied'
    try {
      localStorage.setItem(STORAGE_KEY, 'denied')
    } catch {}
  }

  return {
    consent,
    grant,
    deny,
  }
}
