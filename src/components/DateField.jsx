function todayISO() {
  const t = new Date()
  const y = t.getFullYear()
  const m = String(t.getMonth() + 1).padStart(2, '0')
  const d = String(t.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Date input uses the browser’s native calendar control only (single trigger via
 * ::-webkit-calendar-picker-indicator / equivalent). No duplicate decorative icon.
 */
function DateField({ name, label, value, onChange, onBlur, error, required = false, max: maxProp, allowFuture = false }) {
  const filled = String(value ?? '').trim().length > 0
  const max = allowFuture ? undefined : maxProp !== undefined ? maxProp : todayISO()

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
          type="date"
          value={value}
          {...(max ? { max } : {})}
          min="1900-01-01"
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="bday"
          className={`ds-input-inner ds-input-date min-w-0 flex-1 border-0 bg-transparent pr-1 text-[13px] font-normal leading-[21px] tracking-[-0.26px] focus:outline-none focus:ring-0 ${
            filled ? 'text-ds-text-dark' : 'text-ds-text-base'
          }`}
        />
      </div>
      {error ? (
        <p className="text-[12px] leading-[18px] text-ds-status-error">{error}</p>
      ) : null}
    </label>
  )
}

export default DateField
