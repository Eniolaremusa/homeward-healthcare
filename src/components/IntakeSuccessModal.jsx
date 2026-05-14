import { useEffect } from 'react'
import { createPortal } from 'react-dom'

function initials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function IntakeSuccessModal({ open, summary, onClose }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const s = summary ?? {}
  const displayName = s.patientDisplayName || 'Patient'
  const bodyText = `${displayName} has been added to the system. To begin coordinating their care, create their first care case. This is where you'll define their clinical needs, tasks, & visit schedule.`

  const modal = (
    <div
      role="presentation"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ds-overlay-scrim p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="intake-success-title"
        className="relative w-full max-w-[460px] rounded-ds-xxl border border-ds-border-base bg-ds-button-primary p-ds-8 shadow-ds-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex min-h-[274px] flex-col rounded-ds-xl bg-ds-modal-tint p-ds-6">
          <div className="relative mx-auto mt-10 w-full max-w-[360px] rounded-ds-l border border-ds-border-base bg-ds-canvas-base px-ds-8 pb-ds-6 pt-ds-8 shadow-ds-md">
            <div className="mb-ds-5 flex w-full items-center justify-center gap-ds-5">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-ds-s bg-ds-canvas-dark text-[18px] font-semibold text-ds-text-dark">
                {initials(displayName)}
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-[3px]">
                <div className="flex flex-wrap items-center gap-ds-2">
                  <span className="inline-flex items-center gap-ds-2 rounded-ds-l border border-ds-border-base bg-ds-canvas-base px-ds-3 py-ds-1">
                    <span
                      className="size-[6px] shrink-0 rounded-ds-full border-[0.3px] border-ds-canvas-base bg-ds-zone-indicator"
                      aria-hidden
                    />
                    <span className="text-[12px] font-medium leading-[18px] tracking-[-0.12px] text-ds-text-dark">
                      Central Zone
                    </span>
                  </span>
                </div>
                <p className="text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark">
                  {displayName}
                </p>
                <p className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-base">
                  {s.emailAddress || '—'}
                </p>
              </div>
            </div>

            <div className="mb-ds-5 flex flex-col gap-ds-5 rounded-ds-m border-[1.243px] border-ds-border-base bg-ds-canvas-light p-ds-5 text-[13px] font-medium leading-[21px] tracking-[-0.26px]">
              <div className="flex flex-col gap-ds-1">
                <p className="text-ds-text-base">Address:</p>
                <p className="text-ds-text-dark">{s.homeAddress || '—'}</p>
              </div>
              <div className="grid grid-cols-2 gap-ds-5">
                <div className="flex flex-col gap-ds-1">
                  <p className="text-ds-text-base">Phone Number:</p>
                  <p className="text-ds-text-dark">{s.phoneDisplay || '—'}</p>
                </div>
                <div className="flex flex-col gap-ds-1">
                  <p className="text-ds-text-base">Date of Birth:</p>
                  <p className="text-ds-text-dark">{s.dateOfBirthDisplay || '—'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-ds-5">
                <div className="flex flex-col gap-ds-1">
                  <p className="text-ds-text-base">Insurance Provider:</p>
                  <p className="text-ds-text-dark">{s.insuranceProviderLabel || '—'}</p>
                </div>
                <div className="flex flex-col gap-ds-1">
                  <p className="text-ds-text-base">Insurance ID:</p>
                  <p className="text-ds-text-dark">{s.insuranceId || '—'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-ds-5 rounded-ds-m border-[1.243px] border-ds-border-base bg-ds-canvas-light p-ds-5 text-[13px] font-medium leading-[21px] tracking-[-0.26px]">
              <div className="grid grid-cols-2 gap-ds-5">
                <div className="flex flex-col gap-ds-1">
                  <p className="text-ds-text-base">Nurse preference:</p>
                  <p className="text-ds-text-dark">{s.nurseGenderPreferenceLabel || '—'}</p>
                </div>
                <div className="flex flex-col gap-ds-1">
                  <p className="text-ds-text-base">Language:</p>
                  <p className="text-ds-text-dark">{s.languagePreferenceLabel || '—'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-ds-5">
                <div className="flex flex-col gap-ds-1">
                  <p className="text-ds-text-base">Communication :</p>
                  <p className="text-ds-text-dark">{s.communicationPreferenceLabel || '—'}</p>
                </div>
                <div className="flex min-w-0 flex-col gap-ds-1">
                  <p className="text-ds-text-base">Living Situation</p>
                  <p className="text-ds-text-dark">{s.livingSituationLabel || '—'}</p>
                </div>
              </div>
              {s.petSituationDisplay ? (
                <div className="flex flex-col gap-ds-1">
                  <p className="text-ds-text-base">Pet situation:</p>
                  <p className="text-ds-text-dark">{s.petSituationDisplay}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mb-1 flex max-w-[419px] flex-col gap-ds-2 text-ds-text-white">
          <h2 id="intake-success-title" className="text-[20px] font-semibold leading-7 tracking-[-0.6px]">
            Patient profile created
          </h2>
          <p className="text-[15px] font-normal leading-[23px] tracking-[-0.3px] text-white/95">{bodyText}</p>
        </div>

        <div className="flex w-full gap-ds-5 pt-ds-2">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 flex-1 items-center justify-center rounded-ds-full border border-ds-border-base bg-ds-button-gray text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark shadow-ds-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="relative flex h-10 flex-1 items-center justify-center overflow-hidden rounded-ds-full border border-[rgba(152,3,79,0.5)] text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-white shadow-[inset_0px_0px_1px_2px_rgba(255,255,255,0.22)]"
          >
            <span className="absolute inset-0 bg-ds-button-secondary" aria-hidden />
            <span className="relative">Next step</span>
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

export default IntakeSuccessModal
