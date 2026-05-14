import { zoneAccent } from '../schedule/mockStaffData'

const VB = { w: 400, h: 280 }

/** Four wedge zones meeting at center — lightweight “real map” feel */
const ZONE_PATHS = {
  North: 'M 0 0 L 400 0 L 200 140 Z',
  East: 'M 400 0 L 400 280 L 200 140 Z',
  South: 'M 400 280 L 0 280 L 200 140 Z',
  West: 'M 0 280 L 0 0 L 200 140 Z',
}

function StaffMarker({ staff, cx, cy }) {
  const initials = staff.fullName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)

  return (
    <g transform={`translate(${cx} ${cy})`} className="pointer-events-none">
      <circle r="14" fill="white" stroke="var(--color-ds-border-base)" strokeWidth="1.5" />
      <circle r="12" fill="var(--color-ds-button-primary)" />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        style={{ fontFamily: 'inherit', fontSize: '8px', fontWeight: 600 }}
      >
        {initials}
      </text>
    </g>
  )
}

export default function SchedulingMap({ staffList, selectedZone, clientPin }) {
  const pin = clientPin ?? { x: 50, y: 30 }
  const pinX = (pin.x / 100) * VB.w
  const pinY = (pin.y / 100) * VB.h

  return (
    <div className="relative overflow-hidden rounded-ds-m border border-ds-border-base bg-ds-canvas-light shadow-ds-sm">
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="aspect-[400/280] h-auto w-full text-ds-text-dark"
        role="img"
        aria-label="Simplified service area map with staff markers"
      >
        <defs>
          <pattern id="sched-map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="var(--color-ds-border-base)"
              strokeWidth="0.5"
              opacity="0.6"
            />
          </pattern>
          <linearGradient id="sched-map-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbfbfb" />
            <stop offset="100%" stopColor="#ececee" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#sched-map-fade)" />
        <rect width="100%" height="100%" fill="url(#sched-map-grid)" opacity="0.35" />

        {/* Soft blocks suggesting blocks / parks */}
        <rect x="40" y="160" width="90" height="70" rx="6" fill="#e8e8ea" opacity="0.55" />
        <rect x="260" y="40" width="100" height="55" rx="6" fill="#e4e4e7" opacity="0.5" />
        <rect x="180" y="180" width="120" height="60" rx="8" fill="#dfe0e3" opacity="0.45" />

        {selectedZone && ZONE_PATHS[selectedZone] ? (
          <path
            d={ZONE_PATHS[selectedZone]}
            fill="rgba(87, 0, 32, 0.12)"
            stroke="var(--color-ds-button-primary)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ) : null}

        {/* faint outlines for all zones when none selected — subtle context */}
        {!selectedZone ? (
          <g opacity="0.14" fill="none" stroke="var(--color-ds-text-dark)" strokeWidth="1">
            {Object.entries(ZONE_PATHS).map(([z, d]) => (
              <path key={z} d={d} />
            ))}
          </g>
        ) : null}

        {selectedZone
          ? staffList
              .filter((s) => s.zone === selectedZone)
              .map((s) => {
                const sx = (s.map.x / 100) * VB.w
                const sy = (s.map.y / 100) * VB.h
                return (
                  <line
                    key={`route-${s.id}`}
                    x1={pinX}
                    y1={pinY}
                    x2={sx}
                    y2={sy}
                    stroke="var(--color-ds-button-primary)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.35"
                  />
                )
              })
          : null}

        {staffList.map((s) => (
          <StaffMarker
            key={s.id}
            staff={s}
            cx={(s.map.x / 100) * VB.w}
            cy={(s.map.y / 100) * VB.h}
          />
        ))}

        {/* Client home pin */}
        <g transform={`translate(${(pin.x / 100) * VB.w} ${(pin.y / 100) * VB.h})`}>
          <path
            d="M0-18c-6 0-10 4.5-10 10 0 8 10 18 10 18s10-10 10-18c0-5.5-4-10-10-10z"
            fill="var(--color-ds-button-primary)"
            stroke="white"
            strokeWidth="2"
          />
          <circle cy="-18" r="3" fill="white" />
        </g>
      </svg>
      {selectedZone ? (
        <div className="pointer-events-none absolute left-ds-5 top-ds-5 rounded-ds-s bg-white/90 px-ds-3 py-ds-2 text-[11px] font-medium leading-4 tracking-[-0.2px] text-ds-text-dark shadow-ds-sm ring-1 ring-ds-border-base">
          <span className="mr-ds-2 inline-block size-2 rounded-full" style={{ background: zoneAccent(selectedZone) }} />
          {selectedZone} zone
        </div>
      ) : null}
    </div>
  )
}
