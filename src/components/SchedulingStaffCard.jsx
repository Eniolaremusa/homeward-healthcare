import CareTypeTag from './client-details/CareTypeTag'
import ZoneTag from './ZoneTag'
import { careTypeDisplayLabel } from '../schedule/careNeedsPicker'
import { STAFF_ROLES, matchScoreTier } from '../schedule/mockStaffData'
import { formatExperienceShort, getRouteTimeline } from '../schedule/staffRouteTimeline'

function MatchScoreRow({ score }) {
  const tier = matchScoreTier(score)
  const dot =
    tier === 'high' ? 'bg-ds-status-success' : tier === 'mid' ? 'bg-[#eab308]' : 'bg-ds-status-error'

  return (
    <div className="inline-flex items-center gap-ds-2">
      <span className={`size-[6px] shrink-0 rounded-full border-[0.3px] border-ds-canvas-base ${dot}`} aria-hidden />
      <span className="text-[12px] font-medium leading-[18px] tracking-[-0.12px] text-ds-text-dark">
        {score}% match
      </span>
    </div>
  )
}

function RoleExperienceRow({ roleLabel, experienceShort }) {
  return (
    <div className="flex flex-wrap items-center gap-ds-4 text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-base">
      <span className="whitespace-nowrap">{roleLabel}</span>
      <span className="h-4 w-px shrink-0 bg-ds-border-base" aria-hidden />
      <span className="whitespace-nowrap">{experienceShort}</span>
    </div>
  )
}

function formatOnSiteLabel(hrs) {
  const h = Number(hrs) || 0
  if (h <= 0) return null
  if (h === 1) return '(1 hour)'
  return `(${h} hours)`
}

/** 16px nodes: intermediates = solid primary; start/stop = ring (same outer size, design-system distinction). */
function RouteTimelineStartStopNode() {
  return (
    <div
      className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-ds-button-primary bg-ds-canvas-base"
      aria-hidden
    >
      <span className="size-2 shrink-0 rounded-full bg-ds-button-primary" />
    </div>
  )
}

function RouteTimelineIntermediateNode() {
  return <div className="mt-1 size-4 shrink-0 rounded-full bg-ds-button-primary" aria-hidden />
}

function RouteTimeline({ route }) {
  return (
    <div className="scheduling-route-timeline space-y-ds-6">
      <div className="flex gap-ds-3">
        <div className="w-12 shrink-0 pt-0.5 text-right text-[12px] font-medium leading-[18px] tracking-[-0.12px] text-ds-text-dark">
          Start
        </div>
        <div className="flex min-w-0 flex-1 gap-ds-3">
          <RouteTimelineStartStopNode />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">{route.startLabel}</p>
          </div>
        </div>
      </div>

      {route.stops.map((stop, idx) => {
        const onSite = formatOnSiteLabel(stop.durationHrs)
        return (
          <div key={idx} className="flex gap-ds-3">
            <div className="w-12 shrink-0 pt-0.5 text-right text-[12px] font-medium leading-[18px] tracking-[-0.12px] text-ds-text-dark">
              {stop.time}
            </div>
            <div className="flex min-w-0 flex-1 gap-ds-3">
              <RouteTimelineIntermediateNode />
              <div className="min-w-0 flex-1 space-y-ds-1">
                <p className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">{stop.location}</p>
                <div className="flex flex-wrap items-center gap-x-ds-4 gap-y-ds-1 text-[12px] font-medium leading-[18px] tracking-[-0.12px] text-ds-text-base">
                  <span>{stop.driveMins} mins</span>
                  <span>{stop.miles} miles</span>
                  {onSite ? <span className="text-ds-button-primary">{onSite}</span> : null}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      <div className="flex gap-ds-3">
        <div className="w-12 shrink-0 pt-0.5 text-right text-[12px] font-medium leading-[18px] tracking-[-0.12px] text-ds-text-dark">
          Stop
        </div>
        <div className="flex min-w-0 flex-1 gap-ds-3">
          <RouteTimelineStartStopNode />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">{route.endLabel}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Staff list card — list body matches scheduling card spec; expanded route timeline (Figma 642:124747).
 * Assign appears only when expanded + showAssign.
 */
export default function SchedulingStaffCard({
  staff,
  selected,
  expanded,
  onActivate,
  showAssign,
  onAssign,
  assignDisabled,
}) {
  const route = getRouteTimeline(staff)
  const expShort = formatExperienceShort(staff.experienceLabel)
  const roleLabel = STAFF_ROLES[staff.roleKey] || staff.roleKey

  return (
    <article
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-pressed={selected}
      aria-label={`${selected ? 'Selected' : 'Select'} ${staff.fullName}, ${roleLabel}`}
      onClick={() => onActivate?.(staff.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onActivate?.(staff.id)
        }
      }}
      className={`cursor-pointer overflow-hidden rounded-ds-l border border-ds-border-base bg-ds-canvas-base p-ds-5 shadow-ds-md outline-none transition-shadow duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ds-button-primary/25 ${
        expanded ? 'shadow-ds-md' : ''
      }`}
    >
      <div className="flex w-full items-start gap-ds-5">
        <div className="size-12 shrink-0 overflow-hidden rounded-[6px] border border-ds-border-base bg-ds-canvas-base">
          {staff.avatarUrl ? (
            <img src={staff.avatarUrl} alt="" className="size-full object-cover" width={48} height={48} />
          ) : (
            <div className="flex size-full items-center justify-center bg-ds-button-secondary text-[12px] font-semibold text-ds-text-white">
              {String(staff.fullName || '')
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .map((p) => p[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || '?'}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-start justify-between gap-ds-4">
          <div className="flex min-w-0 flex-1 flex-col gap-ds-1">
            <p className="flex flex-wrap items-baseline gap-ds-2 text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark">
              <span className="truncate">{staff.fullName}</span>
              <span className="shrink-0 text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
                ({staff.gender})
              </span>
            </p>
            <RoleExperienceRow roleLabel={roleLabel} experienceShort={expShort} />
          </div>
          <div className="shrink-0 self-start pt-px">
            <MatchScoreRow score={staff.matchScore} />
          </div>
        </div>
      </div>

      <div className="mt-ds-6 flex w-full flex-wrap items-center gap-[5px]">
        <ZoneTag zone={staff.zone} />
        {staff.specialties.map((sp) => (
          <CareTypeTag key={sp} label={careTypeDisplayLabel(sp)} styleKey={sp} />
        ))}
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? 'mt-ds-4 grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-ds-5 border-t border-ds-border-base pt-ds-5">
            <p className="text-[12px] font-medium uppercase leading-[18px] tracking-[-0.24px] text-ds-text-base">
              Route timeline
            </p>
            <RouteTimeline route={route} />

            {showAssign ? (
              <div className="border-t border-ds-border-base pt-ds-5">
                <button
                  type="button"
                  disabled={assignDisabled}
                  onClick={(e) => {
                    e.stopPropagation()
                    onAssign?.()
                  }}
                  className="flex h-10 w-full items-center justify-center rounded-ds-full bg-ds-button-primary px-ds-6 text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-white shadow-ds-sm outline-none transition enabled:hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ds-button-primary/25 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Assign
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
