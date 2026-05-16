import { useEffect, useMemo, useRef, useState } from 'react'
import Field from '../Field'
import MultiSelectChipsField from '../MultiSelectChipsField'
import PhysicianSelectField from '../PhysicianSelectField'
import SelectField from '../SelectField'
import TextareaField from '../TextareaField'
import CareCaseStepFooter from './CareCaseStepFooter'
import MedicationFormCard, {
  createEmptyMedicationEntry,
  validateMedicationEntry,
} from './MedicationFormCard'
import { useIntakeToast } from '../../context/IntakeToastContext'
import {
  ALLERGY_OPTIONS,
  CARE_TYPE_OPTIONS,
  EQUIPMENT_OPTIONS,
  PHYSICIAN_OPTIONS,
  RISK_LEVEL_OPTIONS,
} from '../../data/clinicalProfileOptions'

function validate(values, careTypes, allergies, medications) {
  const errors = {}
  if (!String(values.diagnosis).trim()) errors.diagnosis = 'Diagnosis is required'
  if (!values.riskLevel) errors.riskLevel = 'Risk level is required'
  if (!values.physicianId) errors.physicianId = 'Attending physician is required'
  if (!careTypes.length) errors.careTypes = 'Select at least one care type'
  if (!allergies.length) errors.allergies = 'Select allergies or NKDA'
  if (!values.equipment) errors.equipment = 'Equipment requirement is required'

  if (medications.length > 0) {
    const bad = medications.some((m) => Object.keys(validateMedicationEntry(m)).length > 0)
    if (bad) errors.medications = 'Complete all medication fields'
  }

  return errors
}

/**
 * Care case step 1 — clinical profile (main column form).
 */
