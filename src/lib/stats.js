import { decadeOf } from './format.js'
import { STATUS } from './constants.js'

export function computeStats(albums) {
  const owned = albums.filter((a) => a.status === STATUS.OWNED)
  const wishlist = albums.filter((a) => a.status === STATUS.WISHLIST)

  const totalValue = owned.reduce((s, a) => s + (a.estimatedValue ?? 0), 0)
  const totalSpent = owned.reduce((s, a) => s + (a.purchasePrice ?? 0), 0)

  const byGenre = {}
  const byDecade = {}
  const byArtist = {}
  const byCondition = {}

  for (const a of owned) {
    for (const g of a.genres ?? []) byGenre[g] = (byGenre[g] ?? 0) + 1
    const d = decadeOf(a.year)
    if (d) byDecade[d] = (byDecade[d] ?? 0) + 1
    if (a.artist) byArtist[a.artist] = (byArtist[a.artist] ?? 0) + 1
    if (a.condition) byCondition[a.condition] = (byCondition[a.condition] ?? 0) + 1
  }

  const toSortedPairs = (obj, numericKeys = false) =>
    Object.entries(obj)
      .map(([key, count]) => ({ key, count }))
      .sort((x, y) => (numericKeys ? Number(x.key) - Number(y.key) : y.count - x.count))

  const topArtists = toSortedPairs(byArtist).slice(0, 5)
  const rated = owned.filter((a) => a.rating)
  const avgRating = rated.length
    ? Math.round((rated.reduce((s, a) => s + a.rating, 0) / rated.length) * 10) / 10
    : null

  return {
    totalOwned: owned.length,
    totalWishlist: wishlist.length,
    totalValue,
    totalSpent,
    avgRating,
    genres: toSortedPairs(byGenre),
    decades: toSortedPairs(byDecade, true),
    conditions: toSortedPairs(byCondition),
    topArtists,
    topArtist: topArtists[0]?.key ?? null,
  }
}
