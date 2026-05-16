import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ClientDetailsPanel from './client-details/ClientDetailsPanel'
import MiddleSchedulingCard from './MiddleSchedulingCard'
import SchedulingStaffCard from './SchedulingStaffCard'
import { useIntakeToast } from '../context/IntakeToastContext'
import { CLIENT_INTAKE_RECORD } from '../data/clientIntakeRecord'
import { pickClientCareNeeds, staffMeetsAllCareNeeds } from '../schedule/careNeedsPicker'
import { CLIENT_CASE, STAFF_DATASET, ZONES } from '../schedule/mockStaffData'

const ZONE_FILTER_OPTIONS = [{ value: '', label: 'All zones' }, ...ZONES.map((z) => ({ value: z, label: `${z} zone` }))]

const MATCH_FILTER_OPTIONS = [
  { value: 'best', label: 'Best match' },
  { value: 'drive', label: 'Lowest drive time' },
]

const CASE_ROLE_KEYS = ['RN', 'CNA', 'LPN']

const COL_HEIGHT = 'lg:h-[928px] lg:max-h-[928px] lg:min-h-[928px]'

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 text-ds-icon-base">
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

export default function ScheduleClientsWorkspace() {
  const { showSuccess } = useIntakeToast()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const msg = location.state?.careCaseSuccessMessage
    if (!msg) return
    showSuccess(msg)
    navigate('.', { replace: true, state: {} })
  }, [location.state, navigate, showSuccess])

  const clientCareNeeds = useMemo(
    () => pickClientCareNeeds(STAFF_DATASET, CLIENT_CASE.displayName, { minEligible: 6, maxNeeds: 2 }),
    [],
  )

  const eligibleStaff = useMemo(
    () => STAFF_DATASET.filter((s) => staffMeetsAllCareNeeds(s, clientCareNeeds)),
    [clientCareNeeds],
  )

  const [assignedStaffIds, setAssignedStaffIds] = useState([])
  const [activeStaffId, setActiveStaffId] = useState(null)
  const staffListScrollRef = useRef(null)
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

  const assignedStaffForPanel = useMemo(
    () => assignedStaffIds.map((id) => STAFF_DATASET.find((s) => s.id === id)).filter(Boolean),
    [assignedStaffIds],
  )

  /** Only roles that still have an open slot (1 staff per role for this case). */
  const roleFilterOptions = useMemo(() => {
    const opts = [{ value: '', label: 'All roles' }]
    for (const rk of CASE_ROLE_KEYS) {
      const filled = assignedStaffForPanel.filter((s) => s.roleKey === rk).length
      if (filled < 1) opts.push({ value: rk, label: rk })
    }
    return opts
  }, [assignedStaffForPanel])

  /** Coerce stale filter (e.g. RN after RN slot filled) without effect-driven setState */
  const roleFilterEffective = useMemo(() => {
    if (!roleFilter) return ''
    return roleFilterOptions.some((o) => o.value === roleFilter) ? roleFilter : ''
  }, [roleFilter, roleFilterOptions])

  const highlightedZone = useMemo(() => {
    if (routeSelection.showAll) return null
    const on = ZONES.find((z) => routeSelection[z])
    return on ?? null
  }, [routeSelection])

  const setShowAllRoutes = useCallback(() => {
    setRouteSelection({
      showAll: true,
      North: false,
      East: false,
      West: false,
      South: false,
    })
  }, [])

  const toggleRouteZone = useCallback((z) => {
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
  }, [])

  const staffOnMap = useMemo(() => {
    return eligibleStaff.filter((s) => {
      if (assignedStaffIds.includes(s.id)) return false
      const filledForRole = assignedStaffForPanel.filter((x) => x.roleKey === s.roleKey).length
      return filledForRole < 1
    })
  }, [eligibleStaff, assignedStaffIds, assignedStaffForPanel])

  const filteredStaff = useMemo(() => {
    let list = [...staffOnMap]
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((s) => s.fullName.toLowerCase().includes(q))
    if (roleFilterEffective) list = list.filter((s) => s.roleKey === roleFilterEffective)
    if (zoneFilter) list = list.filter((s) => s.zone === zoneFilter)

    if (matchFilter === 'drive') {
      list.sort((a, b) => a.driveMins - b.driveMins)
    } else {
      list.sort((a, b) => b.matchScore - a.matchScore)
    }
    return list
  }, [staffOnMap, search, roleFilterEffective, zoneFilter, matchFilter])

  const listActiveId = useMemo(() => {
    if (!activeStaffId) return null
    return filteredStaff.some((s) => s.id === activeStaffId) ? activeStaffId : null
  }, [activeStaffId, filteredStaff])

  /** Keep the selected staff card in view when activating from the map (or list). */
  useLayoutEffect(() => {
    if (!listActiveId) return
    const root = staffListScrollRef.current
    if (!root) return
    const id = String(listActiveId)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const node = root.querySelector(`[data-scheduling-staff-id="${CSS.escape(id)}"]`)
        node?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
      })
    })
  }, [listActiveId])

  const mapActiveId = useMemo(() => {
    if (!activeStaffId) return null
    return staffOnMap.some((s) => s.id === activeStaffId) ? activeStaffId : null
  }, [activeStaffId, staffOnMap])

  const canAssign = useMemo(() => {
    if (!activeStaffId) return false
    if (!staffOnMap.some((s) => s.id === activeStaffId)) return false
    const staff = STAFF_DATASET.find((s) => s.id === activeStaffId)
    return Boolean(staff && staffMeetsAllCareNeeds(staff, clientCareNeeds))
  }, [activeStaffId, staffOnMap, clientCareNeeds])

  const fulfillmentRoles = useMemo(() => {
    return CASE_ROLE_KEYS.map((roleKey) => {
      const filled = assignedStaffForPanel.filter((s) => s.roleKey === roleKey).length
      return {
        roleKey,
        years: '3-5 yrs',
        filled: Math.min(1, filled),
        need: 1,
      }
    })
  }, [assignedStaffForPanel])

  const allRolesFulfilled = fulfillmentRoles.every((r) => r.filled >= r.need)

  const resetToScheduleDefault = useCallback(() => {
    setAssignedStaffIds([])
    setActiveStaffId(null)
    setSearch('')
    setRoleFilter('')
    setZoneFilter('')
    setMatchFilter('best')
    setRouteSelection({ showAll: true, North: false, East: false, West: false, South: false })
  }, [])

  const removeStaff = useCallback((staffId) => {
    setAssignedStaffIds((prev) => prev.filter((id) => id !== staffId))
    setActiveStaffId((a) => (a === staffId ? null : a))
  }, [])

  const activateStaff = useCallback(
    (staffId) => {
      const staff = STAFF_DATASET.find((s) => s.id === staffId)
      if (!staff || assignedStaffIds.includes(staffId) || !staffMeetsAllCareNeeds(staff, clientCareNeeds)) return
      const filledForRole = assignedStaffForPanel.filter((x) => x.roleKey === staff.roleKey).length
      if (filledForRole >= 1) return
      setActiveStaffId((prev) => (prev === staffId ? null : staffId))
    },
    [assignedStaffIds, assignedStaffForPanel, clientCareNeeds],
  )

  const assignActiveStaff = useCallback(() => {
    if (!activeStaffId || !staffOnMap.some((s) => s.id === activeStaffId)) return
    const staff = STAFF_DATASET.find((s) => s.id === activeStaffId)
    if (!staff || !staffMeetsAllCareNeeds(staff, clientCareNeeds)) return
    setAssignedStaffIds((prev) => {
      const next = prev.filter((id) => STAFF_DATASET.find((x) => x.id === id)?.roleKey !== staff.roleKey)
      return [...next, activeStaffId]
    })
    setActiveStaffId(null)
  }, [activeStaffId, staffOnMap, clientCareNeeds])

  const onMapStaffMarker = useCallback(
    (staffId) => {
      const staff = STAFF_DATASET.find((s) => s.id === staffId)
      if (!staff || assignedStaffIds.includes(staffId) || !staffMeetsAllCareNeeds(staff, clientCareNeeds)) return
      const filledForRole = assignedStaffForPanel.filter((x) => x.roleKey === staff.roleKey).length
      if (filledForRole >= 1) return
      setActiveStaffId((prev) => (prev === staffId ? null : staffId))
    },
    [assignedStaffIds, assignedStaffForPanel, clientCareNeeds],
  )

  const onCreateCareCase = useCallback(() => {
    showSuccess('Care case created successfully.')
    window.setTimeout(() => {
      resetToScheduleDefault()
    }, 600)
  }, [resetToScheduleDefault, showSuccess])

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
        <div className="mx-auto grid w-full max-w-[1512px] grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,25%)_minmax(0,45%)_minmax(0,30%)]">
          <ClientDetailsPanel
            intake={CLIENT_INTAKE_RECORD}
            careTypes={clientCareNeeds}
            selectedStaff={assignedStaffForPanel}
            onRemoveStaff={removeStaff}
          />

          <MiddleSchedulingCard
            fulfillmentRoles={fulfillmentRoles}
            staffListForMap={staffOnMap}
            selectedZone={highlightedZone}
            activeStaffId={mapActiveId}
            onStaffMarkerToggle={onMapStaffMarker}
            routeSelection={routeSelection}
            onShowNoneRoutes={setShowAllRoutes}
            onToggleRouteZone={toggleRouteZone}
          />

          <div className={`flex min-h-0 min-w-0 flex-col gap-ds-5 ${COL_HEIGHT}`}>
            <div className="shrink-0 rounded-ds-l border border-ds-border-base bg-ds-canvas-darker p-ds-5 shadow-ds-sm">
              <div className="flex flex-col gap-ds-5">
              <label className="sr-only" htmlFor="staff-search">
                Search staff
              </label>
              <div className="flex h-10 w-full items-center gap-ds-3 overflow-hidden rounded-ds-m border border-ds-border-base bg-ds-canvas-base px-ds-5 shadow-ds-sm">
                <SearchIcon />
                <input
                  id="staff-search"
                  type="search"
                  placeholder="Search staff"
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
                      value={roleFilterEffective}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="h-10 w-full cursor-pointer appearance-none rounded-ds-m border border-ds-border-base bg-ds-canvas-base pl-ds-5 pr-10 text-[13px] font-normal leading-[21px] tracking-[-0.26px] text-ds-text-dark shadow-ds-sm focus:outline-none"
                    >
                      {roleFilterOptions.map((o) => (
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
            </div>

            <div ref={staffListScrollRef} className="min-h-0 flex-1 overflow-y-auto">
              <div className="flex flex-col gap-ds-5 pb-ds-2">
                {filteredStaff.length === 0 ? (
                  <p className="rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-6 text-[13px] text-ds-text-base shadow-ds-sm">
                    No staff meet this client&apos;s care needs and filters.
                  </p>
                ) : (
                  filteredStaff.map((s) => (
                    <div key={s.id} data-scheduling-staff-id={s.id}>
                      <SchedulingStaffCard
                        staff={s}
                        selected={listActiveId === s.id}
                        expanded={listActiveId === s.id}
                        onActivate={activateStaff}
                        showAssign={listActiveId === s.id}
                        onAssign={assignActiveStaff}
                        assignDisabled={!canAssign}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {allRolesFulfilled ? (
              <div className="shrink-0 rounded-ds-m border border-ds-border-base bg-ds-canvas-darker p-ds-5 shadow-ds-sm">
                <div className="flex flex-col gap-ds-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={resetToScheduleDefault}
                    className="flex h-10 flex-1 items-center justify-center rounded-ds-full border border-ds-border-base bg-ds-button-gray px-ds-6 text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark shadow-ds-sm outline-none transition hover:bg-ds-canvas-light focus-visible:ring-2 focus-visible:ring-ds-button-primary/25"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onCreateCareCase}
                    className="flex h-10 flex-1 items-center justify-center rounded-ds-full bg-ds-button-primary px-ds-6 text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-white shadow-ds-sm outline-none transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ds-button-primary/25"
                  >
                    Create Care Case
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
