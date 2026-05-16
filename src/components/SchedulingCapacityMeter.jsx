/**
 * Reusable capacity meter (scheduling staff cards, map tooltips — Figma capacity states).
 */
import { getCapacityState } from '../schedule/capacityVisualState'

/**
 * Capacity utilization meter — three visual states (available / moderate / at-capacity).
 * Filled segments reflect used capacity (higher % = more segments filled).
 */
export default function SchedulingCapacityMeter({ pct }) {
  const n = Number(pct) || 0
  const state = getCapacityState(n)
  const filledSeg = Math.min(5, Math.max(0, Math.round(n / 20)))

  const palette =
    state === 'available'
      ? { fill: 'bg-ds-status-success', empty: 'bg-ds-border-base', track: 'bg-ds-canvas-light' }
      : state === 'moderate'
        ? { fill: 'bg-[#ca8a04]', empty: 'bg-ds-border-base', track: 'bg-[#fef9c3]/80' }
        : { fill: 'bg-ds-status-error', empty: 'bg-ds-border-base', track: 'bg-[#fee2e2]/90' }

  return (
    <div className="flex items-center gap-ds-2">
      <div className={`flex gap-px rounded-[2px] p-px ${palette.track}`} aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-3 w-[6px] rounded-[1px] ${i < filledSeg ? palette.fill : palette.empty}`}
          />
        ))}
      </div>
      <span className="text-[12px] font-medium leading-[18px] tracking-[-0.12px] text-ds-text-dark">{n}%</span>
    </div>
  )
}
