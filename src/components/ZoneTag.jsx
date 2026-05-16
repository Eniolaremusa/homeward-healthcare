import { zoneAccent } from '../schedule/mockStaffData'

/** Zone chip aligned with design system zone tags (staff cards, map tooltips). */
export default function ZoneTag({ zone, className = '' }) {
  const dot = zoneAccent(zone)
  return (
    <span
      className={`inline-flex items-center gap-ds-2 rounded-ds-l border border-ds-border-base bg-ds-canvas-base px-ds-3 py-ds-1 text-[12px] font-medium leading-[18px] tracking-[-0.12px] text-ds-text-base ${className}`}
    >
      <span
        className="size-[6px] shrink-0 rounded-full border-[0.3px] border-ds-canvas-base"
        style={{ backgroundColor: dot }}
        aria-hidden
      />
      {zone} Zone
    </span>
  )
}
