import { describe, it, expect } from 'vitest'
import { validateAlbum, isValid } from '../validation.js'
import { EMPTY_ALBUM } from '../album.js'
import { CURRENT_YEAR } from '../constants.js'

const base = { ...EMPTY_ALBUM, artist: 'Björk', title: 'Homogenic' }

describe('validateAlbum', () => {
  it('acceptă un album minimal valid', () => {
    expect(isValid(validateAlbum(base))).toBe(true)
  })

  it('cere artist și titlu', () => {
    const e = validateAlbum({ ...EMPTY_ALBUM, artist: '  ', title: '' })
    expect(e.artist).toBeDefined()
    expect(e.title).toBeDefined()
  })

  it('respinge anii în afara intervalului', () => {
    expect(validateAlbum({ ...base, year: 1899 }).year).toBeDefined()
    expect(validateAlbum({ ...base, year: CURRENT_YEAR + 1 }).year).toBeDefined()
    expect(validateAlbum({ ...base, year: 1997 }).year).toBeUndefined()
  })

  it('respinge prețuri negative', () => {
    expect(validateAlbum({ ...base, purchasePrice: -1 }).purchasePrice).toBeDefined()
    expect(validateAlbum({ ...base, purchasePrice: 0 }).purchasePrice).toBeUndefined()
  })

  it('respinge datele din viitor', () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    expect(validateAlbum({ ...base, purchaseDate: tomorrow }).purchaseDate).toBeDefined()
  })

  it('limitează numărul de genuri la 5', () => {
    const six = ['Rock', 'Pop', 'Jazz', 'Blues', 'Soul', 'Funk']
    expect(validateAlbum({ ...base, genres: six }).genres).toBeDefined()
    expect(validateAlbum({ ...base, genres: six.slice(0, 5) }).genres).toBeUndefined()
  })

  it('validează linkul copertei', () => {
    expect(validateAlbum({ ...base, coverUrl: 'nu-e-url' }).coverUrl).toBeDefined()
    expect(validateAlbum({ ...base, coverUrl: 'https://ex.com/a.jpg' }).coverUrl).toBeUndefined()
    expect(validateAlbum({ ...base, coverUrl: 'data:image/png;base64,AAA' }).coverUrl).toBeUndefined()
  })
})
