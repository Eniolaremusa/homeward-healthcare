import { useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * Top-center success toast — design system success color, brief dismiss.
 */
export default function SuccessToast({ open, message, onDismiss, position = 'top-center' }) {
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
    position === 'top-center'
      ? 'left-1/2 top-[12px] -translate-x-1/2'
      : 'top-[12px] right-[12px]'

  const toast = (
    <div
      role="status"
      aria-live="polite"
      className={`fixed z-[200] ${corner} w-[min(420px,calc(100vw-24px))] rounded-ds-m border border-ds-status-success/25 bg-ds-canvas-base p-ds-5 shadow-ds-md`}
    >
      <div className="flex items-start gap-ds-4">
        <span
          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-ds-status-success text-ds-text-white"
          aria-hidden
        >
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
            <path
              d="M1 5.5L5 9.5L13 1"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="min-w-0 flex-1 text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark">
          {message}
        </p>
      </div>
    </div>
  )

  return createPortal(toast, document.body)
}
