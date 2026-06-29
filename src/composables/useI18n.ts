import { ref, computed } from 'vue'
import en from '../i18n/en.json'
import id from '../i18n/id.json'

type TranslationDict = typeof en
type Lang = 'en' | 'id'

const translations: Record<Lang, TranslationDict> = { en, id }

const STORAGE_KEY = 'se-lab-lang'

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'id') return stored
  } catch {}
  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith('id') ? 'id' : 'en'
}

const currentLang = ref<Lang>(getInitialLang())

export function useI18n() {
  const t = computed(() => translations[currentLang.value])

  function setLang(lang: Lang) {
    currentLang.value = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
      document.documentElement.lang = lang
    } catch {}
  }

  function toggleLang() {
    setLang(currentLang.value === 'en' ? 'id' : 'en')
  }

  return {
    lang: currentLang,
    t,
    setLang,
    toggleLang,
  }
}
