import { useEffect, useMemo, useState } from 'react'
import DateField from '../DateField'
import Field from '../Field'
import SelectField from '../SelectField'
import TextareaField from '../TextareaField'
import CareCaseStepFooter from './CareCaseStepFooter'
import CareStaffFormCard, {
  createEmptyStaffEntry,
  validateStaffEntry,
} from './CareStaffFormCard'
import { useIntakeToast } from '../../context/IntakeToastContext'
import {
  PREFERRED_VISIT_TIME_OPTIONS,
  VISIT_DURATION_UNIT_OPTIONS,
  VISIT_FREQUENCY_OPTIONS,
} from '../../data/clinicalProfileOptions'

const MIN_VISIT_MINUTES = 30

/**
 * @returns {number | null} minutes when valid positive amount + unit; -1 when amount ≤ 0; null when incomplete / non-numeric
 */
function visitDurationToMinutes(amountStr, unit) {
  if (amountStr === '' || amountStr === undefined || !unit) return null
  const n = Number(amountStr)
  if (!Number.isFinite(n)) return null
  if (n <= 0) return -1
  if (unit === 'minutes') return n
  if (unit === 'hours') return n * 60
  if (unit === 'days') return n * 24 * 60
  return null
}

function validate(values, staffRows) {
  const errors = {}
  if (!values.careStartDate) errors.careStartDate = 'Required'
  if (!values.visitFrequency) errors.visitFrequency = 'Required'
  if (!values.preferredVisitTime) errors.preferredVisitTime = 'Required'
  if (values.visitDurationAmount === '' || values.visitDurationAmount === undefined) {
    errors.visitDurationAmount = 'Required'
  } else if (!Number.isFinite(Number(values.visitDurationAmount))) {
    errors.visitDurationAmount = 'Enter a valid number'
  } else {
    const mins = visitDurationToMinutes(values.visitDurationAmount, values.visitDurationUnit)
    if (mins === -1) errors.visitDurationAmount = 'Must be greater than 0'
    else if (mins !== null && mins < MIN_VISIT_MINUTES) {
      errors.visitDurationAmount = `Minimum visit duration is ${MIN_VISIT_MINUTES} minutes`
    }
  }
  if (!values.visitDurationUnit) errors.visitDurationUnit = 'Required'
  if (!String(values.specificCareNeeds).trim()) errors.specificCareNeeds = 'Required'

  if (!staffRows.length) errors.staff = 'Add at least one care staff requirement'
  else if (staffRows.some((s) => Object.keys(validateStaffEntry(s)).length > 0)) {
    errors.staff = 'Complete each staff row'
  }

  return errors
}

function normalizeInitial(initialData) {
  if (!initialData) return null
  return {
    careStartDate: initialData.careStartDate ?? '',
    visitFrequency: initialData.visitFrequency ?? '',
    preferredVisitTime: initialData.preferredVisitTime ?? '',
    visitDurationAmount: initialData.visitDurationAmount ?? '',
    visitDurationUnit: initialData.visitDurationUnit ?? '',
    specificCareNeeds: initialData.specificCareNeeds ?? '',
    staffRequirements: initialData.staffRequirements?.length
      ? initialData.staffRequirements.map((s) => ({ ...s }))
      : [],
  }
}

