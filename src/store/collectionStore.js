import { create } from 'zustand'
import { createAlbum, normalizeAlbumInput } from '../lib/album.js'
import { load, save } from '../lib/storage.js'
import { STATUS } from '../lib/constants.js'
import { normalize } from '../lib/format.js'

const initial = load()

let saveTimer = null
function scheduleSave(get, set) {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    const err = save(get().albums)
    if (err) set({ storageError: 'unavailable' })
  }, 300)
}

export const useCollection = create((set, get) => ({
  albums: initial.albums,
  storageError: initial.error, // null | 'corrupt' | 'unavailable'
  corruptRaw: initial.error === 'corrupt' ? initial.raw : null,

  dismissStorageError: () => set({ storageError: null, corruptRaw: null }),

  addAlbum: (input) => {
    const album = createAlbum(input)
    set({ albums: [...get().albums, album] })
    scheduleSave(get, set)
    return album
  },

  updateAlbum: (id, input) => {
    set({
      albums: get().albums.map((a) =>
        a.id === id
          ? { ...a, ...normalizeAlbumInput({ ...a, ...input }), updatedAt: new Date().toISOString() }
          : a
      ),
    })
    scheduleSave(get, set)
  },

  /** Patch parțial fără re-normalizare completă (rating, notițe) */
  patchAlbum: (id, patch) => {
    set({
      albums: get().albums.map((a) =>
        a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a
      ),
    })
    scheduleSave(get, set)
  },

  removeAlbum: (id) => {
    set({ albums: get().albums.filter((a) => a.id !== id) })
    scheduleSave(get, set)
  },

  moveToCollection: (id) => {
    get().patchAlbum(id, { status: STATUS.OWNED })
  },

  replaceAll: (albums) => {
    set({ albums })
    scheduleSave(get, set)
  },

  mergeAlbums: (incoming) => {
    const existing = new Set(
      get().albums.map((a) => normalize(a.artist) + '|' + normalize(a.title))
    )
    const fresh = incoming.filter(
      (a) => !existing.has(normalize(a.artist) + '|' + normalize(a.title))
    )
    set({ albums: [...get().albums, ...fresh] })
    scheduleSave(get, set)
    return fresh.length
  },
}))

export const selectById = (id) => (state) => state.albums.find((a) => a.id === id)
export const selectOwned = (state) => state.albums.filter((a) => a.status === STATUS.OWNED)
export const selectWishlist = (state) => state.albums.filter((a) => a.status === STATUS.WISHLIST)

/** Caută duplicate după artist + titlu, ignorând un id (la editare). */
export function findDuplicate(albums, artist, title, ignoreId) {
  const key = normalize(artist) + '|' + normalize(title)
  return albums.find((a) => a.id !== ignoreId && normalize(a.artist) + '|' + normalize(a.title) === key)
}
