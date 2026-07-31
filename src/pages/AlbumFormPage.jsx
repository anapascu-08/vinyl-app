import { useEffect, useState } from 'react'
import { useNavigate, useParams, useBeforeUnload } from 'react-router-dom'
import { useCollection, findDuplicate } from '../store/collectionStore.js'
import { useUI } from '../store/uiStore.js'
import { validateAlbum, isValid } from '../lib/validation.js'
import { EMPTY_ALBUM, toFormValues } from '../lib/album.js'
import {
  FORMATS, CONDITIONS, GENRES, MAX_GENRES, MAX_NOTES,
  MAX_COVER_BYTES, CURRENT_YEAR, STATUS,
} from '../lib/constants.js'
import { Button, Field, Input, Select, Textarea, SectionTitle } from '../components/ui.jsx'
import { ConfirmDialog } from '../components/Modal.jsx'
import { StarRating } from '../components/StarRating.jsx'
import { CoverArt } from '../components/CoverArt.jsx'
import { NotFound } from './NotFound.jsx'
import { useI18n } from '../i18n/index.js'
import { generateCover } from '../lib/coverArt.js'

export function AlbumFormPage({ mode }) {
  const { t } = useI18n()
  const { id } = useParams()
  const navigate = useNavigate()
  const albums = useCollection((s) => s.albums)
  const existing = mode === 'edit' ? albums.find((a) => a.id === id) : null
  const addAlbum = useCollection((s) => s.addAlbum)
  const updateAlbum = useCollection((s) => s.updateAlbum)
  const toast = useUI((s) => s.toast)

  const [values, setValues] = useState(() => (existing ? toFormValues(existing) : { ...EMPTY_ALBUM }))
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [dirty, setDirty] = useState(false)
  const [leaveTo, setLeaveTo] = useState(null)
  const [dupWarning, setDupWarning] = useState(null)

  useEffect(() => {
    if (existing) setValues(toFormValues(existing))
  }, [existing?.id])

  useBeforeUnload((e) => {
    if (dirty) e.preventDefault()
  })

  if (mode === 'edit' && !existing) {
    return <NotFound title={t('detail.notFound.title')} description={t('detail.editNotFound')} />
  }

  function set(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
    setDirty(true)
    if (touched[field]) {
      setErrors(validateAlbum({ ...values, [field]: value }))
    }
  }

  function blur(field) {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors(validateAlbum(values))
  }

  function toggleGenre(genre) {
    const has = values.genres.includes(genre)
    if (!has && values.genres.length >= MAX_GENRES) return
    set('genres', has ? values.genres.filter((g) => g !== genre) : [...values.genres, genre])
  }

  function setTrack(index, patch) {
    const next = values.tracklist.map((t, i) => (i === index ? { ...t, ...patch } : t))
    set('tracklist', next)
  }

  function addTrack() {
    set('tracklist', [...values.tracklist, { position: '', title: '', duration: '' }])
  }

  function removeTrack(index) {
    set('tracklist', values.tracklist.filter((_, i) => i !== index))
  }

  async function onCoverFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors((x) => ({ ...x, coverUrl: ['validation.coverType'] }))
      return
    }
    if (file.size > MAX_COVER_BYTES) {
      setErrors((x) => ({ ...x, coverUrl: ['validation.coverSize'] }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      set('coverUrl', String(reader.result))
      setErrors((x) => {
        const { coverUrl, ...rest } = x
        return rest
      })
    }
    reader.readAsDataURL(file)
  }

  function submit(e, { ignoreDuplicate = false } = {}) {
    e?.preventDefault?.()
    const found = validateAlbum(values)
    setErrors(found)
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])))
    if (!isValid(found)) {
      const first = document.querySelector('[aria-invalid="true"]')
      first?.focus()
      return
    }

    if (!ignoreDuplicate) {
      const dup = findDuplicate(albums, values.artist, values.title, existing?.id)
      if (dup) {
        setDupWarning(dup)
        return
      }
    }

    setDirty(false)
    if (mode === 'edit') {
      updateAlbum(existing.id, values)
      toast(t('form.savedToast'))
      navigate(`/album/${existing.id}`)
    } else {
      const album = addAlbum(values)
      toast(t('form.addedToast', { title: album.title }))
      navigate(`/album/${album.id}`)
    }
  }

  function goBack() {
    const target = mode === 'edit' ? `/album/${existing.id}` : '/'
    if (dirty) setLeaveTo(target)
    else navigate(target)
  }

  // Erorile sunt [cheie, params]; le traducem doar la randare.
  const err = (field) =>
    touched[field] && errors[field] ? t(...errors[field]) : undefined

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-8" noValidate>
      <h1 className="text-2xl font-semibold">
        {t(mode === 'edit' ? 'form.editTitle' : 'form.addTitle')}
      </h1>

      <section className="space-y-4">
        <SectionTitle>{t('form.section.basic')}</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('form.artist')} htmlFor="artist" error={err('artist')}>
            <Input
              id="artist"
              value={values.artist}
              onChange={(e) => set('artist', e.target.value)}
              onBlur={() => blur('artist')}
              error={err('artist')}
              required
            />
          </Field>
          <Field label={t('form.title')} htmlFor="title" error={err('title')}>
            <Input
              id="title"
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
              onBlur={() => blur('title')}
              error={err('title')}
              required
            />
          </Field>
          <Field
            label={t('form.year')}
            htmlFor="year"
            error={err('year')}
            hint={t('form.yearHint', { year: CURRENT_YEAR })}
          >
            <Input
              id="year"
              type="number"
              inputMode="numeric"
              value={values.year}
              onChange={(e) => set('year', e.target.value)}
              onBlur={() => blur('year')}
              error={err('year')}
            />
          </Field>
          <Field label={t('form.label')} htmlFor="label">
            <Input id="label" value={values.label} onChange={(e) => set('label', e.target.value)} />
          </Field>
          <Field label={t('form.format')} htmlFor="format" error={err('format')}>
            <Select id="format" value={values.format} onChange={(e) => set('format', e.target.value)}>
              {FORMATS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </Select>
          </Field>
          <Field label={t('form.list')} htmlFor="status">
            <Select id="status" value={values.status} onChange={(e) => set('status', e.target.value)}>
              <option value={STATUS.OWNED}>{t('form.inCollection')}</option>
              <option value={STATUS.WISHLIST}>{t('form.onWishlist')}</option>
            </Select>
          </Field>
        </div>

        <Field
          label={t('form.genres', { max: MAX_GENRES })}
          htmlFor="genres"
          error={err('genres')}
          hint={t('form.genresHint', { count: values.genres.length, max: MAX_GENRES })}
        >
          <div className="flex flex-wrap gap-1.5" id="genres">
            {GENRES.map((g) => {
              const active = values.genres.includes(g)
              const disabled = !active && values.genres.length >= MAX_GENRES
              return (
                <button
                  key={g}
                  type="button"
                  aria-pressed={active}
                  disabled={disabled}
                  onClick={() => toggleGenre(g)}
                  className={`rounded-full border px-2.5 py-1 text-xs transition-colors disabled:opacity-40 ${
                    active
                      ? 'border-violet-400 bg-violet-200 text-ink-900'
                      : 'border-violet-200 bg-violet-50 text-ink-700 hover:bg-violet-100'
                  }`}
                >
                  {g}
                </button>
              )
            })}
          </div>
        </Field>
      </section>

      <section className="space-y-4">
        <SectionTitle>{t('form.section.condition')}</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('form.discCondition')} htmlFor="condition" error={err('condition')}>
            <Select id="condition" value={values.condition} onChange={(e) => set('condition', e.target.value)}>
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {t(c.key)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t('form.sleeveCondition')} htmlFor="sleeveCondition" error={err('sleeveCondition')}>
            <Select
              id="sleeveCondition"
              value={values.sleeveCondition}
              onChange={(e) => set('sleeveCondition', e.target.value)}
            >
              <option value="">{t('form.unspecified')}</option>
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {t(c.key)}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </section>

      <section className="space-y-4" id="purchase">
        <SectionTitle>{t('form.section.purchase')}</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={t('form.price')} htmlFor="purchasePrice" error={err('purchasePrice')}>
            <Input
              id="purchasePrice"
              type="number"
              min="0"
              step="1"
              value={values.purchasePrice}
              onChange={(e) => set('purchasePrice', e.target.value)}
              onBlur={() => blur('purchasePrice')}
              error={err('purchasePrice')}
            />
          </Field>
          <Field label={t('form.date')} htmlFor="purchaseDate" error={err('purchaseDate')}>
            <Input
              id="purchaseDate"
              type="date"
              value={values.purchaseDate}
              onChange={(e) => set('purchaseDate', e.target.value)}
              onBlur={() => blur('purchaseDate')}
              error={err('purchaseDate')}
            />
          </Field>
          <Field label={t('form.value')} htmlFor="estimatedValue" error={err('estimatedValue')}>
            <Input
              id="estimatedValue"
              type="number"
              min="0"
              step="1"
              value={values.estimatedValue}
              onChange={(e) => set('estimatedValue', e.target.value)}
              onBlur={() => blur('estimatedValue')}
              error={err('estimatedValue')}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>{t('form.section.cover')}</SectionTitle>
        <div className="flex flex-wrap items-start gap-4">
          <CoverArt album={values} className="h-28 w-28 flex-none" />
          <div className="min-w-[14rem] flex-1 space-y-3">
            <Field
              label={t('form.coverUrl')}
              htmlFor="coverUrl"
              error={err('coverUrl') ?? (errors.coverUrl ? t(...errors.coverUrl) : undefined)}
            >
              <Input
                id="coverUrl"
                type="url"
                placeholder="https://…"
                value={values.coverUrl.startsWith('data:') ? '' : values.coverUrl}
                onChange={(e) => set('coverUrl', e.target.value)}
                onBlur={() => blur('coverUrl')}
                error={err('coverUrl')}
                disabled={values.coverUrl.startsWith('data:')}
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center rounded-lg border border-violet-300 bg-violet-50 px-3.5 py-2 text-sm hover:bg-violet-100">
                {t('form.upload')}
                <input type="file" accept="image/*" className="sr-only" onChange={onCoverFile} />
              </label>
              <Button
                variant="ghost"
                type="button"
                disabled={!values.artist.trim() || !values.title.trim()}
                onClick={() => set('coverUrl', generateCover(values))}
              >
                {t('form.generate')}
              </Button>
              {values.coverUrl && (
                <Button variant="subtle" type="button" onClick={() => set('coverUrl', '')}>
                  {t('form.removeCover')}
                </Button>
              )}
            </div>
            <p className="text-xs text-ink-500">
              {t('form.coverHint')}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>{t('form.section.personal')}</SectionTitle>
        <Field label={t('detail.rating')} htmlFor="rating">
          <StarRating value={values.rating} onChange={(v) => set('rating', v)} />
        </Field>
        <Field
          label={t('form.notes')}
          htmlFor="notes"
          error={err('notes')}
          hint={`${values.notes.length}/${MAX_NOTES}`}
        >
          <Textarea
            id="notes"
            rows={4}
            value={values.notes}
            onChange={(e) => set('notes', e.target.value)}
            onBlur={() => blur('notes')}
            error={err('notes')}
          />
        </Field>
      </section>

      <section className="space-y-3">
        <SectionTitle>{t('form.section.tracklist')}</SectionTitle>
        {errors.tracklist && <p className="err">{t(...errors.tracklist)}</p>}
        {values.tracklist.map((t, i) => (
          <div key={i} className="flex flex-wrap items-end gap-2">
            <Field label={i === 0 ? t('form.position') : undefined} htmlFor={`pos-${i}`} className="w-20">
              <Input
                id={`pos-${i}`}
                value={t.position}
                placeholder="A1"
                onChange={(e) => setTrack(i, { position: e.target.value })}
              />
            </Field>
            <Field
              label={i === 0 ? t('form.trackTitle') : undefined}
              htmlFor={`tt-${i}`}
              className="min-w-[10rem] flex-1"
            >
              <Input
                id={`tt-${i}`}
                value={t.title}
                onChange={(e) => setTrack(i, { title: e.target.value })}
              />
            </Field>
            <Field label={i === 0 ? t('form.duration') : undefined} htmlFor={`du-${i}`} className="w-24">
              <Input
                id={`du-${i}`}
                value={t.duration}
                placeholder="4:32"
                onChange={(e) => setTrack(i, { duration: e.target.value })}
              />
            </Field>
            <Button
              type="button"
              variant="subtle"
              onClick={() => removeTrack(i)}
              aria-label={t('form.deleteTrack', { n: i + 1 })}
            >
              ✕
            </Button>
          </div>
        ))}
        <Button type="button" variant="ghost" onClick={addTrack}>
          {t('form.addTrack')}
        </Button>
      </section>

      <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-violet-200 bg-white/90 py-4 backdrop-blur">
        <Button type="submit">{t(mode === 'edit' ? 'action.save' : 'action.create')}</Button>
        <Button type="button" variant="ghost" onClick={goBack}>
          {t('action.cancel')}
        </Button>
      </div>

      <ConfirmDialog
        open={leaveTo !== null}
        title={t('form.leaveTitle')}
        message={t('form.leaveBody')}
        confirmLabel={t('form.leaveConfirm')}
        danger
        onConfirm={() => {
          const target = leaveTo
          setLeaveTo(null)
          setDirty(false)
          navigate(target)
        }}
        onCancel={() => setLeaveTo(null)}
      />

      <ConfirmDialog
        open={dupWarning !== null}
        title={t('form.dupTitle')}
        message={t('form.dupBody', { title: dupWarning?.title ?? '', artist: dupWarning?.artist ?? '' })}
        confirmLabel={t('form.dupConfirm')}
        onConfirm={() => {
          setDupWarning(null)
          submit(null, { ignoreDuplicate: true })
        }}
        onCancel={() => setDupWarning(null)}
      />
    </form>
  )
}
