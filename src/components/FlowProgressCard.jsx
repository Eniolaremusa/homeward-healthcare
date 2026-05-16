function CheckIcon() {
  return (
    <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden>
      <path d="M1 3.5L3.25 5.75L8 1" stroke="white" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Reusable progress column (patient intake, care case creation, etc.).
 * @param {object} props
 * @param {string} props.ariaLabel
 * @param {string} props.title — card header title
 * @param {{ id: number, label: string, numberVariant?: 'footnote' | 'body3' }[]} props.steps
 * @param {number} [props.completedThroughStep] — steps with id <= this value render complete
 */
export default function FlowProgressCard({ ariaLabel, title, steps, completedThroughStep = 0 }) {
  const maxId = steps.length ? Math.max(...steps.map((s) => s.id)) : 0
  const currentStepId = Math.min(completedThroughStep + 1, maxId)

  return (
    <aside
      className="h-fit w-full max-w-[360px] shrink-0 overflow-hidden rounded-ds-l border border-ds-border-base bg-ds-canvas-base shadow-ds-ring"
      aria-label={ariaLabel}
    >
      <div className="bg-ds-canvas-base px-ds-6 py-ds-5">
        <p className="text-ds-intake-card-title">{title}</p>
      </div>

      <div className="flex h-fit flex-col gap-ds-5 border-t border-ds-border-base bg-ds-canvas-light px-ds-6 py-ds-5">
        {steps.map((step) => {
          const isComplete = step.id <= completedThroughStep
          const isMutedUpcoming = !isComplete && step.id !== currentStepId

          return (
            <div
              key={step.id}
              className="flex w-full items-center gap-ds-4 rounded-ds-m border border-ds-border-base bg-ds-canvas-base px-ds-5 py-ds-4"
            >
              {isComplete ? (
                <div
                  className="relative flex size-[18px] shrink-0 items-center justify-center overflow-hidden rounded-ds-full border-[0.563px] border-[rgba(14,107,49,0.5)] bg-ds-status-success shadow-[inset_0px_0px_1.125px_1px_rgba(255,255,255,0.22)]"
                  aria-hidden
                >
                  <CheckIcon />
                </div>
              ) : (
                <div
                  className="flex size-[18px] shrink-0 items-center justify-center overflow-hidden rounded-ds-full border border-ds-border-base bg-ds-canvas-base shadow-ds-sm"
                  aria-hidden
                >
                  {step.numberVariant === 'footnote' ? (
                    <span className="text-ds-step-number-footnote">{step.id}</span>
                  ) : (
                    <span className="text-ds-step-number-body3">{step.id}</span>
                  )}
                </div>
              )}
              <p
                className={
                  isMutedUpcoming
                    ? 'text-[15px] font-normal leading-[23px] tracking-[-0.26px] text-ds-text-base'
                    : 'text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark'
                }
              >
                {step.label}
              </p>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
