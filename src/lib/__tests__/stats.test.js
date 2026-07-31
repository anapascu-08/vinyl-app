import { describe, it, expect } from 'vitest'
import { computeStats } from '../stats.js'

const albums = [
  { id: '1', artist: 'A', title: 'x', year: 1975, genres: ['Rock'], condition: 'VG', estimatedValue: 100, purchasePrice: 50, rating: 4, status: 'owned' },
  { id: '2', artist: 'A', title: 'y', year: 1978, genres: ['Rock', 'Pop'], condition: 'NM', estimatedValue: 200, purchasePrice: 80, rating: 5, status: 'owned' },
  { id: '3', artist: 'B', title: 'z', year: 1991, genres: ['Jazz'], condition: 'VG', estimatedValue: 50, purchasePrice: null, status: 'owned' },
  { id: '4', artist: 'C', title: 'w', year: 2001, genres: ['Jazz'], condition: 'M', estimatedValue: 999, status: 'wishlist' },
]

describe('computeStats', () => {
  const s = computeStats(albums)

  it('numără corect colecția și wishlist-ul', () => {
    expect(s.totalOwned).toBe(3)
    expect(s.totalWishlist).toBe(1)
  })

  it('ignoră wishlist-ul la valoare și cost', () => {
    expect(s.totalValue).toBe(350)
    expect(s.totalSpent).toBe(130)
  })

  it('grupează pe genuri', () => {
    expect(s.genres.find((g) => g.key === 'Rock').count).toBe(2)
    expect(s.genres.find((g) => g.key === 'Jazz').count).toBe(1)
  })

  it('grupează pe decenii, în ordine cronologică', () => {
    expect(s.decades.map((d) => d.key)).toEqual(['1970', '1990'])
    expect(s.decades[0].count).toBe(2)
  })

  it('identifică artistul cel mai reprezentat', () => {
    expect(s.topArtist).toBe('A')
  })

  it('calculează ratingul mediu doar pe discurile evaluate', () => {
    expect(s.avgRating).toBe(4.5)
  })

  it('întoarce zerouri pe colecție goală', () => {
    const empty = computeStats([])
    expect(empty.totalOwned).toBe(0)
    expect(empty.totalValue).toBe(0)
    expect(empty.avgRating).toBe(null)
  })
})
