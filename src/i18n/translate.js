import ro from './ro.js'
import en from './en.js'

export const LANGUAGES = [
  { code: 'ro', label: 'Română', short: 'RO' },
  { code: 'en', label: 'English', short: 'EN' },
]

export const DICTS = { ro, en }
export const FALLBACK = 'en'
export const STORAGE_KEY = 'vinyl-app:lang'

/** Înlocuiește {nume} cu valorile date; un parametru lipsă rămâne neatins. */
export function interpolate(template, params) {
  if (!params) return String(template)
  return String(template).replace(/\{(\w+)\}/g, (match, key) =>
    key in params ? String(params[key]) : match
  )
}

/** Cheia lipsă cade pe engleză, apoi pe cheia însăși — interfața nu rămâne goală. */
export function translate(lang, key, params) {
  const dict = DICTS[lang] ?? DICTS[FALLBACK]
  return interpolate(dict[key] ?? DICTS[FALLBACK][key] ?? key, params)
}

/** Prima limbă suportată dintre cea salvată și preferințele browserului. */
export function pickLanguage(saved, preferred = []) {
  if (saved && DICTS[saved]) return saved
  for (const tag of preferred) {
    const code = String(tag).slice(0, 2).toLowerCase()
    if (DICTS[code]) return code
  }
  return FALLBACK
}

export function localeOf(lang) {
  return lang === 'ro' ? 'ro-RO' : 'en-GB'
}
