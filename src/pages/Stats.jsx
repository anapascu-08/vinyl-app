import { useMemo } from 'react'
import { useCollection } from '../store/collectionStore.js'
import { computeStats } from '../lib/stats.js'
import { formatMoney } from '../lib/format.js'
import { Button, EmptyState, SectionTitle } from '../components/ui.jsx'
import { useI18n } from '../i18n/index.js'

function StatTile({ label, value, sub }) {
  return (
    <div className="card p-4">
      <p className="text-xs uppercase tracking-wider text-ink-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-500">{sub}</p>}
    </div>
  )
}

function BarList({ items, formatKey = (k) => k, emptyText }) {
  if (!items.length) return <p className="text-sm text-ink-500">{emptyText}</p>
  const max = Math.max(...items.map((i) => i.count))
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.key} className="flex items-center gap-3">
          <span className="w-28 flex-none truncate text-sm text-ink-700">{formatKey(item.key)}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-violet-50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
          <span className="w-8 flex-none text-right text-sm tabular-nums text-ink-500">{item.count}</span>
        </li>
      ))}
    </ul>
  )
}

export function Stats() {
  const { t, locale } = useI18n()
  const albums = useCollection((s) => s.albums)
  const stats = useMemo(() => computeStats(albums), [albums])

  if (stats.totalOwned === 0) {
    return (
      <EmptyState
        title={t('stats.empty.title')}
        description={t('stats.empty.body')}
        action={
          <Button as="link" to="/add">
            {t('stats.empty.add')}
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">{t('stats.title')}</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label={t('stats.owned')} value={stats.totalOwned} />
        <StatTile label={t('stats.wishlist')} value={stats.totalWishlist} />
        <StatTile
          label={t('stats.value')}
          value={formatMoney(stats.totalValue, locale)}
          sub={t('stats.spent', { amount: formatMoney(stats.totalSpent, locale) })}
        />
        <StatTile
          label={t('stats.topArtist')}
          value={stats.topArtist ?? '—'}
          sub={stats.avgRating ? t('stats.avgRating', { rating: stats.avgRating }) : undefined}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <SectionTitle>{t('stats.byGenre')}</SectionTitle>
          <BarList items={stats.genres} emptyText={t('stats.noGenres')} />
        </section>

        <section>
          <SectionTitle>{t('stats.byDecade')}</SectionTitle>
          <BarList
            items={stats.decades}
            formatKey={(k) => `${k}s`}
            emptyText={t('stats.noYears')}
          />
        </section>

        <section>
          <SectionTitle>{t('stats.topArtists')}</SectionTitle>
          <BarList items={stats.topArtists} emptyText="—" />
        </section>

        <section>
          <SectionTitle>{t('stats.byCondition')}</SectionTitle>
          <BarList items={stats.conditions} emptyText="—" />
        </section>
      </div>
    </div>
  )
}
