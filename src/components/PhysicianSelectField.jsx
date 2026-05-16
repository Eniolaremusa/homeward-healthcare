import { useEffect, useRef, useState } from 'react'
import PersonAvatar from './PersonAvatar'

function ChevronDown16() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Single-select list with avatar + label rows (design system).
 */
export default function PhysicianSelectField({
  name,
  label,
  value,
  onChange,
  onBlur,
  options = [],
  error,
  required = false,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    function down(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', down)
    return () => document.removeEventListener('mousedown', down)
  }, [open])

  return (
    <div ref={rootRef} className="relative flex w-full flex-col gap-ds-1">
      <span className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
        {label}
        {required ? ' *' : ''}
      </span>
      <input type="hidden" name={name} value={value} readOnly />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onBlur={() => onBlur?.({ target: { name, value } })}
        onClick={() => setOpen((o) => !o)}
        className={`flex min-h-10 w-full items-center gap-ds-3 rounded-ds-m border border-ds-border-base bg-ds-canvas-base px-ds-5 py-ds-3 text-left shadow-ds-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ds-button-primary/25 ${
          error ? 'ring-1 ring-ds-status-error' : ''
        }`}
      >
        {selected ? (
          <>
            <PersonAvatar name={selected.label} size="xs" />
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
              {selected.label}
            </span>
          </>
        ) : (
          <span className="min-w-0 flex-1 text-[13px] font-normal leading-[21px] tracking-[-0.26px] text-ds-text-base">
            Select physician
          </span>
        )}
        <span className="pointer-events-none shrink-0 text-ds-icon-base">
          <ChevronDown16 />
        </span>
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-ds-m border border-ds-border-base bg-ds-canvas-base py-ds-2 shadow-ds-md"
        >
          {options.map((opt) => (
            <li key={opt.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                className="flex w-full items-center gap-ds-3 px-ds-4 py-ds-3 text-left hover:bg-ds-canvas-light"
                onClick={() => {
                  onChange({ target: { name, value: opt.value } })
                  setOpen(false)
                }}
              >
                <PersonAvatar name={opt.label} size="xs" />
                <span className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
                  {opt.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? <p className="text-[12px] leading-[18px] text-ds-status-error">{error}</p> : null}
    </div>
  )
}
