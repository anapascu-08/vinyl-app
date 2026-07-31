export const FORMATS = ['LP', 'EP', 'Single', 'Box Set', '7"', '10"', '12"']

// Scara Goldmine, standardul folosit în comerțul cu viniluri
export const CONDITIONS = [
  { value: 'M', key: 'condition.M' },
  { value: 'NM', key: 'condition.NM' },
  { value: 'VG+', key: 'condition.VG+' },
  { value: 'VG', key: 'condition.VG' },
  { value: 'G+', key: 'condition.G+' },
  { value: 'G', key: 'condition.G' },
  { value: 'P', key: 'condition.P' },
]

export const CONDITION_VALUES = CONDITIONS.map((c) => c.value)

export const GENRES = [
  'Rock', 'Pop', 'Jazz', 'Blues', 'Soul', 'Funk', 'Hip-Hop', 'Electronic',
  'Classical', 'Folk', 'Country', 'Reggae', 'Metal', 'Punk', 'Ambient',
  'Soundtrack', 'World', 'Experimental',
]

export const STATUS = { OWNED: 'owned', WISHLIST: 'wishlist' }

export const SORT_OPTIONS = [
  { value: 'artist', key: 'sort.artist' },
  { value: 'title', key: 'sort.title' },
  { value: 'year-asc', key: 'sort.yearAsc' },
  { value: 'year-desc', key: 'sort.yearDesc' },
  { value: 'recent', key: 'sort.recent' },
  { value: 'value', key: 'sort.value' },
]

export const MAX_GENRES = 5
export const MAX_NOTES = 2000
export const MAX_COVER_BYTES = 2 * 1024 * 1024
export const CURRENT_YEAR = new Date().getFullYear()
