import { useEffect, useRef, useState } from 'react'

function ChevronDown16() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseTinyIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Multi-select chip field (same interaction pattern as pet tags in intake).
 */
export default function MultiSelectChipsField({
  label,
  required = false,
  options = [],
  value = [],
  onChange,
  error,
  placeholder = 'Select',
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const available = options.filter((o) => !value.includes(o))

  useEffect(() => {
    if (!open) return
    function down(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', down)
    return () => document.removeEventListener('mousedown', down)
  }, [open])

  function add(tag) {
    if (!value.includes(tag)) onChange([...value, tag])
    setOpen(false)
  }

  function remove(tag) {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div ref={rootRef} className="relative flex w-full flex-col gap-ds-1">
      <span className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
        {label}
        {required ? ' *' : ''}
      </span>
      <div
        className={`flex min-h-10 w-full items-stretch gap-ds-2 overflow-hidden rounded-ds-m border border-ds-border-base bg-ds-canvas-base shadow-ds-sm ${
          error ? 'ring-1 ring-ds-status-error' : ''
        }`}
      >
        <button
          type="button"
          onClick={() => available.length && setOpen((o) => !o)}
          className="flex min-h-10 min-w-0 flex-1 items-center gap-ds-2 px-ds-5 py-ds-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ds-button-primary/25"
        >
          <div className="flex min-h-[22px] flex-1 flex-wrap items-center gap-ds-2">
            {value.map((tag) => (
              <span
                key={tag}
                role="presentation"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-ds-1 rounded-ds-s bg-ds-canvas-dark px-ds-3 py-ds-1"
              >
                <span className="text-[12px] font-medium leading-[18px] tracking-[-0.12px] text-ds-text-dark">
                  {tag}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    remove(tag)
                  }}
                  className="flex size-[10px] items-center justify-center text-ds-text-dark hover:opacity-70"
                  aria-label={`Remove ${tag}`}
                >
                  <CloseTinyIcon />
                </button>
              </span>
            ))}
            {value.length === 0 ? (
              <span className="text-[13px] font-normal leading-[21px] tracking-[-0.26px] text-ds-text-base">
                {placeholder}
              </span>
            ) : null}
          </div>
          <span className="pointer-events-none shrink-0 self-center pr-ds-3 text-ds-icon-base">
            <ChevronDown16 />
          </span>
        </button>
      </div>
      {open && available.length > 0 ? (
        <ul className="absolute left-0 top-full z-40 mt-1 w-full rounded-ds-m border border-ds-border-base bg-ds-canvas-base py-ds-2 shadow-ds-sm">
          {available.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                className="w-full px-ds-4 py-ds-3 text-left text-[13px] leading-[21px] text-ds-text-dark hover:bg-ds-canvas-light"
                onClick={() => add(opt)}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? <p className="text-[12px] leading-[18px] text-ds-status-error">{error}</p> : null}
    </div>
  )
}
