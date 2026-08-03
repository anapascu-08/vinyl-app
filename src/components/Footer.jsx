import { Link } from 'react-router-dom'
import { useCollection } from '../store/collectionStore.js'
import { useUI } from '../store/uiStore.js'
import { seedAlbums } from '../lib/seed.js'
import { useI18n } from '../i18n/index.js'

const RESOURCES = [
  { href: 'https://www.discogs.com', label: 'Discogs' },
  { href: 'https://vinyl.com', label: 'Shop Vinyl' },
  {
    href: 'https://support.discogs.com/hc/en-us/articles/360001566193-Database-Guidelines-14-Grading-And-Condition',
    key: 'footer.grading',
  },
]

function Group({ title, children }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-violet-700">{title}</span>
      {children}
    </div>
  )
}

const linkClass = 'text-ink-500 underline-offset-2 hover:text-violet-700 hover:underline'

export function Footer() {
  const { t } = useI18n()
  const albums = useCollection((s) => s.albums)
  const replaceAll = useCollection((s) => s.replaceAll)
  const toast = useUI((s) => s.toast)

  function exportJson() {
    const date = new Date().toISOString().slice(0, 10)
    const blob = new Blob([JSON.stringify({ version: 1, albums }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vinyl-collection-${date}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast(t('data.exportedToast'))
  }

  function loadDemo() {
    const seeded = seedAlbums()
    replaceAll(seeded)
    toast(t('data.demoToast', { count: seeded.length }))
  }

  return (
    <footer className="mt-12 border-t border-violet-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm">
        <Group title={t('footer.browse')}>
          <Link to="/" className={linkClass}>
            {t('nav.collection')}
          </Link>
          <Link to="/wishlist" className={linkClass}>
            {t('nav.wishlist')}
          </Link>
          <Link to="/stats" className={linkClass}>
            {t('nav.stats')}
          </Link>
          <Link to="/add" className={linkClass}>
            {t('action.add')}
          </Link>
        </Group>

        <Group title={t('footer.data')}>
          <button type="button" onClick={exportJson} className={linkClass}>
            {t('footer.export')}
          </button>
          <button type="button" onClick={loadDemo} className={linkClass}>
            {t('footer.demo')}
          </button>
        </Group>

        <Group title={t('footer.resources')}>
          {RESOURCES.map((r) => (
            <a
              key={r.href}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {r.key ? t(r.key) : r.label}
              <span className="sr-only"> ({t('footer.newTab')})</span>
            </a>
          ))}
        </Group>

        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-violet-100 pt-3 text-xs text-ink-500">
          <Link to="/terms" className={linkClass}>
            {t('footer.terms')}
          </Link>
          <span aria-hidden="true">·</span>
          <span>{t('footer.localOnly')}</span>
        </p>
      </div>
    </footer>
  )
}
