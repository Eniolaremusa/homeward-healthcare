import ScheduleMapLeaflet from './ScheduleMapLeaflet'
import { STAFF_ROLES, ZONES } from '../schedule/mockStaffData'

function Dot() {
  return <span className="size-[3px] shrink-0 rounded-full bg-ds-icon-base" aria-hidden />
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="shrink-0 text-ds-status-success">
      <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
      <path d="M5 9l2.5 2.5L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RoleFulfillmentChip({ roleKey, years, filled, need }) {
  const fulfilled = filled >= need
  return (
    <div
      className="flex min-w-0 flex-1 flex-col gap-ds-2 rounded-ds-s border border-ds-canvas-dark bg-ds-canvas-dark px-ds-5 py-ds-2"
      title={STAFF_ROLES[roleKey]}
    >
      <div className="flex flex-wrap items-center justify-between gap-ds-2">
        <div className="flex min-w-0 flex-wrap items-center gap-ds-2">
          <span className="whitespace-nowrap text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
            {roleKey}
          </span>
          <Dot />
          <span className="whitespace-nowrap text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
            {years}
          </span>
          <Dot />
          <span className="whitespace-nowrap text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
            {filled}/{need}
          </span>
        </div>
        {fulfilled ? <CheckIcon /> : <span className="size-[18px] shrink-0" aria-hidden />}
      </div>
    </div>
  )
}

function RouteCheckbox({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-ds-2">
      <span className="whitespace-nowrap text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-base">
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-[14px] shrink-0 cursor-pointer appearance-none rounded border-[0.7px] border-ds-border-base shadow-[0px_0px_1.75px_1px_rgba(19,19,21,0.04)] outline-none focus-visible:ring-2 focus-visible:ring-ds-button-primary/25"
        style={{
          backgroundColor: checked ? 'var(--color-ds-button-primary)' : 'var(--color-ds-canvas-base)',
          borderColor: checked ? 'rgba(56, 0, 18, 0.5)' : undefined,
          boxShadow: checked ? 'inset 0px 0px 0.875px 1px rgba(255,255,255,0.22)' : undefined,
          backgroundImage: checked
            ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'11\' height=\'9\' viewBox=\'0 0 11 9\' fill=\'none\'%3E%3Cpath d=\'M1 4.5L4 7.5L10 1\' stroke=\'white\' stroke-width=\'1.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E")'
            : 'none',
          backgroundSize: '11px 9px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
    </label>
  )
}

const COL_HEIGHT = 'lg:h-[928px] lg:max-h-[928px] lg:min-h-[928px]'

/**
 * Middle column: care requirements, full-bleed map with route controls overlaid at the bottom.
 */
export default function MiddleSchedulingCard({
  fulfillmentRoles,
  staffListForMap,
  selectedZone,
  activeStaffId,
  onStaffMarkerToggle,
  routeSelection,
  onShowNoneRoutes,
  onToggleRouteZone,
}) {
  return (
    <div
      className={`flex w-full min-w-0 flex-col gap-ds-5 rounded-ds-l border border-ds-border-base bg-ds-canvas-base p-ds-6 shadow-[0px_0px_2px_1px_rgba(19,19,21,0.04)] ${COL_HEIGHT} min-h-0`}
    >
      <p className="shrink-0 text-[12px] font-medium uppercase leading-[18px] tracking-[-0.24px] text-ds-text-base">
        Care requirements
      </p>

      <div className="grid w-full shrink-0 grid-cols-1 gap-ds-5 sm:grid-cols-3">
        {fulfillmentRoles.map((r) => (
          <RoleFulfillmentChip key={r.roleKey} roleKey={r.roleKey} years={r.years} filled={r.filled} need={r.need} />
        ))}
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-ds-xl">
        <div className="absolute inset-0 z-0 min-h-[240px]">
          <ScheduleMapLeaflet
            staffList={staffListForMap}
            selectedZone={selectedZone}
            activeStaffId={activeStaffId}
            onStaffMarkerToggle={onStaffMarkerToggle}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1000] flex justify-center px-ds-3 pb-3 pt-10">
          <div className="scheduling-route-panel-card pointer-events-auto w-full rounded-ds-m border border-ds-border-base bg-ds-canvas-base px-ds-6 py-ds-5 shadow-ds-md">
            <p className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">Routes</p>
            <div className="mt-ds-2 flex flex-wrap items-center gap-x-ds-6 gap-y-ds-3">
              <RouteCheckbox
                label="Show None"
                checked={routeSelection.showAll}
                onChange={(e) => {
                  if (e.target.checked) onShowNoneRoutes()
                }}
              />
              {ZONES.map((z) => (
                <RouteCheckbox
                  key={z}
                  label={z}
                  checked={!routeSelection.showAll && routeSelection[z]}
                  onChange={() => onToggleRouteZone(z)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
