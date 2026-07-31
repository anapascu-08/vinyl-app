import { create } from 'zustand'
import { DICTS, LANGUAGES, STORAGE_KEY, pickLanguage, translate, localeOf } from './translate.js'

export { LANGUAGES, translate, localeOf } from './translate.js'

function initialLanguage() {
  let saved = null
  try {
    saved = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    /* localStorage indisponibil */
  }
  const preferred =
    typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : []
  return pickLanguage(saved, preferred)
}

export const useLanguage = create((set) => ({
  lang: initialLanguage(),
  setLang: (lang) => {
    if (!DICTS[lang]) return
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignorăm */
    }
    if (typeof document !== 'undefined') document.documentElement.lang = lang
    set({ lang })
  },
}))

/** Hook principal: const { t, lang, setLang, locale } = useI18n() */
export function useI18n() {
  const lang = useLanguage((s) => s.lang)
  const setLang = useLanguage((s) => s.setLang)
  return {
    lang,
    setLang,
    t: (key, params) => translate(lang, key, params),
    locale: localeOf(lang),
  }
}
