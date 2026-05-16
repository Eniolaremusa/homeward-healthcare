import { useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * Fixed-position error toast (design: 240px wide, danger-500 background, 8px viewport inset).
 */
function ErrorToast({ open, message, onDismiss, position = 'top-right' }) {
  useEffect(() => {
    if (!open) return
    function onKey(event) {
      if (event.key === 'Escape') onDismiss?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onDismiss])

  if (!open || !message) return null

  const corner =
    position === 'bottom-right'
      ? 'bottom-[8px] right-[8px]'
      : 'top-[8px] right-[8px]'

  const toast = (
    <div
      role="alert"
      className={`fixed z-[200] ${corner} w-[240px] rounded-ds-m bg-danger-500 p-ds-4 shadow-ds-md`}
    >
      <p className="text-base font-medium leading-6 tracking-[-0.02em] text-ds-text-white">{message}</p>
    </div>
  )

  return createPortal(toast, document.body)
}

export default ErrorToast
