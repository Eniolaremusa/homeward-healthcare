/**
 * Shared footer for care case creation steps — Cancel (grey), optional Previous, primary submit.
 */
export default function CareCaseStepFooter({
  showPrevious,
  onPrevious,
  submitLabel = 'Next step',
  submitDisabled,
  onCancel,
  submitType = 'submit',
  onSubmitClick,
}) {
  const primaryClass = submitDisabled
    ? 'cursor-not-allowed bg-ds-button-primary-light text-ds-button-primary-disabled'
    : 'border border-[rgba(56,0,18,0.5)] bg-ds-button-primary text-ds-text-white shadow-[inset_0px_0px_1px_2px_rgba(255,255,255,0.22)] hover:opacity-95'

  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-ds-6 gap-y-ds-4 bg-ds-canvas-base px-ds-8 pb-ds-8 pt-ds-6">
      <button
        type="button"
        onClick={onCancel}
        className="flex h-10 items-center justify-center rounded-ds-full border border-ds-border-base bg-ds-button-gray px-ds-6 text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark shadow-ds-sm"
      >
        Cancel
      </button>
      <div className="ml-auto flex flex-wrap items-center gap-ds-4">
        {showPrevious ? (
          <button
            type="button"
            onClick={onPrevious}
            className="flex h-10 items-center justify-center rounded-ds-full border border-ds-border-base bg-ds-button-gray px-ds-6 text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark shadow-ds-sm"
          >
            Previous
          </button>
        ) : null}
        <button
          type={submitType}
          disabled={submitType === 'submit' && submitDisabled}
          onClick={submitType === 'button' ? onSubmitClick : undefined}
          className={`relative flex h-10 items-center justify-center overflow-hidden rounded-ds-full px-6 text-[15px] font-medium leading-[23px] tracking-[-0.3px] transition ${primaryClass}`}
        >
          {submitLabel}
        </button>
      </div>
    </footer>
  )
}
