import SelectField from '../SelectField'
import { CARE_STAFF_EXPERIENCE_OPTIONS, CARE_STAFF_ROLE_OPTIONS } from '../../data/clinicalProfileOptions'

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

export function createEmptyStaffEntry() {
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `staff-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  return { id, roleType: '', experience: '' }
}

export function validateStaffEntry(row) {
  const fe = {}
  if (!row.roleType) fe.roleType = 'Required'
  if (!row.experience) fe.experience = 'Required'
  return fe
}

export default function CareStaffFormCard({ entry, fieldErrors, showErrors, onPatch, onRemove, onBlur }) {
  const e = (k) => (showErrors ? fieldErrors[k] : undefined)

  return (
    <div className="rounded-ds-m border border-solid border-ds-canvas-dark bg-ds-canvas-light px-ds-5 py-ds-5">
      <div className="grid grid-cols-1 items-end gap-ds-3 sm:grid-cols-[1fr_1fr_auto]">
        <SelectField
          name={`role-${entry.id}`}
          ariaLabel="Staff role type"
          placeholder="Role type"
          value={entry.roleType}
          onChange={(ev) => onPatch(entry.id, { roleType: ev.target.value })}
          onBlur={() => onBlur?.()}
          options={CARE_STAFF_ROLE_OPTIONS}
          error={e('roleType')}
        />
        <SelectField
          name={`exp-${entry.id}`}
          ariaLabel="Years of experience"
          placeholder="Experience"
          value={entry.experience}
          onChange={(ev) => onPatch(entry.id, { experience: ev.target.value })}
          onBlur={() => onBlur?.()}
          options={CARE_STAFF_EXPERIENCE_OPTIONS}
          error={e('experience')}
        />
        <div className="flex justify-end sm:pb-[2px]">
          <button
            type="button"
            onClick={() => onRemove(entry.id)}
            className="inline-flex items-center gap-ds-2 rounded-ds-m border border-ds-status-error bg-ds-canvas-base px-ds-3 py-ds-2 text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-status-error shadow-ds-sm hover:bg-red-50/60"
            aria-label="Delete care staff requirement"
          >
            <TrashIcon />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
