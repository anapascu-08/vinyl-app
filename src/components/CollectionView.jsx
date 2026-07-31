import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlbumCard } from './AlbumCard.jsx'
import { AlbumRow } from './AlbumRow.jsx'
import { Filters } from './Filters.jsx'
import { Button, EmptyState, Input, Select } from './ui.jsx'
import { useUI } from '../store/uiStore.js'
import { SORT_OPTIONS } from '../lib/constants.js'
import { applyFilters, FILTER_KEYS } from '../lib/filter.js'
import { paginate, PER_PAGE_OPTIONS, DEFAULT_PER_PAGE } from '../lib/pagination.js'
import { Pagination } from './Pagination.jsx'
import { useI18n } from '../i18n/index.js'
import { StableText, longestLength } from './StableText.jsx'

function readFilters(params) {
  const out = {}
  for (const key of FILTER_KEYS) {
    const raw = params.get(key)
    out[key] = raw ? raw.split(',').filter(Boolean) : []
  }
  return out
}

export function CollectionView({ albums, emptyState, cardAction }) {
  const { t } = useI18n()
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const view = useUI((s) => s.view)
  const setView = useUI((s) => s.setView)

  const q = params.get('q') ?? ''
  const sort = params.get('sort') ?? 'artist'
  const filters = useMemo(() => readFilters(params), [params])
  const requestedPage = Number(params.get('page')) || 1
  const perPage = PER_PAGE_OPTIONS.includes(Number(params.get('per')))
    ? Number(params.get('per'))
    : DEFAULT_PER_PAGE

  function patchParams(patch) {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(patch)) {
      if (!value || (Array.isArray(value) && value.length === 0)) next.delete(key)
      else next.set(key, Array.isArray(value) ? value.join(',') : value)
    }
    // Orice schimbare de căutare, filtre sau sortare readuce lista la prima pagină.
    if (!('page' in patch)) next.delete('page')
    setParams(next, { replace: true })
  }

  function goToPage(nextPage) {
    patchParams({ page: nextPage <= 1 ? '' : String(nextPage) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggleFilter(key, value) {
    const current = filters[key]
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    patchParams({ [key]: next })
  }

  function resetFilters() {
    patchParams({ genres: [], decades: [], conditions: [], formats: [] })
  }

  const visible = useMemo(() => applyFilters(albums, { q, filters, sort }), [albums, q, filters, sort])
  const availableGenres = useMemo(
    () => [...new Set(albums.flatMap((a) => a.genres ?? []))].sort((a, b) => a.localeCompare(b, 'ro')),
    [albums]
  )
  const pageData = useMemo(
    () => paginate(visible, requestedPage, perPage),
    [visible, requestedPage, perPage]
  )
  const activeFilterCount = FILTER_KEYS.reduce((n, k) => n + filters[k].length, 0)
  const hasFiltering = Boolean(q) || activeFilterCount > 0

  if (albums.length === 0) return emptyState

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          id="cauta"
          type="search"
          value={q}
          onChange={(e) => patchParams({ q: e.target.value })}
          placeholder={t('collection.search')}
          aria-label={t('collection.searchLabel')}
          className="min-w-[12rem] flex-1"
        />
        <Button variant="ghost" onClick={() => setFiltersOpen((v) => !v)} aria-expanded={filtersOpen}>
          <StableText k="collection.filters" className="justify-items-center" />
          {activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </Button>
        <Select
          value={sort}
          onChange={(e) => patchParams({ sort: e.target.value })}
          aria-label={t('collection.sortLabel')}
          className="w-auto"
          style={{ minWidth: `${longestLength(...SORT_OPTIONS.map((o) => o.key)) + 6}ch` }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {t(o.key)}
            </option>
          ))}
        </Select>
        <div className="flex overflow-hidden rounded-lg border border-violet-300" role="group" aria-label={t('collection.viewMode')}>
          {['grid', 'list'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              aria-pressed={view === mode}
              className={`px-3 py-2 text-sm ${view === mode ? 'bg-violet-200' : 'hover:bg-violet-50'}`}
            >
              <StableText
                k={mode === 'grid' ? 'collection.grid' : 'collection.list'}
                className="justify-items-center"
              />
            </button>
          ))}
        </div>
      </div>

      {filtersOpen && (
        <Filters
          filters={filters}
          onToggle={toggleFilter}
          onReset={resetFilters}
          availableGenres={availableGenres}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500" aria-live="polite">
          {pageData.totalPages > 1
            ? t('collection.count.range', {
                from: pageData.from,
                to: pageData.to,
                total: visible.length,
              })
            : t(visible.length === 1 ? 'collection.count.one' : 'collection.count.many', {
                count: visible.length,
              })}
          {hasFiltering ? t('collection.count.filtered', { total: albums.length }) : ''}
        </p>

        {visible.length > PER_PAGE_OPTIONS[0] && (
          <label className="flex items-center gap-2 text-sm text-ink-500">
            <StableText k="pagination.perPage" />
            <Select
              value={String(perPage)}
              onChange={(e) => patchParams({ per: e.target.value, page: '' })}
              aria-label={t('pagination.perPageLabel')}
              className="w-auto py-1"
            >
              {PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </label>
        )}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title={t('collection.noMatch.title')}
          description={t('collection.noMatch.body')}
          action={
            <Button
              variant="ghost"
              onClick={() => {
                patchParams({ q: '' })
                resetFilters()
              }}
            >
              {t('collection.noMatch.reset')}
            </Button>
          }
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pageData.items.map((a) => (
            <AlbumCard key={a.id} album={a} action={cardAction?.(a)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {pageData.items.map((a) => (
            <AlbumRow key={a.id} album={a} action={cardAction?.(a)} />
          ))}
        </div>
      )}

      <Pagination
        page={pageData.page}
        totalPages={pageData.totalPages}
        from={pageData.from}
        to={pageData.to}
        total={pageData.total}
        onChange={goToPage}
      />
    </div>
  )
}
