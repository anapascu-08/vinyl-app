/** Elimină diacriticele și normalizează pentru căutare: "Björk" -> "bjork" */
export function normalize(str) {
  return String(str ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function formatMoney(value, locale = 'ro-RO') {
  if (value === null || value === undefined || value === '') return '—'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'RON',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(iso, locale = 'ro-RO') {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(d)
}

export function decadeOf(year) {
  if (!year) return null
  return Math.floor(year / 10) * 10
}

export function initialsOf(artist) {
  return normalize(artist)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}
