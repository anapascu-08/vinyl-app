/**
 * Coperte generate procedural, ca SVG inline (data URL).
 * Deterministe: același album produce mereu aceeași imagine.
 * Nu se face niciun request de rețea și nu se folosește artă protejată de drepturi.
 */

const PALETTES = [
  { bg: '#1d1436', fg: '#f6f3ff', a1: '#7048d8', a2: '#f2a03d' },
  { bg: '#0f2b2e', fg: '#f2fbf8', a1: '#18a999', a2: '#f4d35e' },
  { bg: '#2b0f1a', fg: '#fff5f7', a1: '#d64550', a2: '#f0a6ab' },
  { bg: '#12203d', fg: '#eef4ff', a1: '#3d6fd8', a2: '#8fd4e8' },
  { bg: '#f4f1e8', fg: '#1a1a1a', a1: '#d95d39', a2: '#2d3a3a' },
  { bg: '#231a0e', fg: '#fdf6e8', a1: '#e0a458', a2: '#9c6644' },
  { bg: '#1a1a1a', fg: '#fafafa', a1: '#d8d8d8', a2: '#c8102e' },
  { bg: '#2d1b3d', fg: '#f7f0ff', a1: '#b57edc', a2: '#4ecdc4' },
  { bg: '#08322a', fg: '#f0fff8', a1: '#5fb49c', a2: '#e8c547' },
  { bg: '#3d1f0f', fg: '#fff8f0', a1: '#f07d3c', a2: '#2a9d8f' },
]

const STYLES = ['orbit', 'bauhaus', 'waves', 'type', 'grid', 'split']

const SIZE = 400
const PAD = 28

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Alege negru sau alb, în funcție de luminanța fundalului. */
function contrastOn(hex) {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const lum = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  return lum > 0.45 ? '#141414' : '#fbfbfb'
}

function clamp(str, max) {
  const s = String(str)
  return s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s
}

/** Împarte titlul pe maximum 3 rânduri, fără a rupe cuvintele. */
function wrap(title, perLine = 17, maxLines = 3) {
  const words = String(title).split(/\s+/)
  const lines = []
  let line = ''
  for (const w of words) {
    if (!line) line = w
    else if ((line + ' ' + w).length <= perLine) line += ' ' + w
    else {
      lines.push(line)
      line = w
    }
    if (lines.length === maxLines) break
  }
  if (line && lines.length < maxLines) lines.push(line)
  return lines.map((l) => clamp(l, perLine + 5))
}

function textEl(str, { x, y, size, weight = 700, fill, anchor = 'start', spacing = 0 }) {
  return (
    `<text x="${x}" y="${y}" fill="${fill}" font-family="Helvetica,Arial,sans-serif" ` +
    `font-size="${size}" font-weight="${weight}" text-anchor="${anchor}"` +
    (spacing ? ` letter-spacing="${spacing}"` : '') +
    `>${esc(str)}</text>`
  )
}

/**
 * Bloc de text ancorat la baza copertei: artistul deasupra, titlul dedesubt,
 * peste un voal semi-opac care garantează lizibilitatea indiferent de grafică.
 */
function bottomBlock(album, p, { size = 22 } = {}) {
  const lines = wrap(album.title)
  const lead = size + 5
  const firstBaseline = SIZE - PAD - (lines.length - 1) * lead
  const artistBaseline = firstBaseline - size - 12
  const scrimTop = artistBaseline - 26

  const scrim = `<rect x="0" y="${scrimTop}" width="${SIZE}" height="${SIZE - scrimTop}" fill="${p.bg}" opacity="0.82"/>`
  const artist = textEl(clamp(String(album.artist).toUpperCase(), 26), {
    x: PAD, y: artistBaseline, size: 16, weight: 600, fill: p.a2, spacing: 2,
  })
  const title = lines
    .map((line, i) => textEl(line, { x: PAD, y: firstBaseline + i * lead, size, fill: p.fg }))
    .join('')

  return scrim + artist + title
}

