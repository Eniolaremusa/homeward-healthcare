/**
 * Native time input with design-system shell (matches DateField pattern).
 */
function TimeField({ name, label, value, onChange, onBlur, error, required = false }) {
  const filled = String(value ?? '').trim().length > 0

  return (
    <label className="flex w-full flex-col gap-ds-1">
      <span className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
        {label}
        {required ? ' *' : ''}
      </span>
      <div
        className={`relative flex h-10 w-full items-center overflow-hidden rounded-ds-m border border-ds-border-base bg-ds-canvas-base px-ds-5 py-ds-4 shadow-ds-sm ${
          error ? 'ring-1 ring-ds-status-error' : ''
        }`}
      >
        <input
          name={name}
          type="time"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`ds-input-inner min-w-0 flex-1 border-0 bg-transparent pr-1 text-[13px] font-normal leading-[21px] tracking-[-0.26px] focus:outline-none focus:ring-0 ${
            filled ? 'text-ds-text-dark' : 'text-ds-text-base'
          }`}
        />
      </div>
      {error ? <p className="text-[12px] leading-[18px] text-ds-status-error">{error}</p> : null}
    </label>
  )
}

export default TimeField
