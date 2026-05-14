import { useEffect, useMemo, useRef, useState } from 'react'
import DateField from './DateField'
import Field from './Field'
import PhoneField, { PHONE_COUNTRIES, validatePhoneNational } from './PhoneField'
import SelectField from './SelectField'

const initialValues = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  emailAddress: '',
  phoneCountryCode: 'US',
  phoneNumber: '',
  homeAddress: '',
  insuranceProvider: '',
  insuranceId: '',
}

const requiredLabels = {
  firstName: 'First name',
  lastName: 'Last name',
  dateOfBirth: 'Date of birth',
  gender: 'Gender',
  emailAddress: 'Email address',
  phoneNumber: 'Phone number',
  homeAddress: 'Home address',
  insuranceProvider: 'Insurance provider',
}

const genderOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not', label: 'Prefer not to say' },
]

const insuranceOptions = [
  { value: 'aetna', label: 'Aetna' },
  { value: 'united', label: 'UnitedHealthcare' },
  { value: 'bcbs', label: 'Blue Cross Blue Shield' },
  { value: 'cigna', label: 'Cigna' },
  { value: 'medicare', label: 'Medicare' },
]

function formatDobShort(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || ''
  const [y, m, d] = iso.split('-').map(Number)
  const yy = String(y % 100).padStart(2, '0')
  return `${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}/${yy}`
}

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

function validate(values, hasPhoto) {
  const errors = {}

  if (!hasPhoto) {
    errors.photo = 'Photo is required'
  }

  Object.entries(requiredLabels).forEach(([key, label]) => {
    if (!String(values[key]).trim()) {
      errors[key] = `${label} is required`
    }
  })

  const insuranceIdRaw = String(values.insuranceId ?? '')
  const insuranceIdLen = insuranceIdRaw.trim().length
  if (insuranceIdLen < 1) {
    errors.insuranceId = 'Insurance ID is required'
  } else if (insuranceIdLen > 8) {
    errors.insuranceId = 'Use at most 8 characters'
  }
  if (values.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailAddress)) {
    errors.emailAddress = 'Enter a valid email address'
  }

  if (values.phoneNumber) {
    const digits = String(values.phoneNumber).replace(/\D/g, '')
    if (!validatePhoneNational(values.phoneCountryCode || 'US', digits)) {
      errors.phoneNumber = 'Enter a valid number for the selected country'
    }
  }

  if (values.dateOfBirth) {
    const picked = new Date(`${values.dateOfBirth}T12:00:00`)
    const endToday = new Date()
    endToday.setHours(23, 59, 59, 999)
    if (Number.isNaN(picked.getTime())) {
      errors.dateOfBirth = 'Select a valid date'
    } else if (picked > endToday) {
      errors.dateOfBirth = 'Date cannot be in the future'
    }
  }

  return errors
}

