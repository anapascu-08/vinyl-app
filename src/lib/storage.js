export const STORAGE_KEY = 'vinyl-app:collection:v1'
export const CURRENT_VERSION = 1

/** @returns {{albums: Array, error: null|'corrupt'|'unavailable', raw: string|null}} */
export function load() {
  let raw = null
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return { albums: [], error: 'unavailable', raw: null }
  }
  if (!raw) return { albums: [], error: null, raw: null }

  try {
    const parsed = JSON.parse(raw)
    const albums = migrate(parsed)
    if (!Array.isArray(albums)) throw new Error('shape')
    return { albums, error: null, raw }
  } catch {
    return { albums: [], error: 'corrupt', raw }
  }
}

function migrate(parsed) {
  if (Array.isArray(parsed)) return parsed // format pre-versionare
  if (parsed && typeof parsed === 'object') return parsed.albums
  return null
}

/** @returns {null|'unavailable'} */
export function save(albums) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: CURRENT_VERSION, albums })
    )
    return null
  } catch {
    return 'unavailable'
  }
}

/** Validează un obiect importat. @returns {{ok:true,albums:Array}|{ok:false,reason:[cheie, params?]}} */
export function parseImport(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, reason: ['data.importBadJson'] }
  }
  const albums = Array.isArray(data) ? data : data?.albums
  if (!Array.isArray(albums)) {
    return { ok: false, reason: ['data.importBadShape'] }
  }
  const bad = albums.findIndex((a) => !a || typeof a !== 'object' || !a.artist || !a.title)
  if (bad !== -1) {
    return { ok: false, reason: ['data.importBadItem', { n: bad + 1 }] }
  }
  return { ok: true, albums }
}