export default function CarePlanStep({ initialData, onComplete, onPrevious, onCancel }) {
  const { showError } = useIntakeToast()
  const [values, setValues] = useState({
    careStartDate: '',
    visitFrequency: '',
    preferredVisitTime: '',
    visitDurationAmount: '',
    visitDurationUnit: '',
    specificCareNeeds: '',
  })
  const [staffRows, setStaffRows] = useState([])
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const n = normalizeInitial(initialData)
    if (!n) return
    setValues({
      careStartDate: n.careStartDate,
      visitFrequency: n.visitFrequency,
      preferredVisitTime: n.preferredVisitTime,
      visitDurationAmount: n.visitDurationAmount,
      visitDurationUnit: n.visitDurationUnit,
      specificCareNeeds: n.specificCareNeeds,
    })
    setStaffRows(n.staffRequirements)
  }, [initialData])

  const errors = useMemo(() => validate(values, staffRows), [values, staffRows])
  const isValid = Object.keys(errors).length === 0

  const staffFieldErrors = useMemo(() => {
    const map = {}
    staffRows.forEach((s) => {
      map[s.id] = validateStaffEntry(s)
    })
    return map
  }, [staffRows])

  const visibleErrors = useMemo(() => {
    const out = {}
    Object.keys(errors).forEach((k) => {
      if (k === 'staff' && (submitted || touched.staff)) out[k] = errors[k]
      else if (submitted || touched[k]) out[k] = errors[k]
    })
    return out
  }, [errors, submitted, touched])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
  }

  const addStaff = () => {
    setStaffRows((r) => [...r, createEmptyStaffEntry()])
    setTouched((t) => ({ ...t, staff: true }))
  }

  const patchStaff = (id, partial) => {
    setStaffRows((rows) => rows.map((row) => (row.id === id ? { ...row, ...partial } : row)))
  }

  const removeStaff = (id) => {
    setStaffRows((rows) => rows.filter((r) => r.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTouched((t) => ({ ...t, staff: true }))
    const next = validate(values, staffRows)
    if (Object.keys(next).length === 0) {
      onComplete?.({ ...values, staffRequirements: staffRows })
    } else {
      const first = Object.values(next)[0]
      showError(typeof first === 'string' ? first : 'Please complete all required fields.')
    }
  }

  return (
    <article className="w-full min-w-0 overflow-hidden rounded-ds-l border border-ds-border-base bg-ds-canvas-base shadow-[0px_0px_1px_rgba(19,19,21,0.04)]">
      <header className="border-b border-ds-border-base bg-ds-canvas-base px-ds-8 py-ds-5">
        <p className="text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-light">STEP 2 / 4</p>
        <h2 className="text-[18px] font-medium leading-6 tracking-[-0.54px] text-ds-text-dark">Care Plan</h2>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        <div className="border-b border-ds-border-base bg-ds-canvas-light p-ds-6">
          <div className="flex flex-col gap-ds-6 rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-6">
            <div className="grid grid-cols-1 gap-ds-6 lg:grid-cols-2">
              <DateField
                name="careStartDate"
                label="Care start date"
                required
                allowFuture
                value={values.careStartDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={visibleErrors.careStartDate}
              />
              <SelectField
                name="visitFrequency"
                label="Visit frequency"
                required
                placeholder="Select"
                value={values.visitFrequency}
                onChange={handleChange}
                onBlur={handleBlur}
                options={VISIT_FREQUENCY_OPTIONS}
                error={visibleErrors.visitFrequency}
              />
            </div>

            <div className="grid grid-cols-1 gap-ds-6 lg:grid-cols-2">
              <SelectField
                name="preferredVisitTime"
                label="Preferred visit time"
                required
                placeholder="Select"
                value={values.preferredVisitTime}
                onChange={handleChange}
                onBlur={handleBlur}
                options={PREFERRED_VISIT_TIME_OPTIONS}
                error={visibleErrors.preferredVisitTime}
              />
              <div className="flex w-full flex-col gap-ds-1">
                <span className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
                  Visit duration *
                </span>
                <div className="flex flex-wrap items-start gap-ds-3">
                  <div className="w-full max-w-[40%] min-w-[120px]">
                    <Field
                      name="visitDurationAmount"
                      type="number"
                      step="any"
                      value={values.visitDurationAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="30"
                      ariaLabel="Visit duration amount"
                      error={visibleErrors.visitDurationAmount}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <SelectField
                      name="visitDurationUnit"
                      ariaLabel="Visit duration unit"
                      placeholder="Unit"
                      value={values.visitDurationUnit}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      options={VISIT_DURATION_UNIT_OPTIONS}
                      error={visibleErrors.visitDurationUnit}
                    />
                  </div>
                </div>
              </div>
            </div>

            <TextareaField
              name="specificCareNeeds"
              label="Specific care needs"
              required
              rows={4}
              value={values.specificCareNeeds}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Describe specific clinical and support needs"
              error={visibleErrors.specificCareNeeds}
            />

            <div className="rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-5 shadow-ds-sm">
              <div className="mb-ds-4 flex flex-wrap items-center justify-between gap-ds-4">
                <span className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
                  Care staff requirements *
                </span>
                <button
                  type="button"
                  onClick={addStaff}
                  className="flex h-9 items-center justify-center rounded-ds-full border border-ds-border-base bg-ds-button-gray px-ds-5 text-[13px] font-medium text-ds-text-dark shadow-ds-sm"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-col gap-ds-3">
                {staffRows.map((row) => (
                  <CareStaffFormCard
                    key={row.id}
                    entry={row}
                    fieldErrors={staffFieldErrors[row.id]}
                    showErrors={submitted || touched.staff}
                    onPatch={patchStaff}
                    onRemove={removeStaff}
                    onBlur={() => setTouched((t) => ({ ...t, staff: true }))}
                  />
                ))}
              </div>
              {visibleErrors.staff ? (
                <p className="mt-ds-3 text-[12px] leading-[18px] text-ds-status-error">{visibleErrors.staff}</p>
              ) : null}
            </div>
          </div>
        </div>

        <CareCaseStepFooter
          showPrevious
          onPrevious={onPrevious}
          onCancel={onCancel}
          submitDisabled={!isValid}
        />
      </form>
    </article>
  )
}
