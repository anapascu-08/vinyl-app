import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/index.js'
import { TERMS, TERMS_UPDATED } from '../i18n/terms.js'
import { formatDate } from '../lib/format.js'

export function Terms() {
  const { t, lang, locale } = useI18n()
  const doc = TERMS[lang] ?? TERMS.en

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link to="/" className="text-sm text-violet-600 hover:underline">
          ← {t('action.back', { target: t('nav.collection').toLowerCase() })}
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">{doc.title}</h1>
        <p className="mt-1 text-xs text-ink-500">
          {doc.updated}: {formatDate(TERMS_UPDATED, locale)}
        </p>
      </div>

      <p className="text-ink-700">{doc.intro}</p>

      <div className="space-y-6">
        {doc.sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-violet-700">
              {section.title}
            </h2>
            <div className="space-y-2 text-ink-700">
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
