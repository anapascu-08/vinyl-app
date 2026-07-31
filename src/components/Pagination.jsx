import { pageNumbers } from '../lib/pagination.js'
import { useI18n } from '../i18n/index.js'

function PageButton({ active, disabled, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={`min-w-[2.25rem] rounded-lg border px-2.5 py-1.5 text-sm transition-colors
        disabled:cursor-not-allowed disabled:opacity-40 ${
          active
            ? 'border-violet-400 bg-violet-200 font-semibold text-ink-900'
            : 'border-violet-300 bg-violet-50 text-ink-700 hover:bg-violet-100'
        }`}
    >
      {children}
    </button>
  )
}

export function Pagination({ page, totalPages, from, to, total, onChange, label }) {
  const { t } = useI18n()
  if (totalPages <= 1) return null

  return (
    <nav aria-label={label ?? t('pagination.label')} className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <p className="text-sm text-ink-500" aria-live="polite">
        {t('pagination.range', { from, to, total })}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <PageButton onClick={() => onChange(page - 1)} disabled={page === 1} label={t('pagination.prev')}>
          ‹
        </PageButton>

        {pageNumbers(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="px-1 text-sm text-ink-300" aria-hidden="true">
              …
            </span>
          ) : (
            <PageButton
              key={p}
              active={p === page}
              onClick={() => onChange(p)}
              label={t('pagination.page', { n: p })}
            >
              {p}
            </PageButton>
          )
        )}

        <PageButton
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          label={t('pagination.next')}
        >
          ›
        </PageButton>
      </div>
    </nav>
  )
}
