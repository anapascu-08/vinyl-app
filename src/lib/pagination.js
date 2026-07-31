export const PER_PAGE_OPTIONS = [24, 48, 96]
export const DEFAULT_PER_PAGE = 24

/**
 * Taie lista pentru pagina cerută. Pagina e mereu readusă în interval,
 * ca filtrarea să nu te lase pe o pagină inexistentă.
 */
export function paginate(items, page = 1, perPage = DEFAULT_PER_PAGE) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const current = Math.min(Math.max(1, Math.floor(page) || 1), totalPages)
  const start = (current - 1) * perPage

  return {
    items: items.slice(start, start + perPage),
    page: current,
    totalPages,
    total,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + perPage, total),
  }
}

/**
 * Numerele afișate în bara de paginare: prima, ultima, vecinii paginii curente,
 * iar în rest '…'. Ex. (7, 20) → [1, '…', 6, 7, 8, '…', 20]
 */
export function pageNumbers(current, totalPages, siblings = 1) {
  if (totalPages <= 1) return [1]
  // Sub acest prag încap toate numerele; elipsa n-ar economisi nimic.
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

  const pages = new Set([1, totalPages])
  for (let p = current - siblings; p <= current + siblings; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p)
  }

  const sorted = [...pages].sort((a, b) => a - b)
  const out = []
  let previous = 0
  for (const p of sorted) {
    if (previous && p - previous === 2) out.push(previous + 1)
    else if (previous && p - previous > 2) out.push('…')
    out.push(p)
    previous = p
  }
  return out
}
