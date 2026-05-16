/** Case study client — aligns with scheduling / matching demo */
export const CLIENT_CASE = {
  displayName: 'Vera Jameson',
  gender: 'M',
  zone: 'North',
  nurseGenderPreference: 'male',
  languagePreferenceLabel: 'English',
}

/** Client home (Washington, DC) — map + routes */
export const CLIENT_HOME_COORDS = { lat: 38.9118, lng: -77.0462 }

export const ZONES = ['North', 'East', 'West', 'South']

export const STAFF_ROLES = {
  RN: 'Registered Nurse',
  CNA: 'Certified Nursing Assistant',
  LPN: 'Licensed Practical Nurse',
}

export const ALL_SPECIALTIES = [
  'IV Therapy',
  'Palliative Care',
  'Chronic Disease',
  'Wound Care',
  'Physiotherapy',
  'Pediatric Care',
]

/** Operational staff — coordinates near CLIENT_HOME_COORDS */
export const STAFF_DATASET = [
  {
    id: 's1',
    fullName: 'Marcus Reid',
    gender: 'M',
    roleKey: 'RN',
    zone: 'North',
    specialties: ['Chronic Disease', 'IV Therapy', 'Wound Care'],
    matchScore: 96,
    capacityPct: 62,
    driveMins: 9,
    miles: 1.4,
    experienceLabel: '3–5 years',
    avatarUrl: 'https://i.pravatar.cc/96?img=15',
    lat: 38.9155,
    lng: -77.052,
  },
  {
    id: 's2',
    fullName: 'Elena Park',
    gender: 'F',
    roleKey: 'RN',
    zone: 'North',
    specialties: ['Palliative Care', 'Chronic Disease', 'IV Therapy'],
    matchScore: 91,
    capacityPct: 54,
    driveMins: 11,
    miles: 1.9,
    experienceLabel: '5+ years',
    avatarUrl: 'https://i.pravatar.cc/96?img=32',
    lat: 38.9168,
    lng: -77.0418,
  },
  {
    id: 's3',
    fullName: 'James Okafor',
    gender: 'M',
    roleKey: 'LPN',
    zone: 'North',
    specialties: ['Wound Care', 'Chronic Disease'],
    matchScore: 88,
    capacityPct: 71,
    driveMins: 14,
    miles: 2.3,
    experienceLabel: '3–5 years',
    avatarUrl: 'https://i.pravatar.cc/96?img=47',
    lat: 38.913,
    lng: -77.0488,
  },
  {
    id: 's4',
    fullName: 'Priya Natarajan',
    gender: 'F',
    roleKey: 'CNA',
    zone: 'North',
    specialties: ['Chronic Disease', 'Physiotherapy', 'Wound Care'],
    matchScore: 84,
    capacityPct: 78,
    driveMins: 16,
    miles: 2.8,
    experienceLabel: '1–3 years',
    avatarUrl: 'https://i.pravatar.cc/96?img=5',
    lat: 38.9119,
    lng: -77.0395,
  },
  {
    id: 's5',
    fullName: 'Daniel Hughes',
    gender: 'M',
    roleKey: 'RN',
    zone: 'East',
    specialties: ['Chronic Disease', 'IV Therapy', 'Wound Care', 'Pediatric Care'],
    matchScore: 76,
    capacityPct: 66,
    driveMins: 22,
    miles: 4.1,
    experienceLabel: '3–5 years',
    avatarUrl: 'https://i.pravatar.cc/96?img=12',
    lat: 38.9102,
    lng: -77.0345,
  },
  {
    id: 's6',
    fullName: 'Amanda Nelson',
    gender: 'F',
    roleKey: 'RN',
    zone: 'East',
    specialties: ['Chronic Disease', 'IV Therapy', 'Palliative Care', 'Wound Care'],
    matchScore: 74,
    capacityPct: 60,
    driveMins: 24,
    miles: 4.6,
    experienceLabel: '3–5 years',
    avatarUrl: 'https://i.pravatar.cc/96?img=26',
    lat: 38.9089,
    lng: -77.0372,
  },
  {
    id: 's7',
    fullName: 'Chris Valdez',
    gender: 'M',
    roleKey: 'CNA',
    zone: 'West',
    specialties: ['Chronic Disease', 'Physiotherapy'],
    matchScore: 68,
    capacityPct: 82,
    driveMins: 28,
    miles: 5.2,
    experienceLabel: '1–3 years',
    avatarUrl: 'https://i.pravatar.cc/96?img=44',
    lat: 38.9112,
    lng: -77.0575,
  },
  {
    id: 's8',
    fullName: 'Sonia Malik',
    gender: 'F',
    roleKey: 'LPN',
    zone: 'South',
    specialties: ['Chronic Disease', 'Palliative Care', 'Wound Care'],
    matchScore: 63,
    capacityPct: 88,
    driveMins: 31,
    miles: 6.0,
    experienceLabel: '3–5 years',
    avatarUrl: 'https://i.pravatar.cc/96?img=8',
    lat: 38.9076,
    lng: -77.0475,
  },
  {
    id: 's9',
    fullName: 'Tyler Brooks',
    gender: 'M',
    roleKey: 'CNA',
    zone: 'South',
    specialties: ['Pediatric Care', 'Chronic Disease'],
    matchScore: 52,
    capacityPct: 45,
    driveMins: 35,
    miles: 7.4,
    experienceLabel: '0–1 years',
    avatarUrl: 'https://i.pravatar.cc/96?img=59',
    lat: 38.9063,
    lng: -77.0418,
  },
  {
    id: 's10',
    fullName: 'Rina Cho',
    gender: 'F',
    roleKey: 'LPN',
    zone: 'West',
    specialties: ['Chronic Disease', 'IV Therapy', 'Physiotherapy'],
    matchScore: 48,
    capacityPct: 92,
    driveMins: 38,
    miles: 8.1,
    experienceLabel: '5+ years',
    avatarUrl: 'https://i.pravatar.cc/96?img=21',
    lat: 38.9096,
    lng: -77.0612,
  },
]

export function specialtyStyle(specialty) {
  const map = {
    'IV Therapy': { bg: '#ffe4ef', text: '#9d174d' },
    'Palliative Care': { bg: '#e0ecff', text: '#1e40af' },
    'Chronic Disease': { bg: '#fef9c3', text: '#854d0e' },
    'Wound Care': { bg: '#ccfbf1', text: '#0f766e' },
    Physiotherapy: { bg: '#ede9fe', text: '#5b21b6' },
    'Pediatric Care': { bg: '#dcfce7', text: '#166534' },
    Pediatric: { bg: '#dcfce7', text: '#166534' },
  }
  return map[specialty] ?? { bg: 'var(--color-ds-canvas-dark)', text: 'var(--color-ds-text-dark)' }
}

export function zoneAccent(zone) {
  const colors = {
    North: '#570020',
    East: '#0369a1',
    West: '#6d28d9',
    South: '#b45309',
  }
  return colors[zone] ?? 'var(--color-ds-text-base)'
}

export function matchScoreTier(score) {
  if (score >= 80) return 'high'
  if (score >= 60) return 'mid'
  return 'low'
}
