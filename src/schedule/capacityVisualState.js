/** Capacity utilization tier for scheduling UI (map tooltip + staff cards). */
export function getCapacityState(pct) {
  const n = Number(pct) || 0
  if (n < 55) return 'available'
  if (n < 82) return 'moderate'
  return 'full'
}
