import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { CLIENT_HOME_COORDS, STAFF_ROLES, matchScoreTier, zoneAccent } from '../schedule/mockStaffData'

const MAP_CENTER = [CLIENT_HOME_COORDS.lat, CLIENT_HOME_COORDS.lng]
const DEFAULT_ZOOM = 13

const METRO_PAD_LAT = 0.022
const METRO_PAD_LNG = 0.048

const ANCHOR = [CLIENT_HOME_COORDS.lat, CLIENT_HOME_COORDS.lng]

/** Quadrant wedges around the client home — lightweight zone overlay (metro scale) */
const ZONE_GEO = {
  North: [
    [38.928, -77.08],
    [38.928, -77.01],
    ANCHOR,
  ],
  East: [
    [38.928, -77.01],
    [38.895, -77.01],
    ANCHOR,
  ],
  South: [
    [38.895, -77.01],
    [38.895, -77.08],
    ANCHOR,
  ],
  West: [
    [38.895, -77.08],
    [38.928, -77.08],
    ANCHOR,
  ],
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escAttr(s) {
  return escHtml(s).replace(/`/g, '&#96;')
}

function matchDotColor(score) {
  const t = matchScoreTier(score)
  if (t === 'high') return '#18b351'
  if (t === 'mid') return '#eab308'
  return '#dc2626'
}

/** Compact map preview — avatar, name, match, role • experience only (no zone / care tags). */
function staffHoverCardHtml(staff) {
  const role = STAFF_ROLES[staff.roleKey] || staff.roleKey
  const roleExp = escHtml(`${role} • ${staff.experienceLabel}`)
  const dot = matchDotColor(staff.matchScore)

  return `<div class="scheduling-map-hover scheduling-map-hover--preview">
    <div class="scheduling-map-hover__head">
      <img class="scheduling-map-hover__avatar" src="${escAttr(staff.avatarUrl)}" alt="" width="48" height="48" />
      <div class="scheduling-map-hover__main">
        <div class="scheduling-map-hover__name">
          <span>${escHtml(staff.fullName)}</span>
          <span class="scheduling-map-hover__gen">(${escHtml(staff.gender)})</span>
        </div>
        <div class="scheduling-map-hover__match">
          <span class="scheduling-map-hover__match-dot" style="background-color:${dot}"></span>
          <span class="scheduling-map-hover__match-txt">${escHtml(String(staff.matchScore))}% match</span>
        </div>
        <p class="scheduling-map-hover__role-one">${roleExp}</p>
      </div>
    </div>
  </div>`
}

export default function ScheduleMapLeaflet({
  staffList,
  selectedZone,
  activeStaffId = null,
  onStaffMarkerToggle,
}) {
  const wrapRef = useRef(null)
  const mapRef = useRef(null)
  const layersRef = useRef({ staffMarkers: [], zones: [], lines: [], clientMarker: null })
  const [tilesFailed, setTilesFailed] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || mapRef.current) return

    const map = L.map(el, {
      scrollWheelZoom: true,
      minZoom: 12,
      maxZoom: 17,
      maxBoundsViscosity: 0.85,
    }).setView(MAP_CENTER, DEFAULT_ZOOM)
    mapRef.current = map

    const metroBounds = L.latLngBounds(
      [CLIENT_HOME_COORDS.lat - METRO_PAD_LAT, CLIENT_HOME_COORDS.lng - METRO_PAD_LNG],
      [CLIENT_HOME_COORDS.lat + METRO_PAD_LAT, CLIENT_HOME_COORDS.lng + METRO_PAD_LNG],
    )
    map.setMaxBounds(metroBounds)

    const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
    }).addTo(map)

    tiles.on('tileerror', () => {
      setTilesFailed(true)
    })

    const invalidate = () => {
      window.setTimeout(() => map.invalidateSize(), 60)
    }
    invalidate()
    window.addEventListener('resize', invalidate)

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            requestAnimationFrame(() => map.invalidateSize())
          })
        : null
    if (ro) ro.observe(el)

    return () => {
      window.removeEventListener('resize', invalidate)
      ro?.disconnect()
      map.remove()
      mapRef.current = null
      el.replaceChildren()
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    layersRef.current.staffMarkers.forEach((m) => {
      try {
        map.removeLayer(m)
      } catch {
        /* marker may belong to a removed map instance */
      }
    })
    layersRef.current.zones.forEach((z) => {
      try {
        map.removeLayer(z)
      } catch {
        /* same */
      }
    })
    layersRef.current.lines.forEach((l) => {
      try {
        map.removeLayer(l)
      } catch {
        /* same */
      }
    })
    if (layersRef.current.clientMarker) {
      try {
        map.removeLayer(layersRef.current.clientMarker)
      } catch {
        /* same */
      }
      layersRef.current.clientMarker = null
    }
    layersRef.current = { staffMarkers: [], zones: [], lines: [], clientMarker: null }

    if (selectedZone && ZONE_GEO[selectedZone]) {
      const poly = L.polygon(ZONE_GEO[selectedZone], {
        color: '#570020',
        weight: 2,
        fillColor: '#570020',
        fillOpacity: 0.08,
      }).addTo(map)
      layersRef.current.zones.push(poly)
    }

    const homeLatLng = L.latLng(CLIENT_HOME_COORDS.lat, CLIENT_HOME_COORDS.lng)

    staffList.forEach((staff) => {
      const selected = activeStaffId === staff.id
      const borderCol = selected ? '#570020' : zoneAccent(staff.zone)
      const borderW = selected ? 3 : 2

      const html = `<div class="leaflet-staff-hit" role="button" tabindex="0" aria-pressed="${selected}" style="cursor:pointer;width:36px;height:36px;border-radius:6px;overflow:hidden;box-sizing:border-box;box-shadow:0 2px 8px rgba(13,13,14,0.12),0 0 0 ${borderW}px ${borderCol}">
        <img src="${escAttr(staff.avatarUrl)}" alt="" width="36" height="36" style="display:block;width:36px;height:36px;object-fit:cover" draggable="false" />
      </div>`

      const icon = L.divIcon({
        className: 'leaflet-staff-marker-wrap',
        html,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })

      const marker = L.marker([staff.lat, staff.lng], { icon }).addTo(map)
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e)
        onStaffMarkerToggle?.(staff.id)
      })

      const tip = staffHoverCardHtml(staff)
      marker.bindTooltip(tip, {
        direction: 'top',
        offset: [0, -10],
        opacity: 1,
        sticky: true,
        className: 'scheduling-map-tooltip-wrap',
        interactive: true,
      })

      layersRef.current.staffMarkers.push(marker)

      if (
        selectedZone &&
        staff.zone === selectedZone &&
        staff.id !== activeStaffId
      ) {
        const line = L.polyline([homeLatLng, L.latLng(staff.lat, staff.lng)], {
          color: '#570020',
          weight: 1,
          dashArray: '4 6',
          opacity: 0.45,
        }).addTo(map)
        layersRef.current.lines.push(line)
      }
    })

    if (activeStaffId) {
      const sel = staffList.find((s) => s.id === activeStaffId)
      if (sel) {
        const selLine = L.polyline([homeLatLng, L.latLng(sel.lat, sel.lng)], {
          color: '#570020',
          weight: 2,
          opacity: 0.92,
        }).addTo(map)
        layersRef.current.lines.push(selLine)
      }
    }

    const pinHtml = `<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:#830034;border-radius:4px;border:2px solid #830034" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 14s4.5-3.2 4.5-7A4.5 4.5 0 1 0 3.5 7C3.5 10.8 8 14 8 14z" fill="white" fill-opacity="0.95"/><circle cx="8" cy="7" r="1.5" fill="#830034"/></svg>
    </div>`

    const pinIcon = L.divIcon({
      className: 'leaflet-client-pin-wrap',
      html: pinHtml,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
    })

    const clientMarker = L.marker([CLIENT_HOME_COORDS.lat, CLIENT_HOME_COORDS.lng], {
      icon: pinIcon,
      zIndexOffset: 1200,
    }).addTo(map)
    layersRef.current.clientMarker = clientMarker

    requestAnimationFrame(() => map.invalidateSize())

    return () => {
      const m = mapRef.current
      if (!m) return
      layersRef.current.staffMarkers.forEach((mk) => {
        try {
          m.removeLayer(mk)
        } catch {
          /* noop */
        }
      })
      layersRef.current.zones.forEach((z) => {
        try {
          m.removeLayer(z)
        } catch {
          /* noop */
        }
      })
      layersRef.current.lines.forEach((l) => {
        try {
          m.removeLayer(l)
        } catch {
          /* noop */
        }
      })
      if (layersRef.current.clientMarker) {
        try {
          m.removeLayer(layersRef.current.clientMarker)
        } catch {
          /* noop */
        }
      }
      layersRef.current = { staffMarkers: [], zones: [], lines: [], clientMarker: null }
    }
  }, [staffList, selectedZone, activeStaffId, onStaffMarkerToggle])

  return (
    <div className="leaflet-map-host--fill">
      <div ref={wrapRef} className="leaflet-map-host leaflet-road-muted z-0 h-full min-h-[240px] w-full" />
      {tilesFailed ? (
        <div
          className="pointer-events-none absolute inset-0 z-[400] flex items-end justify-center bg-gradient-to-t from-ds-canvas-base/95 via-ds-canvas-base/40 to-transparent px-ds-5 pb-4 pt-24"
          role="status"
          aria-live="polite"
        >
          <p className="max-w-md rounded-ds-m border border-ds-border-base bg-ds-canvas-base px-ds-5 py-ds-3 text-center text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-base shadow-ds-md">
            Map tiles could not be loaded. Check your network connection. The map area stays available for
            routes and markers when tiles recover.
          </p>
        </div>
      ) : null}
    </div>
  )
}