function PatientForm({ onIntakeStepValidated }) {
  const fileInputRef = useRef(null)
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [photoTouched, setPhotoTouched] = useState(false)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const hasPhoto = Boolean(photoPreviewUrl)

  const errors = useMemo(() => validate(values, hasPhoto), [values, hasPhoto])
  const isValid = Object.keys(errors).length === 0

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl)
      }
    }
  }, [photoPreviewUrl])

  const visibleErrors = useMemo(() => {
    const result = {}
    Object.keys(errors).forEach((key) => {
      if (key === 'photo') {
        if (submitted || photoTouched) {
          result.photo = errors.photo
        }
        return
      }
      if (submitted || touched[key]) {
        result[key] = errors[key]
      }
    })
    return result
  }, [errors, submitted, touched, photoTouched])

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
    setPhotoTouched(true)

    if (Object.keys(validate(values, hasPhoto)).length === 0) {
      const insuranceLabel =
        insuranceOptions.find((o) => o.value === values.insuranceProvider)?.label ?? ''
      const digits = String(values.phoneNumber).replace(/\D/g, '')
      onIntakeStepValidated?.(1, {
        patientDisplayName: `${values.firstName} ${values.lastName}`.trim(),
        emailAddress: values.emailAddress,
        homeAddress: values.homeAddress,
        phoneDisplay: formatPhoneDisplay(values.phoneCountryCode, digits),
        dateOfBirthDisplay: formatDobShort(values.dateOfBirth),
        insuranceProviderLabel: insuranceLabel,
        insuranceId: values.insuranceId,
      })
    }
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    setPhotoTouched(true)
    if (!file) return

    setPhotoPreviewUrl(URL.createObjectURL(file))
  }

  const handleDeletePhoto = () => {
    setPhotoTouched(true)
    setPhotoPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <article className="w-full max-w-[668px] overflow-hidden rounded-ds-l border border-ds-border-base bg-ds-canvas-base shadow-[0px_0px_1px_rgba(19,19,21,0.04)]">
      {/* Header — canvas-base */}
      <header className="border-b border-ds-border-base bg-ds-canvas-base px-ds-8 py-ds-5">
        <div className="flex flex-col gap-ds-2">
          <p className="text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-light">
            STEP 1 / 3
          </p>
          <h2 className="text-[18px] font-medium leading-6 tracking-[-0.54px] text-ds-text-dark">
            Patient Identity
          </h2>
        </div>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        {/* Middle — canvas-light + nested form card */}
        <div className="border-b border-ds-border-base bg-ds-canvas-light p-ds-6">
          <div className="flex flex-col gap-ds-6 rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-6">
            {/* Photo + upload */}
            <div className="flex flex-col gap-ds-2">
              <div className="flex flex-wrap items-end gap-ds-6">
                <div
                  className="relative flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-ds-s border-[0.791px] border-ds-border-base bg-ds-canvas-dark"
                  aria-label={hasPhoto ? 'Profile photo preview' : 'Profile photo placeholder'}
                >
                  {hasPhoto ? (
                    <img
                      src={photoPreviewUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserAvatarPlaceholderIcon className="text-ds-icon-base" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-ds-5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    tabIndex={-1}
                    onChange={handlePhotoChange}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoTouched(true)
                      fileInputRef.current?.click()
                    }}
                    className="flex h-10 items-center justify-center gap-ds-1 rounded-ds-full border border-ds-border-base bg-ds-button-gray px-ds-6 py-ds-5 text-[15px] font-medium leading-[23px] tracking-[-0.15px] text-ds-text-dark shadow-ds-sm"
                  >
                    Upload
                  </button>
                  {hasPhoto ? (
                    <button
                      type="button"
                      onClick={handleDeletePhoto}
                      className="relative flex h-10 items-center justify-center overflow-hidden rounded-ds-full border border-[rgba(62,4,4,0.5)] bg-ds-status-error px-ds-6 py-ds-5 text-[15px] font-medium leading-[23px] tracking-[-0.15px] text-ds-text-white shadow-[inset_0px_0px_1px_2px_rgba(255,255,255,0.22)]"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
              {visibleErrors.photo ? (
                <p className="text-[12px] leading-[18px] text-ds-status-error">{visibleErrors.photo}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-ds-6 sm:grid-cols-2">
              <Field
                name="firstName"
                label="First name"
                required
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Jane"
                autoComplete="given-name"
                leftSlot={<UserIcon16 />}
                error={visibleErrors.firstName}
              />
              <Field
                name="lastName"
                label="Last name"
                required
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Kelvin"
                autoComplete="family-name"
                leftSlot={<UserIcon16 />}
                error={visibleErrors.lastName}
              />
            </div>

            <div className="grid grid-cols-1 gap-ds-6 sm:grid-cols-2">
              <DateField
                name="dateOfBirth"
                label="Date of birth"
                required
                value={values.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                error={visibleErrors.dateOfBirth}
              />
              <SelectField
                name="gender"
                label="Gender"
                required
                placeholder="Select"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                options={genderOptions}
                error={visibleErrors.gender}
              />
            </div>

            <div className="grid grid-cols-1 gap-ds-6 sm:grid-cols-2">
              <Field
                name="emailAddress"
                label="Email address"
                required
                type="email"
                placeholder="Enter email"
                value={values.emailAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
                leftSlot={<MailIcon />}
                error={visibleErrors.emailAddress}
              />
              <PhoneField
                name="phoneNumber"
                label="Phone number"
                required
                placeholder="(555) 000 - 0000"
                nationalValue={values.phoneNumber}
                onNationalChange={(digits) =>
                  setValues((c) => ({ ...c, phoneNumber: digits }))
                }
                countryIso={values.phoneCountryCode}
                onCountryIsoChange={(iso) =>
                  setValues((c) => ({ ...c, phoneCountryCode: iso }))
                }
                onBlur={handleBlur}
                error={visibleErrors.phoneNumber}
              />
            </div>

            <Field
              name="homeAddress"
              label="Home address"
              required
              placeholder="12, abc road, alphabet avenue"
              value={values.homeAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="street-address"
              leftSlot={<MapPinIcon />}
              error={visibleErrors.homeAddress}
            />

            <div className="h-px w-full bg-ds-border-base" aria-hidden />

            <div className="grid grid-cols-1 gap-ds-6 sm:grid-cols-2">
              <SelectField
                name="insuranceProvider"
                label="Insurance provider"
                required
                placeholder="Select"
                value={values.insuranceProvider}
                onChange={handleChange}
                onBlur={handleBlur}
                options={insuranceOptions}
                error={visibleErrors.insuranceProvider}
              />
              <Field
                name="insuranceId"
                label="Insurance ID"
                required
                placeholder="1234ABC"
                value={values.insuranceId}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
                maxLength={8}
                leftSlot={<InsuranceCardIcon />}
                error={visibleErrors.insuranceId}
              />
            </div>
          </div>
        </div>

        {/* Footer — canvas-base */}
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

function UserAvatarPlaceholderIcon({ className }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
    >
      <path
        d="M16 16a5 5 0 100-10 5 5 0 000 10z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 26c1.5-4 6.5-6 9-6s7.5 2 9 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
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

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2.5 4.5h11v7h-11v-7z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 5.5l5.5 4 5.5-4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
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

function InsuranceCardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M2 7h12" stroke="currentColor" strokeWidth="1.25" />
      <rect x="4" y="9" width="4" height="1.25" rx="0.25" fill="currentColor" />
    </svg>
  )
}

export default PatientForm
