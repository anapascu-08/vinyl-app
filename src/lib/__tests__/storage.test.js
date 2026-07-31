import { describe, it, expect } from 'vitest'
import { parseImport } from '../storage.js'

describe('parseImport', () => {
  it('respinge JSON invalid', () => {
    expect(parseImport('{nu e json').ok).toBe(false)
  })

  it('respinge structura greșită', () => {
    expect(parseImport('{"altceva": 1}').ok).toBe(false)
  })

  it('acceptă formatul cu wrapper', () => {
    const r = parseImport('{"version":1,"albums":[{"artist":"A","title":"B"}]}')
    expect(r.ok).toBe(true)
    expect(r.albums).toHaveLength(1)
  })

  it('acceptă și un array simplu', () => {
    expect(parseImport('[{"artist":"A","title":"B"}]').ok).toBe(true)
  })

  it('respinge albume fără artist sau titlu, indicând poziția', () => {
    const r = parseImport('[{"artist":"A","title":"B"},{"artist":"C"}]')
    expect(r.ok).toBe(false)
    // Motivul e o cheie de traducere cu parametri, tradusă la afișare.
    expect(r.reason).toEqual(['data.importBadItem', { n: 2 }])
  })
})
