import { useMemo, useState } from 'react'
import SchedulingMap from './SchedulingMap'
import {
  CLIENT_CASE,
  STAFF_DATASET,
  STAFF_ROLES,
  ZONES,
  matchScoreTier,
  specialtyStyle,
  zoneAccent,
} from '../schedule/mockStaffData'

const ROLE_FILTER_OPTIONS = [
  { value: '', label: 'All roles' },
  { value: 'RN', label: 'Registered Nurse' },
  { value: 'CNA', label: 'Certified Nursing Assistant' },
  { value: 'LPN', label: 'Licensed Practical Nurse' },
]

const ZONE_FILTER_OPTIONS = [{ value: '', label: 'All zones' }, ...ZONES.map((z) => ({ value: z, label: `${z} zone` }))]

const MATCH_FILTER_OPTIONS = [
  { value: 'best', label: 'Best match' },
  { value: 'drive', label: 'Lowest drive time' },
]

function MatchScoreBadge({ score }) {
  const tier = matchScoreTier(score)
  const color =
    tier === 'high'
      ? 'text-ds-status-success'
      : tier === 'mid'
        ? 'text-[#b45309]'
        : 'text-ds-status-error'
  const dot =
    tier === 'high' ? 'bg-ds-status-success' : tier === 'mid' ? 'bg-[#eab308]' : 'bg-ds-status-error'

  return (
    <span className={`inline-flex items-center gap-ds-2 text-[13px] font-medium leading-[21px] tracking-[-0.26px] ${color}`}>
      <span className={`size-2 shrink-0 rounded-full ${dot}`} aria-hidden />
      {score}% match
    </span>
  )
}

