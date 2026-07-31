import { describe, it, expect } from 'vitest'
import { normalize, decadeOf, initialsOf } from '../format.js'

describe('normalize', () => {
  it('elimină diacriticele', () => {
    expect(normalize('Björk')).toBe('bjork')
    expect(normalize('Țăndărică')).toBe('tandarica')
  })
  it('permite căutarea fără diacritice', () => {
    expect(normalize('Björk').includes(normalize('bjork'))).toBe(true)
  })
})

describe('decadeOf', () => {
  it('calculează decada', () => {
    expect(decadeOf(1997)).toBe(1990)
    expect(decadeOf(2000)).toBe(2000)
    expect(decadeOf(null)).toBe(null)
  })
})

describe('initialsOf', () => {
  it('ia primele două inițiale', () => {
    expect(initialsOf('Pink Floyd')).toBe('PF')
    expect(initialsOf('Björk')).toBe('B')
  })
})
