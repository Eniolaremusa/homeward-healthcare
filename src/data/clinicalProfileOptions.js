export const RISK_LEVEL_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

/** Care Type multi-select — exact clinical catalog only */
export const CARE_TYPE_OPTIONS = [
  'Wound Care',
  'Physiotherapy',
  'Pediatric',
  'IV Therapy',
  'Palliative Care',
  'Chronic Disease',
]

export const ALLERGY_OPTIONS = [
  'NKDA (no known drug allergies)',
  'Penicillin',
  'Sulfa',
  'Latex',
  'Aspirin',
  'Contrast dye',
  'Shellfish',
  'Nuts',
]

export const EQUIPMENT_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'oxygen', label: 'Oxygen' },
  { value: 'hospital_bed', label: 'Hospital bed' },
  { value: 'walker', label: 'Walker / gait aid' },
  { value: 'wheelchair', label: 'Wheelchair' },
  { value: 'other', label: 'Other / TBD' },
]

export const PHYSICIAN_OPTIONS = [
  { value: 'chen', label: 'Dr. Michelle Chen' },
  { value: 'ortiz', label: 'Dr. James Ortiz' },
  { value: 'patel', label: 'Dr. Priya Patel' },
  { value: 'wright', label: 'Dr. Alan Wright' },
]

export const MEDICATION_DOSAGE_UNIT_OPTIONS = [
  { value: 'mg', label: 'mg' },
  { value: 'ml', label: 'ml' },
  { value: 'g', label: 'g' },
  { value: 'mcg', label: 'mcg' },
  { value: 'units', label: 'Units' },
]

export const MEDICATION_DRUG_FORM_OPTIONS = [
  { value: 'tablet', label: 'Tablet' },
  { value: 'intravenous', label: 'Intravenous' },
  { value: 'capsule', label: 'Capsule' },
  { value: 'liquid', label: 'Liquid' },
]

export const MEDICATION_DRUG_MODE_OPTIONS = [
  { value: 'oral', label: 'Oral' },
  { value: 'injection', label: 'Injection' },
  { value: 'iv', label: 'IV' },
  { value: 'topical', label: 'Topical' },
  { value: 'subcutaneous', label: 'Subcutaneous' },
  { value: 'inhalation', label: 'Inhalation' },
]

export const MEDICATION_FREQUENCY_COUNT_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}x`,
}))

export const MEDICATION_FREQUENCY_INTERVAL_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'bimonthly', label: 'Bi-monthly' },
  { value: 'yearly', label: 'Yearly' },
]

export const VISIT_FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: '2x_week', label: '2× per week' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'as_needed', label: 'As needed' },
]

export const VISIT_DURATION_UNIT_OPTIONS = [
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
]

/** Care plan — preferred visit window (fixed set; no free-form time). */
export const PREFERRED_VISIT_TIME_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'nights', label: 'Nights' },
  { value: 'no_preference', label: 'No Preferred Time' },
]

/** Sample catalog for medication drug-name combobox (care case). */
export const MEDICATION_SAMPLE_OPTIONS = [
  { value: 'Metformin', label: 'Metformin' },
  { value: 'Lisining', label: 'Lisining' },
  { value: 'Ibuprofen', label: 'Ibuprofen' },
  { value: 'Amethazine', label: 'Amethazine' },
  { value: 'Warfar', label: 'Warfar' },
  { value: 'Panzi', label: 'Panzi' },
  { value: 'Aspirin', label: 'Aspirin' },
  { value: 'Lipitor', label: 'Lipitor' },
  { value: 'Furosemy', label: 'Furosemy' },
  { value: 'Metoclopramide', label: 'Metoclopramide' },
]

export const CARE_STAFF_ROLE_OPTIONS = [
  { value: 'RN', label: 'Registered Nurse' },
  { value: 'CNA', label: 'Certified Nursing Assistant' },
  { value: 'LPN', label: 'Licensed Practical Nurse' },
]

export const CARE_STAFF_EXPERIENCE_OPTIONS = [
  { value: '1_2', label: '1–2 Years' },
  { value: '3_5', label: '3–5 Years' },
  { value: '5_plus', label: '5+ Years' },
]

export const TASK_DURATION_OPTIONS = [
  { value: '15m', label: '15 min' },
  { value: '30m', label: '30 min' },
  { value: '45m', label: '45 min' },
  { value: '1h', label: '1 hr' },
  { value: '2h', label: '2 hr' },
]

export const TASK_FREQUENCY_OPTIONS = [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
]
