import { ZONES } from '../schedule/mockStaffData'

const DEFAULT_ZONE = 'North'

/** Normalize intake zone to one of North | East | West | South (scheduling quadrants). */
export function normalizeZoneKey(raw) {
  if (raw == null || String(raw).trim() === '') return DEFAULT_ZONE
  const stripped = String(raw).trim().replace(/\s*zone\s*$/i, '').trim()
  const hit = ZONES.find((z) => z.toLowerCase() === stripped.toLowerCase())
  return hit ?? DEFAULT_ZONE
}

/**
 * Maps patient intake `mergeStep` summary into `ClientDetailsPanel` intake shape.
 */
export function mapIntakeSummaryToClientDetails(summary) {
  const s = summary ?? {}
  const displayName = s.patientDisplayName || 'Patient'

  return {
    displayName,
    genderLetter: (() => {
      if (s.genderLetter === 'M' || s.genderLetter === 'F') return s.genderLetter
      if (s.gender === 'male') return 'M'
      if (s.gender === 'female') return 'F'
      return ''
    })(),
    email: s.emailAddress || '—',
    zone: normalizeZoneKey(s.zone ?? s.serviceZone ?? s.clientZone),
    avatarSrc: null,
    careTypes: [],
    personal: {
      address: s.homeAddress || '—',
      phone: s.phoneDisplay || '—',
      dateOfBirth: s.dateOfBirthDisplay || '—',
      insuranceProvider: s.insuranceProviderLabel || '—',
      insuranceNumber: s.insuranceId || '—',
    },
    emergency: {
      name: s.emergencyContactName || '—',
      phone: s.emergencyContactPhoneDisplay || '—',
      address: s.emergencyContactAddress || '—',
      relationship: s.emergencyContactRelationshipLabel || '—',
    },
    preferences: {
      nurseGender: s.nurseGenderPreferenceLabel || '—',
      language: s.languagePreferenceLabel || '—',
      communication: s.communicationPreferenceLabel || '—',
      livingSituation: s.livingSituationLabel || '—',
    },
  }
}
