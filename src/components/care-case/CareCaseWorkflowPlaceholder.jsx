/**
 * Placeholder steps 2–4 until full care-plan / task / preview flows ship.
 */
export default function CareCaseWorkflowPlaceholder({ stepIndex, title, description, onContinue }) {
  return (
    <article className="w-full min-w-0 overflow-hidden rounded-ds-l border border-ds-border-base bg-ds-canvas-base shadow-[0px_0px_1px_rgba(19,19,21,0.04)]">
      <header className="border-b border-ds-border-base bg-ds-canvas-base px-ds-8 py-ds-5">
        <p className="text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-light">
          STEP {stepIndex} / 4
        </p>
        <h2 className="text-[18px] font-medium leading-6 tracking-[-0.54px] text-ds-text-dark">{title}</h2>
      </header>
      <div className="border-b border-ds-border-base bg-ds-canvas-light p-ds-6">
        <div className="rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-6 text-[15px] font-normal leading-[23px] tracking-[-0.3px] text-ds-text-base">
          {description}
        </div>
      </div>
      <footer className="flex justify-end gap-ds-5 bg-ds-canvas-base px-ds-8 pb-ds-8 pt-ds-6">
        <button
          type="button"
          onClick={onContinue}
          className="relative flex h-10 items-center justify-center overflow-hidden rounded-ds-full border border-[rgba(56,0,18,0.5)] bg-ds-button-primary px-ds-6 text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-white shadow-[inset_0px_0px_1px_2px_rgba(255,255,255,0.22)] hover:opacity-95"
        >
          Next step
        </button>
      </footer>
    </article>
  )
}