export default function ClinicalProfileStep({ initialData, onComplete, onCancel }) {
  const { showError } = useIntakeToast()
  const [values, setValues] = useState({
    diagnosis: '',
    riskLevel: '',
    physicianId: '',
    equipment: '',
  })
  const [careTypes, setCareTypes] = useState([])
  const [allergies, setAllergies] = useState([])
  const [medications, setMedications] = useState([])
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  /** True after user adds a row or restores saved meds — drives medication validation UX. */
  const [medSectionActive, setMedSectionActive] = useState(false)
  const [medRowTouched, setMedRowTouched] = useState({})
  const prevMedCountRef = useRef(null)

  useEffect(() => {
    if (!initialData) return
    setValues({
      diagnosis: initialData.diagnosis ?? '',
      riskLevel: initialData.riskLevel ?? '',
      physicianId: initialData.physicianId ?? '',
      equipment: initialData.equipment ?? '',
    })
    setCareTypes(initialData.careTypes?.length ? [...initialData.careTypes] : [])
    setAllergies(initialData.allergies?.length ? [...initialData.allergies] : [])
    const meds = initialData.medications?.length ? initialData.medications.map((m) => ({ ...m })) : []
    setMedications(meds)
    if (meds.length) setMedSectionActive(true)
  }, [initialData])

  const errors = useMemo(
    () => validate(values, careTypes, allergies, medications),
    [values, careTypes, allergies, medications],
  )
  const isValid = Object.keys(errors).length === 0

  const medFieldErrorsById = useMemo(() => {
    const map = {}
    medications.forEach((m) => {
      map[m.id] = validateMedicationEntry(m)
    })
    return map
  }, [medications])

  const visibleErrors = useMemo(() => {
    const out = {}
    Object.keys(errors).forEach((k) => {
      if (k === 'careTypes' && (submitted || touched.careTypes)) out[k] = errors[k]
      else if (k === 'allergies' && (submitted || touched.allergies)) out[k] = errors[k]
      else if (k === 'medications' && submitted && medSectionActive) out[k] = errors[k]
      else if (submitted || touched[k]) out[k] = errors[k]
    })
    return out
  }, [errors, submitted, touched, medSectionActive])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
  }

  const addMedication = () => {
    setMedSectionActive(true)
    setMedications((prev) => [...prev, createEmptyMedicationEntry()])
  }

  const patchMedication = (id, partial) => {
    setMedications((rows) => rows.map((row) => (row.id === id ? { ...row, ...partial } : row)))
  }

  const removeMedication = (id) => {
    setMedications((rows) => rows.filter((row) => row.id !== id))
    setMedRowTouched((t) => {
      const c = { ...t }
      delete c[id]
      return c
    })
  }

  useEffect(() => {
    const n = medications.length
    if (prevMedCountRef.current === null) {
      prevMedCountRef.current = n
      return
    }
    const prev = prevMedCountRef.current
    prevMedCountRef.current = n
    if (prev > 0 && n === 0) {
      setMedSectionActive(false)
      setMedRowTouched({})
    }
  }, [medications.length])

  const markMedRowTouched = (rowId) => {
    setMedRowTouched((t) => ({ ...t, [rowId]: true }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTouched((t) => ({
      ...t,
      careTypes: true,
      allergies: true,
    }))

    const nextErrors = validate(values, careTypes, allergies, medications)
    if (Object.keys(nextErrors).length === 0) {
      onComplete?.({
        diagnosis: values.diagnosis.trim(),
        riskLevel: values.riskLevel,
        physicianId: values.physicianId,
        careTypes,
        allergies,
        medications: medications.map((m) => ({ ...m })),
        equipment: values.equipment,
      })
    } else {
      const first = Object.values(nextErrors)[0]
      showError(typeof first === 'string' ? first : 'Please complete all required fields.')
    }
  }

  return (
    <article className="w-full min-w-0 overflow-hidden rounded-ds-l border border-ds-border-base bg-ds-canvas-base shadow-[0px_0px_1px_rgba(19,19,21,0.04)]">
      <header className="border-b border-ds-border-base bg-ds-canvas-base px-ds-8 py-ds-5">
        <p className="text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-light">STEP 1 / 4</p>
        <h2 className="text-[18px] font-medium leading-6 tracking-[-0.54px] text-ds-text-dark">Clinical Profile</h2>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        <div className="border-b border-ds-border-base bg-ds-canvas-light p-ds-6">
          <div className="flex flex-col gap-ds-6 rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-6">
            <TextareaField
              name="diagnosis"
              label="Diagnosis"
              required
              rows={4}
              value={values.diagnosis}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Document primary and relevant secondary diagnoses"
              error={visibleErrors.diagnosis}
            />

            <SelectField
              name="riskLevel"
              label="Risk level"
              required
              placeholder="Select"
              value={values.riskLevel}
              onChange={handleChange}
              onBlur={handleBlur}
              options={RISK_LEVEL_OPTIONS}
              error={visibleErrors.riskLevel}
            />

            <PhysicianSelectField
              name="physicianId"
              label="Attending physician"
              required
              value={values.physicianId}
              onChange={handleChange}
              onBlur={handleBlur}
              options={PHYSICIAN_OPTIONS}
              error={visibleErrors.physicianId}
            />

            <MultiSelectChipsField
              label="Care Type"
              required
              options={CARE_TYPE_OPTIONS}
              value={careTypes}
              onChange={(next) => {
                setCareTypes(next)
                setTouched((t) => ({ ...t, careTypes: true }))
              }}
              error={visibleErrors.careTypes}
              placeholder="Select one or more"
            />

            <MultiSelectChipsField
              label="Allergies"
              required
              options={ALLERGY_OPTIONS}
              value={allergies}
              onChange={(next) => {
                setAllergies(next)
                setTouched((t) => ({ ...t, allergies: true }))
              }}
              error={visibleErrors.allergies}
              placeholder="Select all that apply"
            />

            <div className="rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-5 shadow-ds-sm">
              <div className="mb-ds-4 flex flex-wrap items-center justify-between gap-ds-4">
                <span className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
                  Current medication
                </span>
                <button
                  type="button"
                  onClick={addMedication}
                  className="flex h-9 shrink-0 items-center justify-center rounded-ds-full border border-ds-border-base bg-ds-button-gray px-ds-5 text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark shadow-ds-sm"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-col gap-ds-3">
                {medications.map((row, index) => {
                  const showRowErrors = (submitted && medSectionActive) || Boolean(medRowTouched[row.id])
                  return (
                    <MedicationFormCard
                      key={row.id}
                      entry={row}
                      index={index}
                      fieldErrors={medFieldErrorsById[row.id]}
                      showErrors={showRowErrors}
                      onPatch={patchMedication}
                      onRemove={removeMedication}
                      onRowBlur={() => markMedRowTouched(row.id)}
                    />
                  )
                })}
              </div>
              {visibleErrors.medications ? (
                <p className="mt-ds-3 text-[12px] leading-[18px] text-ds-status-error">{visibleErrors.medications}</p>
              ) : null}
            </div>

            <SelectField
              name="equipment"
              label="Equipment required at home"
              required
              placeholder="Select"
              value={values.equipment}
              onChange={handleChange}
              onBlur={handleBlur}
              options={EQUIPMENT_OPTIONS}
              error={visibleErrors.equipment}
            />
          </div>
        </div>

        <CareCaseStepFooter showPrevious={false} onCancel={onCancel} submitDisabled={!isValid} />
      </form>
    </article>
  )
}
