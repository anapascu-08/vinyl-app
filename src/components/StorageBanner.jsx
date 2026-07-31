import { useCollection } from '../store/collectionStore.js'
import { Button } from './ui.jsx'
import { useI18n } from '../i18n/index.js'

export function StorageBanner() {
  const { t } = useI18n()
  const error = useCollection((s) => s.storageError)
  const raw = useCollection((s) => s.corruptRaw)
  const dismiss = useCollection((s) => s.dismissStorageError)

  if (!error) return null

  function downloadRaw() {
    const blob = new Blob([raw ?? ''], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vinyl-app-date-brute.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div role="alert" className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
        <span className="flex-1">
          {error === 'unavailable' ? t('storage.unavailable') : t('storage.corrupt')}
        </span>
        {error === 'corrupt' && raw && (
          <Button variant="ghost" onClick={downloadRaw}>
            {t('storage.download')}
          </Button>
        )}
        <Button variant="subtle" onClick={dismiss}>
          {t('action.close')}
        </Button>
      </div>
    </div>
  )
}
