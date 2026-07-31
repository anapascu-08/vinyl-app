import { Link } from 'react-router-dom'
import { CoverArt } from './CoverArt.jsx'
import { Badge } from './ui.jsx'
import { formatMoney } from '../lib/format.js'

export function AlbumRow({ album, action }) {
  return (
    <div className="card flex items-center gap-3 p-2.5 transition-colors hover:border-violet-400">
      <CoverArt album={album} className="h-12 w-12 flex-none" />
      <div className="min-w-0 flex-1">
        <Link to={`/album/${album.id}`} className="block truncate font-medium hover:underline">
          {album.title}
        </Link>
        <p className="truncate text-sm text-ink-700">{album.artist}</p>
      </div>
      <div className="hidden w-16 text-sm text-ink-500 sm:block">{album.year ?? '—'}</div>
      <div className="hidden w-40 truncate text-sm text-ink-500 md:block">
        {(album.genres ?? []).join(', ') || '—'}
      </div>
      <div className="hidden w-24 text-right text-sm text-ink-500 md:block">
        {formatMoney(album.estimatedValue)}
      </div>
      <Badge className="flex-none">{album.condition}</Badge>
      {action}
    </div>
  )
}
