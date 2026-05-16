import { useMemo, useState } from 'react'
import { useIntakeToast } from '../context/IntakeToastContext'
import Field from './Field'
import PhoneField, { PHONE_COUNTRIES, validatePhoneNational } from './PhoneField'
import SelectField from './SelectField'

const initialValues = {
  emergencyContactName: '',
  phoneCountryCode: 'US',
  emergencyContactPhone: '',
  emergencyContactAddress: '',
  emergencyContactRelationship: '',
}

const requiredLabels = {
  emergencyContactName: 'Emergency contact name',
  emergencyContactPhone: 'Emergency contact phone number',
  emergencyContactAddress: 'Emergency contact address',
  emergencyContactRelationship: 'Emergency contact relationship',
}

const relationshipOptions = [
  { value: 'parent', label: 'Parent' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'child', label: 'Child' },
  { value: 'friend', label: 'Friend' },
  { value: 'guardian', label: 'Legal guardian' },
  { value: 'other', label: 'Other' },
]

function formatPhoneDisplay(countryCode, digitsRaw) {
  const digits = String(digitsRaw || '').replace(/\D/g, '')
  if (!digits) return ''
  const iso = countryCode || 'US'
  if ((iso === 'US' || iso === 'CA') && digits.length === 10) {
    return `+1-${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  const dial = PHONE_COUNTRIES.find((c) => c.iso === iso)?.dial ?? '1'
  return `+${dial}-${digits}`
}

function validate(values) {
  const errors = {}

  Object.entries(requiredLabels).forEach(([key, label]) => {
    if (!String(values[key]).trim()) {
      errors[key] = `${label} is required`
    }
  })

  if (values.emergencyContactPhone) {
    const digits = String(values.emergencyContactPhone).replace(/\D/g, '')
    if (!validatePhoneNational(values.phoneCountryCode || 'US', digits)) {
      errors.emergencyContactPhone = 'Enter a valid number for the selected country'
    }
  }

  return errors
}

function EmergencyContactForm({ onIntakeStepValidated }) {
  const { showError } = useIntakeToast()
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => validate(values), [values])
  const isValid = Object.keys(errors).length === 0

  const visibleErrors = useMemo(() => {
    const result = {}
    Object.keys(errors).forEach((key) => {
      if (submitted || touched[key]) {
        result[key] = errors[key]
      }
    })
    return result
  }, [errors, submitted, touched])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  const handleBlur = (event) => {
    const { name } = event.target
    setTouched((current) => ({ ...current, [name]: true }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)

    const nextErrors = validate(values)
    if (Object.keys(nextErrors).length === 0) {
      const relLabel =
        relationshipOptions.find((o) => o.value === values.emergencyContactRelationship)?.label ?? ''
      const digits = String(values.emergencyContactPhone).replace(/\D/g, '')
      onIntakeStepValidated?.(2, {
        emergencyContactName: values.emergencyContactName,
        emergencyContactPhoneDisplay: formatPhoneDisplay(values.phoneCountryCode, digits),
        emergencyContactAddress: values.emergencyContactAddress,
        emergencyContactRelationshipLabel: relLabel,
      })
    } else {
      const firstMessage = Object.values(nextErrors)[0]
      showError(typeof firstMessage === 'string' ? firstMessage : 'Please review the form.')
    }
  }

  return (
    <article className="w-full max-w-[668px] overflow-hidden rounded-ds-l border border-ds-border-base bg-ds-canvas-base shadow-[0px_0px_1px_rgba(19,19,21,0.04)]">
      <header className="border-b border-ds-border-base bg-ds-canvas-base px-ds-8 py-ds-5">
        <div className="flex flex-col gap-ds-2">
          <p className="text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-light">
            STEP 2 / 3
          </p>
          <h2 className="text-[18px] font-medium leading-6 tracking-[-0.54px] text-ds-text-dark">
            Emergency Contacts
          </h2>
        </div>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        <div className="border-b border-ds-border-base bg-ds-canvas-light p-ds-6">
          <div className="flex flex-col gap-ds-6 rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-6">
            <div className="grid grid-cols-1 gap-ds-6 sm:grid-cols-2">
              <Field
                name="emergencyContactName"
                label="Emergency contact name"
                required
                placeholder="Daisy Jacob"
                value={values.emergencyContactName}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="name"
                leftSlot={<UserIcon16 />}
                error={visibleErrors.emergencyContactName}
              />
              <PhoneField
                name="emergencyContactPhone"
                label="Emergency contact phone number"
                required
                placeholder="(555) 000 - 0000"
                nationalValue={values.emergencyContactPhone}
                onNationalChange={(digits) =>
                  setValues((c) => ({ ...c, emergencyContactPhone: digits }))
                }
                countryIso={values.phoneCountryCode}
                onCountryIsoChange={(iso) =>
                  setValues((c) => ({ ...c, phoneCountryCode: iso }))
                }
                onBlur={handleBlur}
                error={visibleErrors.emergencyContactPhone}
              />
            </div>

            <div className="grid grid-cols-1 gap-ds-6 sm:grid-cols-2">
              <Field
                name="emergencyContactAddress"
                label="Emergency contact address"
                required
                placeholder="12, abc road, alphabet avenue"
                value={values.emergencyContactAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="street-address"
                leftSlot={<MapPinIcon />}
                error={visibleErrors.emergencyContactAddress}
              />
              <SelectField
                name="emergencyContactRelationship"
                label="Emergency contact relationship"
                required
                placeholder="Select"
                value={values.emergencyContactRelationship}
                onChange={handleChange}
                onBlur={handleBlur}
                options={relationshipOptions}
                error={visibleErrors.emergencyContactRelationship}
              />
            </div>
          </div>
        </div>

        <footer className="flex justify-end gap-ds-5 bg-ds-canvas-base px-ds-8 pb-ds-8 pt-ds-6">
          <button
            type="button"
            className="flex h-10 items-center justify-center gap-ds-1 rounded-ds-full border border-ds-border-base bg-ds-button-gray px-ds-6 py-ds-5 text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark shadow-ds-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={`flex h-10 items-center justify-center rounded-ds-full px-4 py-[11px] text-[15px] font-medium leading-[23px] tracking-[-0.3px] transition ${
              isValid
                ? 'bg-ds-button-primary text-ds-text-white hover:opacity-95'
                : 'cursor-not-allowed bg-ds-button-primary-light text-ds-button-primary-disabled'
            }`}
          >
            Next step
          </button>
        </footer>
      </form>
    </article>
  )
}

function UserIcon16() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M3.5 13.5c1-2 3.5-3.5 4.5-3.5s3.5 1.5 4.5 3.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 14s4.5-3.2 4.5-7a4.5 4.5 0 10-9 0c0 3.8 4.5 7 4.5 7z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="7" r="1.25" fill="currentColor" />
    </svg>
  )
}

export default EmergencyContactForm
