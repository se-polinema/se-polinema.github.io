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
