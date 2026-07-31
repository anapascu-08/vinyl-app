import { normalize, decadeOf } from './format.js'

export const FILTER_KEYS = ['genres', 'decades', 'conditions', 'formats']

export const EMPTY_FILTERS = { genres: [], decades: [], conditions: [], formats: [] }

/** ȘI între categorii, SAU în interiorul unei categorii. */
export function matches(album, { q, filters }) {
  const needle = normalize(q)
  if (needle && !(normalize(album.artist).includes(needle) || normalize(album.title).includes(needle))) {
    return false
  }
  if (filters.genres.length && !(album.genres ?? []).some((g) => filters.genres.includes(g))) return false
  if (filters.decades.length) {
    const d = decadeOf(album.year)
    if (!d || !filters.decades.includes(String(d))) return false
  }
  if (filters.conditions.length && !filters.conditions.includes(album.condition)) return false
  if (filters.formats.length && !filters.formats.includes(album.format)) return false
  return true
}

const byText = (x, y) => normalize(x).localeCompare(normalize(y), 'ro')

export const SORTERS = {
  artist: (x, y) => byText(x.artist, y.artist) || byText(x.title, y.title),
  title: (x, y) => byText(x.title, y.title),
  'year-asc': (x, y) => (x.year ?? Infinity) - (y.year ?? Infinity),
  'year-desc': (x, y) => (y.year ?? -Infinity) - (x.year ?? -Infinity),
  recent: (x, y) => new Date(y.createdAt) - new Date(x.createdAt),
  value: (x, y) => (y.estimatedValue ?? 0) - (x.estimatedValue ?? 0),
}

export function applyFilters(albums, { q = '', filters = EMPTY_FILTERS, sort = 'artist' } = {}) {
  return albums.filter((a) => matches(a, { q, filters })).sort(SORTERS[sort] ?? SORTERS.artist)
}
