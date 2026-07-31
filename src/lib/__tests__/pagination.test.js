import { describe, it, expect } from 'vitest'
import { paginate, pageNumbers } from '../pagination.js'

const items = Array.from({ length: 100 }, (_, i) => i + 1)

describe('paginate', () => {
  it('taie prima pagină', () => {
    const r = paginate(items, 1, 24)
    expect(r.items).toHaveLength(24)
    expect(r.items[0]).toBe(1)
    expect(r).toMatchObject({ page: 1, totalPages: 5, total: 100, from: 1, to: 24 })
  })

  it('taie ultima pagină, incompletă', () => {
    const r = paginate(items, 5, 24)
    expect(r.items).toHaveLength(4)
    expect(r).toMatchObject({ from: 97, to: 100 })
  })

  it('readuce în interval o pagină prea mare', () => {
    expect(paginate(items, 99, 24).page).toBe(5)
  })

  it('readuce în interval o pagină invalidă', () => {
    expect(paginate(items, 0, 24).page).toBe(1)
    expect(paginate(items, -3, 24).page).toBe(1)
    expect(paginate(items, NaN, 24).page).toBe(1)
  })

  it('tratează lista goală', () => {
    expect(paginate([], 1, 24)).toMatchObject({ totalPages: 1, total: 0, from: 0, to: 0 })
  })

  it('nu modifică lista primită', () => {
    const copy = [...items]
    paginate(items, 3, 24)
    expect(items).toEqual(copy)
  })
})

describe('pageNumbers', () => {
  it('listează tot când sunt puține pagini', () => {
    expect(pageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('pune elipse la mijloc', () => {
    expect(pageNumbers(7, 20)).toEqual([1, '…', 6, 7, 8, '…', 20])
  })

  it('afișează tot până la 7 pagini', () => {
    expect(pageNumbers(3, 6)).toEqual([1, 2, 3, 4, 5, 6])
    expect(pageNumbers(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('nu pune elipsă în locul unei singure pagini sărite', () => {
    expect(pageNumbers(4, 8)).toEqual([1, 2, 3, 4, 5, '…', 8])
    expect(pageNumbers(3, 8)).toEqual([1, 2, 3, 4, '…', 8])
  })

  it('funcționează la capete', () => {
    expect(pageNumbers(1, 20)).toEqual([1, 2, '…', 20])
    expect(pageNumbers(20, 20)).toEqual([1, '…', 19, 20])
  })

  it('întoarce o singură pagină când nu e nimic de paginat', () => {
    expect(pageNumbers(1, 1)).toEqual([1])
    expect(pageNumbers(1, 0)).toEqual([1])
  })
})
