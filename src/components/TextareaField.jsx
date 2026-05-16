function TextareaField({ name, label, value, onChange, onBlur, placeholder, error, required = false, rows = 4 }) {
  const filled = String(value ?? '').trim().length > 0

  return (
    <label className="flex w-full flex-col gap-ds-1">
      <span className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
        {label}
        {required ? ' *' : ''}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        className={`min-h-[96px] w-full resize-y rounded-ds-m border border-ds-border-base bg-ds-canvas-base px-ds-5 py-ds-4 text-[13px] font-normal leading-[21px] tracking-[-0.26px] shadow-ds-sm placeholder:text-ds-text-base focus:outline-none focus:ring-0 ${
          filled ? 'text-ds-text-dark' : 'text-ds-text-base'
        } ${error ? 'ring-1 ring-ds-status-error' : ''}`}
      />
      {error ? <p className="text-[12px] leading-[18px] text-ds-status-error">{error}</p> : null}
    </label>
  )
}

export default TextareaField
