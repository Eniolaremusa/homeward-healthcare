import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/** ISO 3166-1 alpha-2 → regional indicator flag emoji */
function flagEmoji(iso2) {
  const code = iso2.toUpperCase()
  if (code.length !== 2) return '🏳️'
  return [...code]
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('')
}

export const PHONE_COUNTRIES = [
  { iso: 'US', name: 'United States', dial: '1' },
  { iso: 'CA', name: 'Canada', dial: '1' },
  { iso: 'GB', name: 'United Kingdom', dial: '44' },
  { iso: 'AU', name: 'Australia', dial: '61' },
  { iso: 'DE', name: 'Germany', dial: '49' },
  { iso: 'FR', name: 'France', dial: '33' },
  { iso: 'IN', name: 'India', dial: '91' },
  { iso: 'MX', name: 'Mexico', dial: '52' },
  { iso: 'JP', name: 'Japan', dial: '81' },
  { iso: 'BR', name: 'Brazil', dial: '55' },
]

function isValidNationalLength(iso, digits) {
  const len = digits.length
  switch (iso) {
    case 'US':
    case 'CA':
      return len === 10
    case 'GB':
      return len >= 10 && len <= 11
    default:
      return len >= 8 && len <= 15
  }
}

export function validatePhoneNational(iso, nationalDigits) {
  return isValidNationalLength(iso, nationalDigits)
}

function formatUSNational(digits) {
  const d = digits.slice(0, 10)
  if (d.length <= 3) return d
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)} - ${d.slice(6)}`
}

function PhoneField({
  name,
  label,
  nationalValue,
  onNationalChange,
  countryIso,
  onCountryIsoChange,
  onBlur,
  error,
  required = false,
  placeholder = '(555) 000 - 0000',
}) {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, minWidth: 0 })
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const selected = useMemo(
    () => PHONE_COUNTRIES.find((c) => c.iso === countryIso) ?? PHONE_COUNTRIES[0],
    [countryIso],
  )

  const digits = String(nationalValue ?? '').replace(/\D/g, '')
  const displayValue =
    selected.iso === 'US' || selected.iso === 'CA' ? formatUSNational(digits) : digits

  const filled = digits.length > 0

  const updateMenuPosition = () => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setMenuPos({ top: r.bottom + 4, left: r.left, minWidth: Math.max(r.width, 240) })
  }

  useLayoutEffect(() => {
    if (!open) return
    updateMenuPosition()
  }, [open])

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event) {
      const t = event.target
      if (rootRef.current?.contains(t)) return
      if (t.closest?.('[data-phone-country-menu]')) return
      setOpen(false)
    }
    function handleReposition() {
      updateMenuPosition()
    }
    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [open])

  const handleInputChange = (event) => {
    const raw = event.target.value.replace(/\D/g, '')
    onNationalChange(raw)
  }

  const handleInputBlur = (event) => {
    onBlur?.(event)
  }

  return (
    <div ref={rootRef} className="relative flex w-full flex-col gap-ds-1">
      <span className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
        {label}
        {required ? ' *' : ''}
      </span>
      <div
        className={`flex h-10 w-full overflow-hidden rounded-ds-m border border-ds-border-base bg-ds-canvas-base shadow-ds-sm ${
          error ? 'ring-1 ring-ds-status-error' : ''
        }`}
      >
        <div className="relative flex h-full shrink-0 border-r border-ds-border-base bg-ds-canvas-light">
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-full items-center gap-ds-4 pl-3 pr-ds-5 py-ds-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ds-button-primary/25"
          >
            <span className="flex size-5 shrink-0 items-center justify-center text-[16px] leading-none" aria-hidden>
              {flagEmoji(selected.iso)}
            </span>
            <span className="flex items-center gap-ds-1">
              <span className="min-w-[28px] text-[13px] font-normal leading-[21px] tracking-[-0.26px] text-ds-text-dark">
                +{selected.dial}
              </span>
              <ChevronDownTiny />
            </span>
          </button>

        </div>

        <input
          name={name}
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          className={`ds-input-inner min-w-0 flex-1 border-0 bg-transparent px-ds-5 py-2 text-[13px] font-normal leading-[21px] tracking-[-0.26px] placeholder:text-ds-text-base focus:outline-none focus:ring-0 ${
            filled ? 'text-ds-text-dark' : 'text-ds-text-base'
          }`}
        />
      </div>
      {error ? (
        <p className="text-[12px] leading-[18px] text-ds-status-error">{error}</p>
      ) : null}

      {open
        ? createPortal(
            <ul
              data-phone-country-menu
              role="listbox"
              style={{
                position: 'fixed',
                top: menuPos.top,
                left: menuPos.left,
                minWidth: menuPos.minWidth,
                zIndex: 9999,
              }}
              className="max-h-60 overflow-auto rounded-ds-m border border-ds-border-base bg-ds-canvas-base py-ds-2 shadow-ds-sm"
            >
              {PHONE_COUNTRIES.map((c) => (
                <li key={c.iso} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={c.iso === selected.iso}
                    onClick={() => {
                      onCountryIsoChange(c.iso)
                      setOpen(false)
                    }}
                    className="flex w-full items-center gap-ds-4 px-ds-4 py-ds-3 text-left text-[13px] leading-[21px] tracking-[-0.26px] hover:bg-ds-canvas-light"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center text-[16px] leading-none">
                      {flagEmoji(c.iso)}
                    </span>
                    <span className="flex-1 text-ds-text-dark">{c.name}</span>
                    <span className="text-ds-text-base">+{c.dial}</span>
                  </button>
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </div>
  )
}

function ChevronDownTiny() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-ds-icon-base" aria-hidden>
      <path
        d="M3.5 5.25L7 8.75l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default PhoneField
