function SelectField({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'Select',
  options = [],
  error,
  required = false,
}) {
  const filled = String(value ?? '').trim().length > 0

  return (
    <label className="flex w-full flex-col gap-ds-1">
      <span className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
        {label}
        {required ? ' *' : ''}
      </span>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`h-10 w-full cursor-pointer appearance-none rounded-ds-m border border-ds-border-base bg-ds-canvas-base pl-ds-5 pr-10 text-[13px] font-normal leading-[21px] tracking-[-0.26px] shadow-ds-sm focus:outline-none focus:ring-0 ${
            filled ? 'text-ds-text-dark' : 'text-ds-text-base'
          } ${error ? 'ring-1 ring-ds-status-error' : ''}`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center text-ds-icon-base">
          <ChevronDownIcon />
        </span>
      </div>
      {error ? (
        <p className="text-[12px] leading-[18px] text-ds-status-error">{error}</p>
      ) : null}
    </label>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SelectField
