import { useRef, useState } from 'react'
import { useCollection } from '../store/collectionStore.js'
import { useUI } from '../store/uiStore.js'
import { parseImport } from '../lib/storage.js'
import { seedAlbums } from '../lib/seed.js'
import { Button } from './ui.jsx'
import { Modal } from './Modal.jsx'
import { useI18n } from '../i18n/index.js'
import { StableText } from './StableText.jsx'

export function DataMenu() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(null) // { albums }
  const fileRef = useRef(null)
  const albums = useCollection((s) => s.albums)
  const replaceAll = useCollection((s) => s.replaceAll)
  const mergeAlbums = useCollection((s) => s.mergeAlbums)
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
    setOpen(false)
    toast(t('data.exportedToast'))
  }

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const text = await file.text()
    const result = parseImport(text)
    if (!result.ok) {
      toast(t('data.importFailed', { reason: t(...result.reason) }), 'error')
      return
    }
    setOpen(false)
    setPending(result.albums)
  }

  function applyImport(mode) {
    if (mode === 'replace') {
      replaceAll(pending)
      toast(t('data.replacedToast', { count: pending.length }))
    } else {
      const added = mergeAlbums(pending)
      toast(added === 0 ? t('data.mergedNone') : t('data.mergedToast', { count: added }))
    }
    setPending(null)
  }

  function loadDemo() {
    const albums = seedAlbums()
    replaceAll(albums)
    setOpen(false)
    toast(t('data.demoToast', { count: albums.length }))
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        <StableText k="action.data" className="justify-items-center" />
      </Button>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={onFile}
      />

      <Modal open={open} onClose={() => setOpen(false)} title={t('data.title')}>
        <div className="flex flex-col gap-2">
          <Button variant="ghost" onClick={exportJson} data-autofocus>
            {t('data.export')}
          </Button>
          <Button variant="ghost" onClick={() => fileRef.current?.click()}>
            {t('data.import')}
          </Button>
          <Button variant="subtle" onClick={loadDemo}>
            {t('data.demo')}
          </Button>
          <p className="mt-2 text-xs text-ink-500">
            {t('data.hint')}
          </p>
        </div>
      </Modal>

      <Modal
        open={pending !== null}
        onClose={() => setPending(null)}
        title={t('data.importTitle')}
        footer={
          <>
            <Button variant="subtle" onClick={() => setPending(null)}>
              {t('action.cancel')}
            </Button>
            <Button variant="ghost" onClick={() => applyImport('merge')} data-autofocus>
              {t('data.merge')}
            </Button>
            <Button variant="danger" onClick={() => applyImport('replace')}>
              {t('data.replace')}
            </Button>
          </>
        }
      >
        {t('data.importBody', { count: pending?.length ?? 0 })}
      </Modal>
    </>
  )
}
