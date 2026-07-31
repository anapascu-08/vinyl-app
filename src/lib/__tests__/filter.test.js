import { describe, it, expect } from 'vitest'
import { applyFilters, EMPTY_FILTERS } from '../filter.js'

const albums = [
  { id: '1', artist: 'Björk', title: 'Homogenic', year: 1997, genres: ['Electronic'], condition: 'VG', format: 'LP', estimatedValue: 210, createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', artist: 'Pink Floyd', title: 'Animals', year: 1977, genres: ['Rock'], condition: 'NM', format: 'LP', estimatedValue: 400, createdAt: '2024-03-01T00:00:00Z' },
  { id: '3', artist: 'Aphex Twin', title: 'Drukqs', year: 2001, genres: ['Electronic', 'Ambient'], condition: 'VG', format: '12"', estimatedValue: 300, createdAt: '2024-02-01T00:00:00Z' },
]
const f = (over = {}) => ({ q: '', filters: { ...EMPTY_FILTERS }, sort: 'artist', ...over })

describe('applyFilters', () => {
  it('caută ignorând diacriticele', () => {
    expect(applyFilters(albums, f({ q: 'bjork' })).map((a) => a.id)).toEqual(['1'])
  })

  it('caută și în titlu', () => {
    expect(applyFilters(albums, f({ q: 'animals' })).map((a) => a.id)).toEqual(['2'])
  })

  it('combină categoriile cu ȘI', () => {
    const r = applyFilters(albums, f({ filters: { ...EMPTY_FILTERS, genres: ['Electronic'], formats: ['LP'] } }))
    expect(r.map((a) => a.id)).toEqual(['1'])
  })

  it('combină valorile aceleiași categorii cu SAU', () => {
    const r = applyFilters(albums, f({ filters: { ...EMPTY_FILTERS, conditions: ['VG', 'NM'] } }))
    expect(r).toHaveLength(3)
  })

  it('filtrează pe decadă', () => {
    const r = applyFilters(albums, f({ filters: { ...EMPTY_FILTERS, decades: ['1990'] } }))
    expect(r.map((a) => a.id)).toEqual(['1'])
  })

  it('sortează după artist implicit', () => {
    expect(applyFilters(albums, f()).map((a) => a.artist)).toEqual(['Aphex Twin', 'Björk', 'Pink Floyd'])
  })

  it('sortează după an și valoare', () => {
    expect(applyFilters(albums, f({ sort: 'year-asc' })).map((a) => a.year)).toEqual([1977, 1997, 2001])
    expect(applyFilters(albums, f({ sort: 'value' })).map((a) => a.id)).toEqual(['2', '3', '1'])
    expect(applyFilters(albums, f({ sort: 'recent' })).map((a) => a.id)).toEqual(['2', '3', '1'])
  })

  it('nu modifică array-ul original', () => {
    const before = albums.map((a) => a.id)
    applyFilters(albums, f({ sort: 'value' }))
    expect(albums.map((a) => a.id)).toEqual(before)
  })
})
