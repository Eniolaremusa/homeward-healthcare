import { useEffect, useMemo, useRef, useState } from 'react'
import SelectField from './SelectField'

const initialValues = {
  nurseGenderPreference: '',
  languagePreference: '',
  communicationPreference: '',
  livingSituation: '',
}

const requiredKeys = [
  'nurseGenderPreference',
  'languagePreference',
  'communicationPreference',
  'livingSituation',
]

const nurseGenderOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'no_preference', label: 'No preference' },
]

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'other', label: 'Other' },
]

const communicationOptions = [
  { value: 'emails_only', label: 'Emails only' },
  { value: 'calls_only', label: 'Phone calls only' },
  { value: 'both', label: 'Email and phone' },
]

const livingOptions = [
  { value: 'spouse_no_kids', label: 'Lives with spouse - no kids' },
  { value: 'spouse_kids', label: 'Lives with spouse and kids' },
  { value: 'alone', label: 'Lives alone' },
  { value: 'family', label: 'Lives with family' },
  { value: 'roommate', label: 'Lives with roommate(s)' },
]

const PET_OPTIONS = ['Dogs', 'Cats', 'Birds', 'Other']

function labelFromOptions(options, value) {
  return options.find((o) => o.value === value)?.label ?? value
}

function validate(values, petTags) {
  const errors = {}
  requiredKeys.forEach((key) => {
    const labels = {
      nurseGenderPreference: 'Nurse gender preference',
      languagePreference: 'Language preference',
      communicationPreference: 'Communication preference',
      livingSituation: 'Living situation',
    }
    if (!String(values[key]).trim()) {
      errors[key] = `${labels[key]} is required`
    }
  })
  if (!petTags.length) {
    errors.petSituation = 'Select at least one pet situation'
  }
  return errors
}

