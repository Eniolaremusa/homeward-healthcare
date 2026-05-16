/** Canonical care-type labels (aligned with client chips + staff specialties) */
export const CARE_TYPE_POOL = [
  'IV Therapy',
  'Palliative Care',
  'Chronic Disease',
  'Wound Care',
  'Physiotherapy',
  'Pediatric Care',
]

function hashString(str) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

function mulberry32(seed) {
  return function rand() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Staff covers every required care type (subset of specialties). */
export function staffMeetsAllCareNeeds(staff, needs) {
  if (!needs?.length) return true
  return needs.every((need) => staff.specialties.includes(need))
}

function countStaffMatchingAll(staffList, needs) {
  return staffList.filter((s) => staffMeetsAllCareNeeds(s, needs)).length
}

/**
 * Deterministic care needs per client seed (default 1–3, cap with maxNeeds e.g. 2).
 * Optionally require a minimum eligible staff count.
 */
export function pickClientCareNeeds(staffList, seed = 'vera-jameson', options = {}) {
  const minEligible = typeof options.minEligible === 'number' ? options.minEligible : 1
  const maxNeeds = typeof options.maxNeeds === 'number' ? options.maxNeeds : 3
  const cap = Math.min(3, Math.max(1, maxNeeds))
  const rng = mulberry32(hashString(seed))
  for (let attempt = 0; attempt < 96; attempt++) {
    const count = cap <= 1 ? 1 : 1 + Math.floor(rng() * cap)
    const shuffled = [...CARE_TYPE_POOL].sort(() => rng() - 0.5)
    const picked = shuffled.slice(0, count)
    if (countStaffMatchingAll(staffList, picked) >= minEligible) {
      return picked
    }
  }
  const byCoverage = [...CARE_TYPE_POOL].sort(
    (a, b) => countStaffMatchingAll(staffList, [b]) - countStaffMatchingAll(staffList, [a]),
  )
  const top = byCoverage[0]
  if (cap >= 2) {
    const second = byCoverage.find(
      (x) => x !== top && countStaffMatchingAll(staffList, [top, x]) >= minEligible,
    )
    if (second) return [top, second]
  }
  return [top]
}

/** Display label for chips (“Pediatric Care” → “Pediatric” per design copy). */
export function careTypeDisplayLabel(need) {
  if (need === 'Pediatric Care') return 'Pediatric'
  return need
}
