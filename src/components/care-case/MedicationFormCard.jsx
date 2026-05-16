import Field from '../Field'
import SelectField from '../SelectField'
import {
  MEDICATION_DOSAGE_UNIT_OPTIONS,
  MEDICATION_DRUG_FORM_OPTIONS,
  MEDICATION_DRUG_MODE_OPTIONS,
  MEDICATION_FREQUENCY_COUNT_OPTIONS,
  MEDICATION_FREQUENCY_INTERVAL_OPTIONS,
  MEDICATION_SAMPLE_OPTIONS,
} from '../../data/clinicalProfileOptions'

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 4.5h8M6.5 4.5V3.5h3v1M6 6.5v5M8 6.5v5M10 6.5v5M4.5 6.5h7v6.5a1 1 0 01-1 1h-5a1 1 0 01-1-1V6.5z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function blurBoth(onRowBlur, onBlur) {
  onRowBlur?.()
  onBlur?.()
}

/**
 * Nested medication card — canvas-dark border, placeholders only, catalog select for drug.
 */
export default function MedicationFormCard({
  entry,
  index,
  fieldErrors = {},
  showErrors,
  onPatch,
  onRemove,
  onBlur,
  onRowBlur,
}) {
  const e = (name) => (showErrors ? fieldErrors[name] : undefined)

  const set = (partial) => onPatch(entry.id, partial)

  return (
    <div className="rounded-ds-m border border-solid border-ds-canvas-dark bg-ds-canvas-light px-ds-5 py-ds-5">
      <div className="flex flex-col gap-ds-3">
        <div className="grid grid-cols-1 gap-ds-3 sm:grid-cols-3">
          <SelectField
            name={`drugName-${entry.id}`}
            ariaLabel="Drug name"
            placeholder="Select medication"
            value={entry.drugName}
            onChange={(ev) => set({ drugName: ev.target.value })}
            onBlur={() => blurBoth(onRowBlur, onBlur)}
            options={MEDICATION_SAMPLE_OPTIONS}
            error={e('drugName')}
          />
          <Field
            name={`drugDosage-${entry.id}`}
            type="number"
            step="any"
            value={entry.drugDosage}
            onChange={(ev) => set({ drugDosage: ev.target.value })}
            onBlur={() => blurBoth(onRowBlur, onBlur)}
            placeholder="Dose #"
            ariaLabel="Dosage amount"
            error={e('drugDosage')}
          />
          <SelectField
            name={`dosageUnit-${entry.id}`}
            ariaLabel="Dosage unit"
            placeholder="Unit"
            value={entry.dosageUnit}
            onChange={(ev) => set({ dosageUnit: ev.target.value })}
            onBlur={() => blurBoth(onRowBlur, onBlur)}
            options={MEDICATION_DOSAGE_UNIT_OPTIONS}
            error={e('dosageUnit')}
          />
        </div>

        <div className="grid grid-cols-1 gap-ds-3 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField
            name={`drugForm-${entry.id}`}
            ariaLabel="Medication form"
            placeholder="Form"
            value={entry.drugForm}
            onChange={(ev) => set({ drugForm: ev.target.value })}
            onBlur={() => blurBoth(onRowBlur, onBlur)}
            options={MEDICATION_DRUG_FORM_OPTIONS}
            error={e('drugForm')}
          />
          <SelectField
            name={`drugMode-${entry.id}`}
            ariaLabel="Route of administration"
            placeholder="Route"
            value={entry.drugMode}
            onChange={(ev) => set({ drugMode: ev.target.value })}
            onBlur={() => blurBoth(onRowBlur, onBlur)}
            options={MEDICATION_DRUG_MODE_OPTIONS}
            error={e('drugMode')}
          />
          <SelectField
            name={`frequencyCount-${entry.id}`}
            ariaLabel="Dose frequency count"
            placeholder="Freq."
            value={entry.frequencyCount}
            onChange={(ev) => set({ frequencyCount: ev.target.value })}
            onBlur={() => blurBoth(onRowBlur, onBlur)}
            options={MEDICATION_FREQUENCY_COUNT_OPTIONS}
            error={e('frequencyCount')}
          />
          <SelectField
            name={`frequencyInterval-${entry.id}`}
            ariaLabel="Dose frequency interval"
            placeholder="Interval"
            value={entry.frequencyInterval}
            onChange={(ev) => set({ frequencyInterval: ev.target.value })}
            onBlur={() => blurBoth(onRowBlur, onBlur)}
            options={MEDICATION_FREQUENCY_INTERVAL_OPTIONS}
            error={e('frequencyInterval')}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onRemove(entry.id)}
            className="inline-flex items-center gap-ds-2 rounded-ds-m border border-ds-status-error bg-ds-canvas-base px-ds-3 py-ds-2 text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-status-error shadow-ds-sm hover:bg-red-50/60"
            aria-label={index >= 0 ? `Delete medication ${index + 1}` : 'Delete medication'}
          >
            <TrashIcon />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export function createEmptyMedicationEntry() {
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `med-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  return {
    id,
    drugName: '',
    drugDosage: '',
    dosageUnit: '',
    drugForm: '',
    drugMode: '',
    frequencyCount: '',
    frequencyInterval: '',
  }
}

export function validateMedicationEntry(row) {
  const fe = {}
  if (!String(row.drugName).trim()) fe.drugName = 'Required'
  if (row.drugDosage === '' || row.drugDosage === undefined) fe.drugDosage = 'Required'
  else if (Number(row.drugDosage) <= 0 || !Number.isFinite(Number(row.drugDosage))) fe.drugDosage = 'Must be greater than 0'
  if (!row.dosageUnit) fe.dosageUnit = 'Required'
  if (!row.drugForm) fe.drugForm = 'Required'
  if (!row.drugMode) fe.drugMode = 'Required'
  if (!row.frequencyCount) fe.frequencyCount = 'Required'
  if (!row.frequencyInterval) fe.frequencyInterval = 'Required'
  return fe
}
