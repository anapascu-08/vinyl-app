import { STATUS } from './constants.js'

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'a-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const EMPTY_ALBUM = {
  artist: '',
  title: '',
  year: '',
  genres: [],
  label: '',
  format: 'LP',
  condition: 'VG+',
  sleeveCondition: '',
  coverUrl: '',
  purchasePrice: '',
  purchaseDate: '',
  estimatedValue: '',
  rating: null,
  notes: '',
  tracklist: [],
  status: STATUS.OWNED,
}

function num(v) {
  if (v === '' || v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function str(v) {
  const s = String(v ?? '').trim()
  return s === '' ? null : s
}

/** Transformă input-ul brut din formular în entitatea Album normalizată. */
export function normalizeAlbumInput(input) {
  return {
    artist: String(input.artist ?? '').trim(),
    title: String(input.title ?? '').trim(),
    year: num(input.year),
    genres: Array.isArray(input.genres) ? input.genres.filter(Boolean) : [],
    label: str(input.label),
    format: input.format || 'LP',
    condition: input.condition || 'VG+',
    sleeveCondition: str(input.sleeveCondition),
    coverUrl: str(input.coverUrl),
    purchasePrice: num(input.purchasePrice),
    purchaseDate: str(input.purchaseDate),
    estimatedValue: num(input.estimatedValue),
    rating: input.rating ? Number(input.rating) : null,
    notes: String(input.notes ?? ''),
    tracklist: (input.tracklist ?? [])
      .filter((t) => String(t.title ?? '').trim() !== '')
      .map((t) => ({
        position: String(t.position ?? '').trim(),
        title: String(t.title ?? '').trim(),
        duration: str(t.duration),
      })),
    status: input.status === STATUS.WISHLIST ? STATUS.WISHLIST : STATUS.OWNED,
  }
}

export function createAlbum(input) {
  const now = new Date().toISOString()
  return {
    id: uid(),
    ...normalizeAlbumInput(input),
    createdAt: now,
    updatedAt: now,
  }
}

/** Pregătește un album existent pentru popularea formularului. */
export function toFormValues(album) {
  return {
    ...EMPTY_ALBUM,
    ...album,
    year: album.year ?? '',
    label: album.label ?? '',
    sleeveCondition: album.sleeveCondition ?? '',
    coverUrl: album.coverUrl ?? '',
    purchasePrice: album.purchasePrice ?? '',
    purchaseDate: album.purchaseDate ?? '',
    estimatedValue: album.estimatedValue ?? '',
    notes: album.notes ?? '',
    genres: album.genres ?? [],
    tracklist: album.tracklist ?? [],
  }
}
