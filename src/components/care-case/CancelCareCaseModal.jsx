import { useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * Confirms abandoning care case creation and returning to new patient intake.
 */
export default function CancelCareCaseModal({ open, onContinueEditing, onCancelFlow }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(ev) {
      if (ev.key === 'Escape') onContinueEditing?.()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onContinueEditing])

  if (!open) return null

  const modal = (
    <div
      role="presentation"
      className="fixed inset-0 z-[130] flex items-center justify-center bg-ds-overlay-scrim p-4 backdrop-blur-[2px]"
      onClick={() => onContinueEditing?.()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-care-case-title"
        className="w-full max-w-[440px] rounded-ds-xxl border border-ds-border-base bg-ds-canvas-base p-ds-8 shadow-ds-md"
        onClick={(ev) => ev.stopPropagation()}
      >
        <h2
          id="cancel-care-case-title"
          className="mb-ds-6 text-[18px] font-medium leading-7 tracking-[-0.54px] text-ds-text-dark"
        >
          Are you sure you want to cancel your progress?
          <span className="mt-ds-2 block text-[15px] font-normal leading-[23px] tracking-[-0.3px]">
            You&apos;ll be taken back to the patient intake form.
          </span>
        </h2>
        <div className="flex flex-wrap justify-end gap-ds-4">
          <button
            type="button"
            onClick={() => onContinueEditing?.()}
            className="flex h-10 items-center justify-center rounded-ds-full border border-ds-border-base bg-ds-button-gray px-ds-6 text-[15px] font-medium text-ds-text-dark shadow-ds-sm"
          >
            Continue Editing
          </button>
          <button
            type="button"
            onClick={() => onCancelFlow?.()}
            className="flex h-10 items-center justify-center rounded-ds-full border border-[rgba(56,0,18,0.5)] bg-ds-button-primary px-ds-6 text-[15px] font-medium text-ds-text-white shadow-[inset_0px_0px_1px_2px_rgba(255,255,255,0.22)]"
          >
            Cancel Flow
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
