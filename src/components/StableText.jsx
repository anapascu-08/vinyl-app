import { LANGUAGES, translate, useI18n } from '../i18n/index.js'

/**
 * Text care nu lasă interfața să sară la schimbarea limbii.
 *
 * Randează toate variantele de limbă suprapuse în aceeași celulă de grid;
 * doar cea activă e vizibilă, dar cutia se dimensionează după cea mai lată.
 * Astfel butoanele și linkurile își păstrează lățimea în orice limbă.
 */
export function StableText({ k, params, className = '' }) {
  const { lang } = useI18n()

  return (
    <span className={`inline-grid ${className}`}>
      {LANGUAGES.map((l) => {
        const active = l.code === lang
        return (
          <span
            key={l.code}
            aria-hidden={active ? undefined : 'true'}
            className={`col-start-1 row-start-1 ${active ? '' : 'invisible'}`}
          >
            {translate(l.code, k, params)}
          </span>
        )
      })}
    </span>
  )
}

/** Cea mai lungă variantă a unei chei, în caractere — pentru min-width pe <select>. */
export function longestLength(...keys) {
  let max = 0
  for (const key of keys) {
    for (const l of LANGUAGES) {
      max = Math.max(max, translate(l.code, key).length)
    }
  }
  return max
}
