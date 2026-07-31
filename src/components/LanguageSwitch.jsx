import { useI18n, LANGUAGES } from '../i18n/index.js'

export function LanguageSwitch() {
  const { lang, setLang, t } = useI18n()

  return (
    <div
      role="group"
      aria-label={t('nav.language')}
      className="flex overflow-hidden rounded-lg border border-violet-300"
    >
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          title={l.label}
          className={`px-2.5 py-2 text-sm font-medium transition-colors ${
            lang === l.code ? 'bg-violet-200 text-ink-900' : 'text-ink-700 hover:bg-violet-50'
          }`}
        >
          <span aria-hidden="true">{l.short}</span>
          <span className="sr-only">{l.label}</span>
        </button>
      ))}
    </div>
  )
}
