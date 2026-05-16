/**
 * Yes / No segmented control (design-system buttons).
 */
export default function SegmentedYesNoField({ label, value, onChange, onBlur, name, error, required = false }) {
  return (
    <fieldset className="flex w-full flex-col gap-ds-2">
      <legend className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
        {label}
        {required ? ' *' : ''}
      </legend>
      <div className="flex flex-wrap gap-ds-3">
        {[
          { id: 'yes', label: 'Yes', v: 'yes' },
          { id: 'no', label: 'No', v: 'no' },
        ].map((opt) => {
          const selected = value === opt.v
          return (
            <button
              key={opt.id}
              type="button"
              name={name}
              onBlur={() => onBlur?.({ target: { name } })}
              onClick={() => onChange({ target: { name, value: opt.v } })}
              className={`flex h-10 min-w-[88px] items-center justify-center rounded-ds-full border px-ds-6 text-[15px] font-medium leading-[23px] tracking-[-0.3px] shadow-ds-sm transition ${
                selected
                  ? 'border-[rgba(56,0,18,0.5)] bg-ds-button-primary text-ds-text-white'
                  : 'border-ds-border-base bg-ds-button-gray text-ds-text-dark hover:bg-ds-canvas-light'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      {error ? <p className="text-[12px] leading-[18px] text-ds-status-error">{error}</p> : null}
    </fieldset>
  )
}
