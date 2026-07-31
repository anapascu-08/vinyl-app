import { Link } from 'react-router-dom'
import { CoverArt } from './CoverArt.jsx'
import { Badge } from './ui.jsx'
import { StarRating } from './StarRating.jsx'

export function AlbumCard({ album, action }) {
  return (
    <div className="card group flex flex-col overflow-hidden transition-colors hover:border-violet-400">
      <Link to={`/album/${album.id}`} className="block">
        <CoverArt album={album} className="aspect-square w-full rounded-none" />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link to={`/album/${album.id}`} className="font-medium leading-tight hover:underline">
          {album.title}
        </Link>
        <p className="text-sm text-ink-700">{album.artist}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-xs text-ink-500">
          {album.year && <span>{album.year}</span>}
          <Badge>{album.condition}</Badge>
          {album.format !== 'LP' && <Badge>{album.format}</Badge>}
        </div>
        {album.rating ? <StarRating value={album.rating} size="sm" /> : null}
        {action}
      </div>
    </div>
  )
}
