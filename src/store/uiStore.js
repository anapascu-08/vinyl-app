import { create } from 'zustand'

export const useUI = create((set, get) => ({
  toasts: [],
  view: (() => {
    try {
      return window.localStorage.getItem('vinyl-app:view') || 'grid'
    } catch {
      return 'grid'
    }
  })(),
  setView: (view) => {
    set({ view })
    try {
      window.localStorage.setItem('vinyl-app:view', view)
    } catch { /* ignorăm */ }
  },
  toast: (message, tone = 'ok') => {
    const id = Math.random().toString(36).slice(2)
    set({ toasts: [...get().toasts, { id, message, tone }] })
    setTimeout(() => set({ toasts: get().toasts.filter((t) => t.id !== id) }), 4000)
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))
