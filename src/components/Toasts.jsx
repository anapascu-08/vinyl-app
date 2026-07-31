import { useUI } from '../store/uiStore.js'

export function Toasts() {
  const toasts = useUI((s) => s.toasts)
  const dismiss = useUI((s) => s.dismiss)

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex w-[min(24rem,92vw)] -translate-x-1/2 flex-col gap-2"
         aria-live="polite">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={`card px-4 py-3 text-left text-sm backdrop-blur ${
            t.tone === 'error' ? 'border-red-300 bg-red-50' : 'bg-white/95'
          }`}
        >
          {t.message}
        </button>
      ))}
    </div>
  )
}
