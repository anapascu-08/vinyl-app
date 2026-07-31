import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useCollection } from '../store/collectionStore.js'
import { useUI } from '../store/uiStore.js'
import { CoverArt } from '../components/CoverArt.jsx'
import { StarRating } from '../components/StarRating.jsx'
import { Button, Badge, SectionTitle, Textarea } from '../components/ui.jsx'
import { ConfirmDialog } from '../components/Modal.jsx'
import { NotFound } from './NotFound.jsx'
import { formatMoney, formatDate } from '../lib/format.js'
import { CONDITIONS, MAX_NOTES, STATUS } from '../lib/constants.js'
import { useI18n } from '../i18n/index.js'

function conditionLabel(t, value) {
  const found = CONDITIONS.find((c) => c.value === value)
  return found ? t(found.key) : (value ?? '—')
}

function Meta({ label, children }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-ink-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink-900">{children ?? '—'}</dd>
    </div>
  )
}

export function AlbumDetail() {
  const { t, locale } = useI18n()
  const { id } = useParams()
  const navigate = useNavigate()
  const album = useCollection((s) => s.albums.find((a) => a.id === id))
  const patchAlbum = useCollection((s) => s.patchAlbum)
  const removeAlbum = useCollection((s) => s.removeAlbum)
  const toast = useUI((s) => s.toast)

  const [confirming, setConfirming] = useState(false)
  const [notes, setNotes] = useState(album?.notes ?? '')
  const timer = useRef(null)

  useEffect(() => {
    setNotes(album?.notes ?? '')
  }, [album?.id])

  useEffect(() => () => clearTimeout(timer.current), [])

  if (!album) {
    return (
      <NotFound title={t('detail.notFound.title')} description={t('detail.notFound.body')} />
    )
  }

  function onNotesChange(value) {
    setNotes(value)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => patchAlbum(album.id, { notes: value }), 500)
  }

  function confirmDelete() {
    removeAlbum(album.id)
    setConfirming(false)
    toast(t('detail.deletedToast', { title: album.title }))
    navigate(album.status === STATUS.WISHLIST ? '/wishlist' : '/')
  }

  return (
    <div className="space-y-8">
      <Link to={album.status === STATUS.WISHLIST ? '/wishlist' : '/'} className="text-sm text-violet-600 hover:underline">
        ←{' '}
        {t('action.back', {
          target:
            album.status === STATUS.WISHLIST
              ? t('nav.wishlist').toLowerCase()
              : t('nav.collection').toLowerCase(),
        })}
      </Link>

      <div className="grid gap-6 md:grid-cols-[16rem,1fr]">
        <CoverArt album={album} className="aspect-square w-full" />

        <div className="space-y-4">
          <div>
            {album.status === STATUS.WISHLIST && <Badge className="mb-2">{t('detail.onWishlist')}</Badge>}
            <h1 className="text-2xl font-semibold">{album.title}</h1>
            <p className="text-lg text-ink-700">{album.artist}</p>
          </div>

          <StarRating value={album.rating} onChange={(v) => patchAlbum(album.id, { rating: v })} />

          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Meta label={t('detail.year')}>{album.year}</Meta>
            <Meta label={t('detail.format')}>{album.format}</Meta>
            <Meta label={t('detail.label')}>{album.label}</Meta>
            <Meta label={t('detail.genres')}>{(album.genres ?? []).join(', ') || null}</Meta>
            <Meta label={t('detail.condition')}>{conditionLabel(t, album.condition)}</Meta>
            <Meta label={t('detail.sleeve')}>
              {album.sleeveCondition ? conditionLabel(t, album.sleeveCondition) : null}
            </Meta>
            <Meta label={t('detail.price')}>{formatMoney(album.purchasePrice, locale)}</Meta>
            <Meta label={t('detail.date')}>{formatDate(album.purchaseDate, locale)}</Meta>
            <Meta label={t('detail.value')}>{formatMoney(album.estimatedValue, locale)}</Meta>
          </dl>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button as="link" to={`/album/${album.id}/edit`} variant="ghost">
              {t('action.edit')}
            </Button>
            <Button variant="danger" onClick={() => setConfirming(true)}>
              {t('action.delete')}
            </Button>
          </div>
        </div>
      </div>

      <section>
        <SectionTitle>{t('detail.notes')}</SectionTitle>
        <Textarea
          id="notite"
          rows={5}
          maxLength={MAX_NOTES}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={t('detail.notesPlaceholder')}
        />
        <p className="mt-1 text-xs text-ink-500">{t('detail.notesAutosave')}</p>
      </section>

      <section>
        <SectionTitle>{t('detail.tracklist')}</SectionTitle>
        {(album.tracklist ?? []).length === 0 ? (
          <p className="text-sm text-ink-500">
            {t('detail.noTracklist')}{' '}
            <Link to={`/album/${album.id}/edit`} className="text-violet-600 hover:underline">
              {t('detail.addTracklist')}
            </Link>
          </p>
        ) : (
          <ol className="card divide-y divide-violet-100">
            {album.tracklist.map((t, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="w-10 flex-none text-ink-500">{t.position || i + 1}</span>
                <span className="flex-1">{t.title}</span>
                <span className="text-ink-500">{t.duration || ''}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <ConfirmDialog
        open={confirming}
        danger
        title={t('detail.deleteTitle')}
        message={t('detail.deleteBody', { title: album.title, artist: album.artist })}
        confirmLabel={t('action.deleteForever')}
        onConfirm={confirmDelete}
        onCancel={() => setConfirming(false)}
      />
    </div>
  )
}
