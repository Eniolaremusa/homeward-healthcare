function Field({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  hideLabel = false,
  ariaLabel,
  leftSlot,
  rightSlot,
  inputMode,
  type = 'text',
  autoComplete,
  maxLength,
  min,
  max,
  step,
}) {
  const filled = String(value ?? '').trim().length > 0
  const showLabelRow = Boolean(label) || required

  return (
    <label className="flex w-full flex-col gap-ds-1">
      {showLabelRow ? (
        <span
          className={
            hideLabel
              ? 'sr-only'
              : 'text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark'
          }
        >
          {label}
          {required ? ' *' : ''}
        </span>
      ) : null}
      <div
        className={`flex h-10 w-full items-center gap-ds-4 overflow-hidden rounded-ds-m border border-ds-border-base bg-ds-canvas-base px-ds-5 py-ds-4 shadow-ds-sm ${
          error ? 'ring-1 ring-ds-status-error' : ''
        }`}
      >
        {leftSlot ? <span className="flex shrink-0 items-center text-ds-icon-base">{leftSlot}</span> : null}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-label={ariaLabel}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          className={`ds-input-inner min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] font-normal leading-[21px] tracking-[-0.26px] placeholder:text-ds-text-base focus:outline-none focus:ring-0 ${
            filled ? 'text-ds-text-dark' : 'text-ds-text-base'
          }`}
        />
        {rightSlot ? <span className="ml-auto flex shrink-0 items-center text-ds-icon-base">{rightSlot}</span> : null}
      </div>
      {error ? (
        <p className="text-[12px] leading-[18px] text-ds-status-error">{error}</p>
      ) : null}
    </label>
  )
}

export default Field
