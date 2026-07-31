import { CURRENT_YEAR, MAX_GENRES, MAX_NOTES, CONDITION_VALUES, FORMATS } from './constants.js'

/**
 * Validează input-ul brut din formular.
 * @returns {Object} map { camp: [cheieTraducere, params?] }. Gol = valid.
 * Mesajele sunt chei, nu text, ca să poată fi traduse la randare.
 */
export function validateAlbum(input) {
  const errors = {}
  const artist = String(input.artist ?? '').trim()
  const title = String(input.title ?? '').trim()

  if (!artist) errors.artist = ['validation.artistRequired']
  else if (artist.length > 120) errors.artist = ['validation.artistLong']

  if (!title) errors.title = ['validation.titleRequired']
  else if (title.length > 200) errors.title = ['validation.titleLong']

  if (input.year !== '' && input.year !== null && input.year !== undefined) {
    const y = Number(input.year)
    if (!Number.isInteger(y) || y < 1900 || y > CURRENT_YEAR) {
      errors.year = ['validation.year', { year: CURRENT_YEAR }]
    }
  }

  if ((input.genres ?? []).length > MAX_GENRES) {
    errors.genres = ['validation.genres', { max: MAX_GENRES }]
  }

  if (!FORMATS.includes(input.format)) errors.format = ['validation.format']
  if (!CONDITION_VALUES.includes(input.condition)) errors.condition = ['validation.condition']
  if (input.sleeveCondition && !CONDITION_VALUES.includes(input.sleeveCondition)) {
    errors.sleeveCondition = ['validation.sleeveCondition']
  }

  const NUMERIC = [
    { field: 'purchasePrice', nan: 'validation.priceNumber', negative: 'validation.priceNegative' },
    { field: 'estimatedValue', nan: 'validation.valueNumber', negative: 'validation.valueNegative' },
  ]
  for (const { field, nan, negative } of NUMERIC) {
    const raw = input[field]
    if (raw !== '' && raw !== null && raw !== undefined) {
      const n = Number(raw)
      if (!Number.isFinite(n)) errors[field] = [nan]
      else if (n < 0) errors[field] = [negative]
    }
  }

  if (input.purchaseDate) {
    const d = new Date(input.purchaseDate)
    if (Number.isNaN(d.getTime())) errors.purchaseDate = ['validation.dateInvalid']
    else if (d > new Date()) errors.purchaseDate = ['validation.dateFuture']
  }

  if (input.rating !== null && input.rating !== undefined && input.rating !== '') {
    const r = Number(input.rating)
    if (!Number.isInteger(r) || r < 1 || r > 5) errors.rating = ['validation.rating']
  }

  if (String(input.notes ?? '').length > MAX_NOTES) {
    errors.notes = ['validation.notes', { max: MAX_NOTES }]
  }

  if (input.coverUrl && !input.coverUrl.startsWith('data:')) {
    try {
      const u = new URL(input.coverUrl)
      if (!['http:', 'https:'].includes(u.protocol)) errors.coverUrl = ['validation.coverProtocol']
    } catch {
      errors.coverUrl = ['validation.coverInvalid']
    }
  }

  const badTrack = (input.tracklist ?? []).some(
    (t) => String(t.position ?? '').trim() !== '' && String(t.title ?? '').trim() === ''
  )
  if (badTrack) errors.tracklist = ['validation.track']

  return errors
}

export function isValid(errors) {
  return Object.keys(errors).length === 0
}
