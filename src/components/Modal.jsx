import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './ui.jsx'
import { useI18n } from '../i18n/index.js'

export function Modal({ open, onClose, title, children, footer }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    const node = ref.current
    const target = node?.querySelector('[data-autofocus]') ?? node
    target?.focus()

    // Blochează scroll-ul paginii din spate cât timp modalul e deschis.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKey(e) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const focusable = node.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previous?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  // Portal pe <body>: un părinte cu backdrop-filter (headerul) devine bloc de
  // referință pentru position: fixed și ar decupa modalul la marginile lui.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <div className="fixed inset-0 bg-ink-900/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="card relative my-auto max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl"
      >
        <h2 className="mb-2 text-lg font-semibold">{title}</h2>
        <div className="text-sm text-ink-700">{children}</div>
        {footer && <div className="mt-5 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel, danger }) {
  const { t } = useI18n()
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} data-autofocus>
            {t('action.cancel')}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel ?? t('action.confirm')}
          </Button>
        </>
      }
    >
      {message}
    </Modal>
  )
}
