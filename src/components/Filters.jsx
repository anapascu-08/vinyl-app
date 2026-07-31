import { GENRES, CONDITIONS, FORMATS } from '../lib/constants.js'
import { useI18n } from '../i18n/index.js'

const DECADES = [1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]

function Group({ title, options, selected, onToggle }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-700">
        {title}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = selected.includes(o.value)
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(o.value)}
              className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                active
                  ? 'border-violet-400 bg-violet-200 text-ink-900'
                  : 'border-violet-200 bg-violet-50 text-ink-700 hover:bg-violet-100'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Filters({ filters, onToggle, onReset, availableGenres }) {
  const { t } = useI18n()
  const genreOptions = (availableGenres.length ? availableGenres : GENRES).map((g) => ({
    value: g,
    label: g,
  }))
  const active =
    filters.genres.length + filters.decades.length + filters.conditions.length + filters.formats.length

  return (
    <div className="card space-y-4 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Group
          title={t('filter.genre')}
          options={genreOptions}
          selected={filters.genres}
          onToggle={(v) => onToggle('genres', v)}
        />
        <Group
          title={t('filter.decade')}
          options={DECADES.map((d) => ({ value: String(d), label: `${d}s` }))}
          selected={filters.decades}
          onToggle={(v) => onToggle('decades', v)}
        />
        <Group
          title={t('filter.condition')}
          options={CONDITIONS.map((c) => ({ value: c.value, label: c.value }))}
          selected={filters.conditions}
          onToggle={(v) => onToggle('conditions', v)}
        />
        <Group
          title={t('filter.format')}
          options={FORMATS.map((f) => ({ value: f, label: f }))}
          selected={filters.formats}
          onToggle={(v) => onToggle('formats', v)}
        />
      </div>
      {active > 0 && (
        <button type="button" onClick={onReset} className="text-sm text-violet-600 hover:underline">
          {t('filter.reset', { count: active })}
        </button>
      )}
    </div>
  )
}
