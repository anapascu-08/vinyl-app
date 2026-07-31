import { useState } from 'react'
import { initialsOf } from '../lib/format.js'
import { useI18n } from '../i18n/index.js'

export function CoverArt({ album, className = '' }) {
  const { t } = useI18n()
  const [failed, setFailed] = useState(false)
  const showImage = album.coverUrl && !failed

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-lg bg-violet-50
        ring-1 ring-violet-200 ${className}`}
    >
      {showImage ? (
        <img
          src={album.coverUrl}
          alt={t('cover.alt', { title: album.title, artist: album.artist })}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className="select-none text-2xl font-semibold tracking-wider text-violet-500"
          aria-hidden="true"
        >
          {initialsOf(album.artist) || '♫'}
        </span>
      )}
    </div>
  )
}