const RENDERERS = {
  orbit: (a, p, h) => {
    const rings = 5 + (h % 4)
    const circles = Array.from({ length: rings }, (_, i) => {
      const r = 34 + i * (130 / rings)
      return `<circle cx="200" cy="150" r="${r}" fill="none" stroke="${i % 2 ? p.a1 : p.a2}" stroke-width="${
        1 + ((h >> i) % 3)
      }" opacity="0.85"/>`
    }).join('')
    return `<rect width="400" height="400" fill="${p.bg}"/>${circles}
      <circle cx="200" cy="150" r="20" fill="${p.a2}"/>
      <circle cx="200" cy="150" r="4" fill="${p.bg}"/>
      ${bottomBlock(a, p)}`
  },

  bauhaus: (a, p, h) => {
    const flip = h % 2 === 0
    return `<rect width="400" height="400" fill="${p.bg}"/>
      <circle cx="${flip ? 130 : 270}" cy="130" r="82" fill="${p.a1}"/>
      <rect x="${flip ? 208 : 40}" y="52" width="152" height="152" fill="${p.a2}" opacity="0.92"/>
      <path d="M40 232 L192 232 L116 128 Z" fill="${p.fg}" opacity="0.16"/>
      ${bottomBlock(a, p)}`
  },

  waves: (a, p, h) => {
    const bands = Array.from({ length: 7 }, (_, i) => {
      const y = 55 + i * 24
      const amp = 10 + ((h >> i) % 15)
      return `<path d="M0 ${y} Q 100 ${y - amp}, 200 ${y} T 400 ${y}" fill="none" stroke="${
        i % 2 ? p.a1 : p.a2
      }" stroke-width="6" opacity="${0.5 + i * 0.06}"/>`
    }).join('')
    return `<rect width="400" height="400" fill="${p.bg}"/>${bands}${bottomBlock(a, p)}`
  },

  type: (a, p) => {
    const lines = wrap(a.title, 14)
    const size = lines.length > 2 ? 30 : 36
    const lead = size + 6
    const start = 215 - ((lines.length - 1) * lead) / 2
    const onA1 = contrastOn(p.a1)
    return `<rect width="400" height="400" fill="${p.a1}"/>
      <rect x="0" y="0" width="400" height="112" fill="${p.bg}"/>
      ${textEl(clamp(String(a.artist).toUpperCase(), 26), {
        x: 200, y: 66, size: 17, weight: 600, fill: p.fg, anchor: 'middle', spacing: 2,
      })}
      ${lines
        .map((line, i) =>
          textEl(line, { x: 200, y: start + i * lead, size, fill: onA1, anchor: 'middle' })
        )
        .join('')}
      <rect x="150" y="345" width="100" height="6" fill="${p.a2}"/>`
  },

  grid: (a, p, h) => {
    const cells = []
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const on = ((h >> ((r * 6 + c) % 24)) + r * c) % 3 !== 0
        if (!on) continue
        cells.push(
          `<rect x="${28 + c * 58}" y="${24 + r * 34}" width="46" height="24" fill="${
            (r + c) % 2 ? p.a1 : p.a2
          }" opacity="0.9"/>`
        )
      }
    }
    return `<rect width="400" height="400" fill="${p.bg}"/>${cells.join('')}${bottomBlock(a, p)}`
  },

  split: (a, p, h) => {
    const skew = 100 + (h % 90)
    return `<rect width="400" height="400" fill="${p.bg}"/>
      <path d="M0 0 L400 0 L400 ${skew} L0 ${skew + 80} Z" fill="${p.a1}"/>
      <circle cx="308" cy="${skew + 110}" r="54" fill="${p.a2}" opacity="0.9"/>
      ${bottomBlock(a, p)}`
  },
}

/**
 * @param {{artist: string, title: string}} album
 * @returns {string} data URL cu un SVG 400x400
 */
export function generateCover(album) {
  const h = hash(`${album.artist}|${album.title}`)
  const palette = PALETTES[h % PALETTES.length]
  const style = STYLES[(h >> 8) % STYLES.length]
  const body = RENDERERS[style](album, palette, h)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" ` +
    `role="img" aria-label="${esc(album.title)}">${body}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
