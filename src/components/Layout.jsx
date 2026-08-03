import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from './ui.jsx'
import { DataMenu } from './DataMenu.jsx'
import { Toasts } from './Toasts.jsx'
import { StorageBanner } from './StorageBanner.jsx'
import { LanguageSwitch } from './LanguageSwitch.jsx'
import { Footer } from './Footer.jsx'
import { useI18n } from '../i18n/index.js'
import { StableText } from './StableText.jsx'
import logo from '../assets/save-the-vinyl.webp'

const LINKS = [
  { to: '/', key: 'nav.collection', end: true },
  { to: '/wishlist', key: 'nav.wishlist' },
  { to: '/stats', key: 'nav.stats' },
]

export function Layout() {
  const navigate = useNavigate()
  const { t, lang } = useI18n()

  // Ține atributul lang și titlul paginii sincronizate cu limba aleasă.
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t('app.name')
  }, [lang, t])

  return (
    <div className="min-h-screen">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50
                   focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
      >
        {t('nav.skip')}
      </a>

      <StorageBanner />

      <header className="sticky top-0 z-40 border-b border-violet-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 text-lg font-semibold">
            <img
              src={logo}
              alt=""
              width="1000"
              height="811"
              className="h-14 w-auto flex-none rounded-md ring-1 ring-violet-200 sm:h-16"
            />
            <StableText
              k="app.name"
              className="bg-gradient-to-r from-violet-700 to-sky-600 bg-clip-text text-transparent"
            />
          </NavLink>

          <nav aria-label={t('nav.main')} className="flex items-center gap-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    isActive ? 'bg-violet-200 text-ink-900' : 'text-ink-700 hover:bg-violet-50'
                  }`
                }
              >
                <StableText k={l.key} className="justify-items-center" />
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitch />
            <DataMenu />
            <Button onClick={() => navigate('/add')}>
              <StableText k="action.add" className="justify-items-center" />
            </Button>
          </div>
        </div>
      </header>

      <main id="content" className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <Footer />

      <Toasts />
    </div>
  )
}
