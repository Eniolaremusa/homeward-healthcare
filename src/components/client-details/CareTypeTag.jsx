import { getCareTypeStyle } from './careTypeStyles'

/**
 * Reusable care-type chip — spacing, radius, type from Figma (812:11194).
 * @param {string} label — visible text
 * @param {string} [styleKey] — token lookup (e.g. canonical "Pediatric Care" when label is "Pediatric")
 */
export default function CareTypeTag({ label, styleKey, className = '' }) {
  const s = getCareTypeStyle(styleKey ?? label)

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-ds-2 rounded-ds-l border border-solid px-ds-3 py-ds-1 text-[12px] font-medium leading-[18px] tracking-[-0.12px] ${className}`}
      style={{
        backgroundColor: s.background,
        borderColor: s.border,
        color: s.color,
      }}
    >
      {label}
    </span>
  )
}
