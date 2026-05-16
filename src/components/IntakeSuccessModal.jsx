import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import PersonAvatar from './PersonAvatar'

function SummaryRow({ label, value }) {
  return (
    <div className="flex min-w-0 flex-col gap-ds-1">
      <p className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-base">{label}</p>
      <p className="break-words text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
        {value || '—'}
      </p>
    </div>
  )
}

function IntakeSuccessModal({ open, summary, onClose, onDoLater, onCreateCareCase }) {
  const handleLater = onDoLater ?? onClose
  const handleCreate = onCreateCareCase ?? onClose

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(event) {
      if (event.key === 'Escape') onClose?.()
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
      onClick={() => onClose?.()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="intake-success-title"
        className="flex w-[416px] max-w-[calc(100vw-2rem)] flex-col gap-ds-5 rounded-ds-xxl border border-ds-border-base bg-ds-button-primary p-ds-8 shadow-ds-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/*
          Pink band = fixed-height clip viewport (Figma 427:45354). Does not grow with child.
          White card is absolutely positioned (top 40px, horizontal 24px) and keeps full content;
          overflow is clipped by the pink wrapper so the card appears to spill and crop mid-body.
        */}
        <div className="relative box-border h-[274px] w-full shrink-0 overflow-hidden rounded-ds-xl bg-ds-modal-tint">
          <div
            className="absolute left-[24px] right-[24px] top-[40px] z-10 flex flex-col gap-ds-5 rounded-ds-l border border-ds-border-base bg-ds-canvas-base px-ds-8 pb-ds-6 pt-ds-8 shadow-ds-md"
            aria-label="Patient summary preview"
          >
            <div className="flex w-full shrink-0 items-center justify-center gap-ds-5">
              <PersonAvatar name={displayName} size="md" />
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
                <p className="text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark">{displayName}</p>
                <p className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-base">
                  {s.emailAddress || '—'}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-ds-5 rounded-ds-m border border-ds-border-base bg-ds-canvas-light p-ds-5">
              <SummaryRow label="Address:" value={s.homeAddress} />
              <div className="grid grid-cols-2 gap-ds-5">
                <SummaryRow label="Phone Number:" value={s.phoneDisplay} />
                <SummaryRow label="Date of Birth:" value={s.dateOfBirthDisplay} />
              </div>
              <div className="grid grid-cols-2 gap-ds-5">
                <SummaryRow label="Insurance Provider:" value={s.insuranceProviderLabel} />
                <SummaryRow label="Insurance ID:" value={s.insuranceId} />
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-ds-5 rounded-ds-m border border-ds-border-base bg-ds-canvas-light p-ds-5">
              <div className="grid grid-cols-2 gap-ds-5">
                <SummaryRow label="Nurse preference:" value={s.nurseGenderPreferenceLabel} />
                <SummaryRow label="Language:" value={s.languagePreferenceLabel} />
              </div>
              <div className="grid grid-cols-2 gap-ds-5">
                <SummaryRow label="Communication :" value={s.communicationPreferenceLabel} />
                <SummaryRow label="Living Situation" value={s.livingSituationLabel} />
              </div>
              {s.petSituationDisplay ? (
                <SummaryRow label="Pet situation:" value={s.petSituationDisplay} />
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-ds-2 text-ds-text-white">
          <h2 id="intake-success-title" className="text-[20px] font-semibold leading-7 tracking-[-0.6px]">
            Patient profile created
          </h2>
          <p className="text-[15px] font-normal leading-[23px] tracking-[-0.3px] text-white/95">{bodyText}</p>
        </div>

        <div className="flex w-full gap-ds-5">
          <button
            type="button"
            onClick={handleLater}
            className="flex h-10 flex-1 items-center justify-center rounded-ds-full border border-ds-border-base bg-ds-button-gray text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark shadow-ds-sm"
          >
            Do this later
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="relative flex h-10 flex-1 items-center justify-center overflow-hidden rounded-ds-full border border-[rgba(152,3,79,0.5)] text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-white shadow-[inset_0px_0px_1px_2px_rgba(255,255,255,0.22)]"
          >
            <span className="absolute inset-0 bg-ds-button-secondary" aria-hidden />
            <span className="relative">Create Care Case</span>
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

export default IntakeSuccessModal
