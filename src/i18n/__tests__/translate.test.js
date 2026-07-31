import { describe, it, expect } from 'vitest'
import { interpolate, translate, pickLanguage, localeOf, DICTS } from '../translate.js'

describe('interpolate', () => {
  it('înlocuiește parametrii', () => {
    expect(interpolate('{from}–{to} din {total}', { from: 1, to: 24, total: 100 })).toBe('1–24 din 100')
  })
  it('lasă neatins un parametru lipsă', () => {
    expect(interpolate('a {x} b', {})).toBe('a {x} b')
  })
  it('merge fără parametri', () => {
    expect(interpolate('simplu')).toBe('simplu')
  })
})

describe('translate', () => {
  it('traduce în ambele limbi', () => {
    expect(translate('ro', 'collection.title')).toBe('Colecția mea')
    expect(translate('en', 'collection.title')).toBe('My collection')
  })
  it('cade pe engleză pentru o limbă necunoscută', () => {
    expect(translate('de', 'collection.title')).toBe('My collection')
  })
  it('întoarce cheia dacă lipsește peste tot', () => {
    expect(translate('ro', 'nu.exista')).toBe('nu.exista')
  })
})

describe('pickLanguage', () => {
  it('preferă limba salvată', () => {
    expect(pickLanguage('ro', ['en-US'])).toBe('ro')
  })
  it('ignoră o limbă salvată invalidă', () => {
    expect(pickLanguage('de', ['ro-RO'])).toBe('ro')
  })
  it('folosește preferințele browserului', () => {
    expect(pickLanguage(null, ['ro-RO', 'en-US'])).toBe('ro')
    expect(pickLanguage(null, ['fr-FR', 'en-GB'])).toBe('en')
  })
  it('cade pe engleză dacă nimic nu se potrivește', () => {
    expect(pickLanguage(null, ['ja-JP'])).toBe('en')
    expect(pickLanguage(null, [])).toBe('en')
  })
})

describe('dicționare', () => {
  it('au exact aceleași chei', () => {
    expect(Object.keys(DICTS.ro).sort()).toEqual(Object.keys(DICTS.en).sort())
  })
  it('au aceiași parametri în fiecare cheie', () => {
    const placeholders = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()
    for (const key of Object.keys(DICTS.ro)) {
      expect(placeholders(DICTS.ro[key])).toEqual(placeholders(DICTS.en[key]))
    }
  })
})

describe('localeOf', () => {
  it('mapează limba la locale Intl', () => {
    expect(localeOf('ro')).toBe('ro-RO')
    expect(localeOf('en')).toBe('en-GB')
  })
})
