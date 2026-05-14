function Field({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  leftSlot,
  rightSlot,
  inputMode,
  type = 'text',
  autoComplete,
  maxLength,
}) {
  const filled = String(value ?? '').trim().length > 0

  return (
    <label className="flex w-full flex-col gap-ds-1">
      <span className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
        {label}
        {required ? ' *' : ''}
      </span>
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
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
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
