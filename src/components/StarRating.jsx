import { useI18n } from '../i18n/index.js'

export function StarRating({ value, onChange, size = 'md', label }) {
  const { t } = useI18n()
  const readOnly = !onChange
  const sizes = { sm: 'text-base', md: 'text-2xl' }

  if (readOnly) {
    return (
      <span className={`${sizes[size]} text-violet-600`} aria-label={t('rating.stars', { n: value ?? 0 })}>
        {'★'.repeat(value ?? 0)}
        <span className="text-ink-300">{'★'.repeat(5 - (value ?? 0))}</span>
      </span>
    )
  }

  return (
    <div role="radiogroup" aria-label={label ?? t('rating.label')} className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={n === 1 ? t('rating.star', { n }) : t('rating.starsPlural', { n })}
          onClick={() => onChange(value === n ? null : n)}
          className={`${sizes[size]} rounded transition-transform hover:scale-110 ${
            value >= n ? 'text-violet-600' : 'text-ink-300'
          }`}
        >
          ★
        </button>
      ))}
      {value ? (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="ml-2 text-xs text-ink-500 hover:text-ink-900"
        >
          {t('rating.clear')}
        </button>
      ) : null}
    </div>
  )
}