function CarePreferencesForm({ onWorkflowComplete }) {
  const [values, setValues] = useState(initialValues)
  const [petTags, setPetTags] = useState([])
  const [petMenuOpen, setPetMenuOpen] = useState(false)
  const [touched, setTouched] = useState({})
  const [petTouched, setPetTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const petMenuRef = useRef(null)

  const errors = useMemo(() => validate(values, petTags), [values, petTags])
  const isValid = Object.keys(errors).length === 0

  const visibleErrors = useMemo(() => {
    const result = {}
    Object.keys(errors).forEach((key) => {
      if (key === 'petSituation') {
        if (submitted || petTouched) result.petSituation = errors.petSituation
        return
      }
      if (submitted || touched[key]) result[key] = errors[key]
    })
    return result
  }, [errors, submitted, touched, petTouched])

  const availablePets = PET_OPTIONS.filter((p) => !petTags.includes(p))

  useEffect(() => {
    if (!petMenuOpen) return
    function handleDown(event) {
      if (petMenuRef.current && !petMenuRef.current.contains(event.target)) {
        setPetMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleDown)
    return () => document.removeEventListener('mousedown', handleDown)
  }, [petMenuOpen])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((c) => ({ ...c, [name]: value }))
  }

  const handleBlur = (event) => {
    const { name } = event.target
    setTouched((c) => ({ ...c, [name]: true }))
  }

  const addPet = (pet) => {
    setPetTouched(true)
    setPetTags((tags) => (tags.includes(pet) ? tags : [...tags, pet]))
    setPetMenuOpen(false)
  }

  const removePet = (pet) => {
    setPetTouched(true)
    setPetTags((tags) => tags.filter((t) => t !== pet))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    setPetTouched(true)

    if (Object.keys(validate(values, petTags)).length === 0) {
      onWorkflowComplete?.({
        nurseGenderPreferenceLabel: labelFromOptions(nurseGenderOptions, values.nurseGenderPreference),
        languagePreferenceLabel: labelFromOptions(languageOptions, values.languagePreference),
        communicationPreferenceLabel: labelFromOptions(communicationOptions, values.communicationPreference),
        livingSituationLabel: labelFromOptions(livingOptions, values.livingSituation),
        petSituationLabels: [...petTags],
        petSituationDisplay: petTags.join(', '),
      })
    }
  }

  return (
    <article className="w-full max-w-[668px] overflow-hidden rounded-ds-l border border-ds-border-base bg-ds-canvas-base shadow-[0px_0px_1px_rgba(19,19,21,0.04)]">
      <header className="border-b border-ds-border-base bg-ds-canvas-base px-ds-8 py-ds-5">
        <div className="flex flex-col gap-ds-2">
          <p className="text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-light">
            STEP 3 / 3
          </p>
          <h2 className="text-[18px] font-medium leading-6 tracking-[-0.54px] text-ds-text-dark">
            Care Preferences
          </h2>
        </div>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        <div className="border-b border-ds-border-base bg-ds-canvas-light p-ds-6">
          <div className="flex flex-col gap-ds-6 rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-6">
            <div className="grid grid-cols-1 gap-ds-6 sm:grid-cols-2">
              <SelectField
                name="nurseGenderPreference"
                label="Nurse gender preference"
                required
                placeholder="Select"
                value={values.nurseGenderPreference}
                onChange={handleChange}
                onBlur={handleBlur}
                options={nurseGenderOptions}
                error={visibleErrors.nurseGenderPreference}
              />
              <SelectField
                name="languagePreference"
                label="Language preference"
                required
                placeholder="Select"
                value={values.languagePreference}
                onChange={handleChange}
                onBlur={handleBlur}
                options={languageOptions}
                error={visibleErrors.languagePreference}
              />
            </div>

            <div className="grid grid-cols-1 gap-ds-6 sm:grid-cols-2">
              <SelectField
                name="communicationPreference"
                label="Communication preference"
                required
                placeholder="Select"
                value={values.communicationPreference}
                onChange={handleChange}
                onBlur={handleBlur}
                options={communicationOptions}
                error={visibleErrors.communicationPreference}
              />

              <div ref={petMenuRef} className="relative flex flex-col gap-ds-1">
                <span className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">
                  Pet situation *
                </span>
                <div
                  className={`flex min-h-10 w-full items-stretch gap-ds-2 overflow-hidden rounded-ds-m border border-ds-border-base bg-ds-canvas-base shadow-ds-sm ${
                    visibleErrors.petSituation ? 'ring-1 ring-ds-status-error' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setPetTouched(true)
                      if (availablePets.length) setPetMenuOpen((o) => !o)
                    }}
                    className="flex min-h-10 min-w-0 flex-1 items-center gap-ds-2 px-ds-5 py-ds-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ds-button-primary/25"
                  >
                    <div className="flex min-h-[22px] flex-1 flex-wrap items-center gap-ds-2">
                      {petTags.map((tag) => (
                        <span
                          key={tag}
                          role="presentation"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-ds-1 rounded-ds-s bg-ds-canvas-dark px-ds-3 py-ds-1"
                        >
                          <span className="text-[12px] font-medium leading-[18px] tracking-[-0.12px] text-ds-text-dark">
                            {tag}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removePet(tag)
                            }}
                            className="flex size-[10px] items-center justify-center text-ds-text-dark hover:opacity-70"
                            aria-label={`Remove ${tag}`}
                          >
                            <CloseTinyIcon />
                          </button>
                        </span>
                      ))}
                      {petTags.length === 0 ? (
                        <span className="text-[13px] font-normal leading-[21px] tracking-[-0.26px] text-ds-text-base">
                          Select
                        </span>
                      ) : null}
                    </div>
                    <span className="pointer-events-none shrink-0 self-center text-ds-icon-base">
                      <ChevronDown16 />
                    </span>
                  </button>
                </div>
                {petMenuOpen && availablePets.length > 0 ? (
                  <ul className="absolute left-0 top-full z-40 mt-1 w-full rounded-ds-m border border-ds-border-base bg-ds-canvas-base py-ds-2 shadow-ds-sm">
                    {availablePets.map((pet) => (
                      <li key={pet}>
                        <button
                          type="button"
                          className="w-full px-ds-4 py-ds-3 text-left text-[13px] leading-[21px] text-ds-text-dark hover:bg-ds-canvas-light"
                          onClick={() => addPet(pet)}
                        >
                          {pet}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {visibleErrors.petSituation ? (
                  <p className="text-[12px] leading-[18px] text-ds-status-error">{visibleErrors.petSituation}</p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-ds-6 sm:grid-cols-2">
              <SelectField
                name="livingSituation"
                label="Living situation"
                required
                placeholder="Select"
                value={values.livingSituation}
                onChange={handleChange}
                onBlur={handleBlur}
                options={livingOptions}
                error={visibleErrors.livingSituation}
              />
              <div aria-hidden className="hidden sm:block" />
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
            className={`relative flex h-10 items-center justify-center overflow-hidden rounded-ds-full px-4 py-[11px] text-[15px] font-medium leading-[23px] tracking-[-0.3px] transition ${
              isValid
                ? 'border border-[rgba(56,0,18,0.5)] bg-ds-button-primary text-ds-text-white shadow-[inset_0px_0px_1px_2px_rgba(255,255,255,0.22)] hover:opacity-95'
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

function ChevronDown16() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseTinyIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

export default CarePreferencesForm