function CapacityMeter({ score, pct }) {
  const tier = matchScoreTier(score)
  const fill =
    tier === 'high' ? 'bg-ds-status-success' : tier === 'mid' ? 'bg-[#eab308]' : 'bg-ds-status-error'
  const filled = Math.min(5, Math.max(0, Math.round(pct / 20)))

  return (
    <div className="flex items-center gap-ds-2">
      <div className="flex gap-px" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-3 w-[5px] rounded-[1px] ${i < filled ? fill : 'bg-ds-border-base'}`}
          />
        ))}
      </div>
      <span className="text-[12px] font-medium leading-[18px] tracking-[-0.12px] text-ds-text-dark">{pct}%</span>
    </div>
  )
}

function StaffCard({ staff }) {
  const zoneColor = zoneAccent(staff.zone)

  return (
    <article className="rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-6 shadow-ds-sm">
      <div className="flex gap-ds-5">
        <div
          className="size-11 shrink-0 overflow-hidden rounded-ds-s border border-ds-border-base bg-ds-canvas-dark text-center text-[12px] font-semibold leading-[44px] text-ds-text-dark"
          aria-hidden
        >
          {staff.fullName
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-ds-3">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark">
                {staff.fullName}{' '}
                <span className="text-ds-text-base">({staff.gender})</span>
              </p>
              <p className="text-[12px] leading-[18px] tracking-[-0.12px] text-ds-text-base">
                {STAFF_ROLES[staff.roleKey]}
                <span className="text-ds-text-light"> · {staff.experienceLabel}</span>
              </p>
            </div>
            <MatchScoreBadge score={staff.matchScore} />
          </div>

          <div className="mt-ds-5 flex flex-wrap gap-ds-2">
            <span
              className="inline-flex items-center gap-ds-1 rounded-ds-s px-ds-3 py-ds-1 text-[11px] font-medium leading-4 tracking-[-0.12px]"
              style={{ background: 'var(--color-ds-canvas-dark)', color: 'var(--color-ds-text-dark)' }}
            >
              <span className="size-1.5 rounded-full" style={{ background: zoneColor }} aria-hidden />
              {staff.zone} zone
            </span>
            {staff.specialties.map((sp) => {
              const st = specialtyStyle(sp)
              return (
                <span
                  key={sp}
                  className="rounded-ds-s px-ds-3 py-ds-1 text-[11px] font-medium leading-4 tracking-[-0.12px]"
                  style={{ background: st.bg, color: st.text }}
                >
                  {sp}
                </span>
              )
            })}
          </div>

          <div className="mt-ds-5 grid grid-cols-3 gap-ds-4 border-t border-ds-border-base pt-ds-5">
            <div>
              <p className="text-[11px] font-medium uppercase leading-4 tracking-wide text-ds-text-light">Miles</p>
              <p className="mt-ds-1 text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
                {staff.miles} mi
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase leading-4 tracking-wide text-ds-text-light">Drive time</p>
              <p className="mt-ds-1 text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
                {staff.driveMins} min
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase leading-4 tracking-wide text-ds-text-light">Capacity</p>
              <div className="mt-ds-1">
                <CapacityMeter score={staff.matchScore} pct={staff.capacityPct} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function ClientColumnSkeleton() {
  const blocks = [
    ['w-3/5', 'w-full', 'w-4/5'],
    ['w-2/5', 'w-full', 'w-3/5', 'w-5/6'],
    ['w-1/2', 'w-full', 'w-full'],
    ['w-4/5', 'w-2/3', 'w-full'],
  ]

  return (
    <div className="flex flex-col gap-ds-5">
      {blocks.map((widths, i) => (
        <div
          key={i}
          className="rounded-ds-l border border-ds-border-base bg-ds-canvas-base p-ds-6 shadow-[0px_0px_1px_rgba(19,19,21,0.04)]"
        >
          <div className="flex flex-col gap-ds-4">
            <div className="h-4 w-1/3 animate-pulse rounded-ds-s bg-ds-canvas-dark" />
            {widths.map((w, j) => (
              <div key={j} className={`h-3 animate-pulse rounded-ds-s bg-ds-canvas-dark ${w}`} />
            ))}
            <div className="mt-ds-2 h-16 w-full animate-pulse rounded-ds-m bg-ds-canvas-dark opacity-80" />
          </div>
        </div>
      ))}
    </div>
  )
}

function StaffRequirementsCard() {
  const reqs = [
    { role: 'RN', years: '3–5 yrs', filled: 0, need: 1 },
    { role: 'CNA', years: '3–5 yrs', filled: 0, need: 1 },
    { role: 'LPN', years: '3–5 yrs', filled: 0, need: 1 },
  ]

  return (
    <div className="rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-6 shadow-ds-sm">
      <p className="text-ds-intake-card-title">Care staff requirement</p>
      <p className="mt-ds-2 text-[12px] leading-[18px] tracking-[-0.12px] text-ds-text-base">
        Care focus from case intake: {CLIENT_CASE.requiredSpecialties.join(', ')}.
      </p>
      <div className="mt-ds-5 flex flex-wrap gap-ds-3">
        {reqs.map((r) => (
          <span
            key={r.role}
            className="inline-flex items-center gap-ds-2 rounded-ds-s border border-ds-border-base bg-ds-canvas-light px-ds-4 py-ds-3 text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark"
          >
            {r.role}
            <span className="text-ds-text-base">· {r.years}</span>
            <span className="text-ds-text-light">
              · {r.filled}/{r.need}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 text-ds-icon-base">
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

export default function ScheduleClientsWorkspace() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [zoneFilter, setZoneFilter] = useState('')
  const [matchFilter, setMatchFilter] = useState('best')
  const [routeSelection, setRouteSelection] = useState(() => ({
    showAll: true,
    North: false,
    East: false,
    West: false,
    South: false,
  }))

  const highlightedZone = useMemo(() => {
    if (routeSelection.showAll) return null
    const on = ZONES.find((z) => routeSelection[z])
    return on ?? null
  }, [routeSelection])

  const setShowAllRoutes = () => {
    setRouteSelection({
      showAll: true,
      North: false,
      East: false,
      West: false,
      South: false,
    })
  }

  const toggleRouteZone = (z) => {
    setRouteSelection((prev) => {
      if (!prev.showAll && prev[z]) {
        return { showAll: true, North: false, East: false, West: false, South: false }
      }
      return {
        showAll: false,
        North: z === 'North',
        East: z === 'East',
        West: z === 'West',
        South: z === 'South',
      }
    })
  }

  const filteredStaff = useMemo(() => {
    let list = [...STAFF_DATASET]
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((s) => s.fullName.toLowerCase().includes(q))
    if (roleFilter) list = list.filter((s) => s.roleKey === roleFilter)
    if (zoneFilter) list = list.filter((s) => s.zone === zoneFilter)

    if (matchFilter === 'drive') {
      list.sort((a, b) => a.driveMins - b.driveMins)
    } else {
      list.sort((a, b) => b.matchScore - a.matchScore)
    }
    return list
  }, [search, roleFilter, zoneFilter, matchFilter])

  const clientPin = { x: 44, y: 26 }

  return (
    <div className="min-h-screen bg-ds-canvas-base">
      <header className="flex min-h-[93px] items-center border-b border-ds-border-base bg-ds-canvas-base px-8 py-6">
        <div className="mx-auto w-full max-w-[1512px] space-y-ds-2">
          <nav
            className="flex flex-wrap items-center gap-ds-4 text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-base"
            aria-label="Breadcrumb"
          >
            <span>New patient</span>
            <span aria-hidden>/</span>
            <span className="text-ds-text-dark">{CLIENT_CASE.displayName}</span>
            <span aria-hidden>/</span>
            <span>New care case</span>
          </nav>
          <h1 className="text-[18px] font-medium leading-6 tracking-[-0.54px] text-ds-text-dark">Schedule Clients</h1>
        </div>
      </header>

      <section
        className="dot-grid-bg min-h-[calc(100vh-120px)] px-8 py-6"
        aria-label={`Scheduling workspace for ${CLIENT_CASE.displayName}`}
      >
        <div className="mx-auto grid w-full max-w-[1512px] grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)_minmax(280px,360px)] xl:grid-cols-[320px_1fr_360px]">
          {/* Column 1 */}
          <ClientColumnSkeleton />

          {/* Column 2 */}
          <div className="flex min-w-0 flex-col gap-ds-5">
            <StaffRequirementsCard />
            <div className="flex flex-col overflow-hidden rounded-ds-m border border-ds-border-base bg-ds-canvas-base shadow-ds-sm">
              <SchedulingMap staffList={filteredStaff} selectedZone={highlightedZone} clientPin={clientPin} />
              <div className="border-t border-ds-border-base bg-ds-canvas-base px-ds-6 py-ds-5">
                <p className="text-[12px] font-medium uppercase leading-[18px] tracking-wide text-ds-text-light">Routes</p>
                <div className="mt-ds-4 flex flex-wrap items-center gap-x-ds-6 gap-y-ds-3">
                  <label className="flex cursor-pointer items-center gap-ds-2 text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-ds-border-base text-ds-button-primary focus:ring-ds-button-primary/20"
                      checked={routeSelection.showAll}
                      onChange={setShowAllRoutes}
                    />
                    Show all
                  </label>
                  {ZONES.map((z) => (
                    <label
                      key={z}
                      className="flex cursor-pointer items-center gap-ds-2 text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark"
                    >
                      <input
                        type="checkbox"
                        className="size-4 rounded border-ds-border-base text-ds-button-primary focus:ring-ds-button-primary/20"
                        checked={!routeSelection.showAll && routeSelection[z]}
                        onChange={() => toggleRouteZone(z)}
                      />
                      {z}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex min-w-0 flex-col gap-ds-5">
            <div className="rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-6 shadow-ds-sm">
              <label className="sr-only" htmlFor="staff-search">
                Search staff
              </label>
              <div className="flex h-10 w-full items-center gap-ds-3 overflow-hidden rounded-ds-m border border-ds-border-base bg-ds-canvas-base px-ds-5 shadow-ds-sm">
                <SearchIcon />
                <input
                  id="staff-search"
                  type="search"
                  placeholder="Search nurse"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ds-input-inner min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] font-normal leading-[21px] tracking-[-0.26px] text-ds-text-dark placeholder:text-ds-text-base focus:outline-none"
                />
              </div>
              <div className="mt-ds-5 grid grid-cols-1 gap-ds-3 sm:grid-cols-3">
                <div>
                  <label className="sr-only" htmlFor="filter-role">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      id="filter-role"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="h-10 w-full cursor-pointer appearance-none rounded-ds-m border border-ds-border-base bg-ds-canvas-base pl-ds-5 pr-10 text-[13px] font-normal leading-[21px] tracking-[-0.26px] text-ds-text-dark shadow-ds-sm focus:outline-none"
                    >
                      {ROLE_FILTER_OPTIONS.map((o) => (
                        <option key={o.value || 'all'} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 flex size-4 -translate-y-1/2 text-ds-icon-base">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div>
                  <label className="sr-only" htmlFor="filter-zone">
                    Zone
                  </label>
                  <div className="relative">
                    <select
                      id="filter-zone"
                      value={zoneFilter}
                      onChange={(e) => setZoneFilter(e.target.value)}
                      className="h-10 w-full cursor-pointer appearance-none rounded-ds-m border border-ds-border-base bg-ds-canvas-base pl-ds-5 pr-10 text-[13px] font-normal leading-[21px] tracking-[-0.26px] text-ds-text-dark shadow-ds-sm focus:outline-none"
                    >
                      {ZONE_FILTER_OPTIONS.map((o) => (
                        <option key={o.value || 'allz'} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 flex size-4 -translate-y-1/2 text-ds-icon-base">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div>
                  <label className="sr-only" htmlFor="filter-match">
                    Match
                  </label>
                  <div className="relative">
                    <select
                      id="filter-match"
                      value={matchFilter}
                      onChange={(e) => setMatchFilter(e.target.value)}
                      className="h-10 w-full cursor-pointer appearance-none rounded-ds-m border border-ds-border-base bg-ds-canvas-base pl-ds-5 pr-10 text-[13px] font-normal leading-[21px] tracking-[-0.26px] text-ds-text-dark shadow-ds-sm focus:outline-none"
                    >
                      {MATCH_FILTER_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 flex size-4 -translate-y-1/2 text-ds-icon-base">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-ds-5">
              {filteredStaff.length === 0 ? (
                <p className="rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-6 text-[13px] text-ds-text-base shadow-ds-sm">
                  No staff match the current filters.
                </p>
              ) : (
                filteredStaff.map((s) => <StaffCard key={s.id} staff={s} />)
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
