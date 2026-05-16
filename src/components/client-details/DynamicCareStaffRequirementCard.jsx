import ClientDetailSectionCard from './ClientDetailSectionCard'
import SectionCardTitle from './SectionCardTitle'
import { STAFF_ROLES } from '../../schedule/mockStaffData'

function RemoveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="text-ds-icon-base">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

export default function DynamicCareStaffRequirementCard({ selectedStaff, onRemoveStaff }) {
  const empty = !selectedStaff?.length

  return (
    <ClientDetailSectionCard className="gap-ds-2 leading-[21px] text-ds-text-base">
      <SectionCardTitle>Care staff requirement</SectionCardTitle>
      {empty ? (
        <p className="text-center text-[13px] font-medium tracking-[-0.26px] text-ds-text-base">{`Selected staff will appear here. `}</p>
      ) : (
        <ul className="flex flex-col gap-ds-2">
          {selectedStaff.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-ds-3 rounded-ds-s bg-ds-canvas-base px-ds-5 py-ds-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium tracking-[-0.26px] text-ds-text-dark">{s.fullName}</p>
                <p className="text-[12px] font-medium leading-[18px] tracking-[-0.12px] text-ds-text-base">
                  {STAFF_ROLES[s.roleKey]}
                  <span className="text-ds-text-light"> · Selected</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveStaff?.(s.id)}
                className="flex size-8 shrink-0 items-center justify-center rounded-ds-s border border-ds-border-base bg-ds-canvas-base text-ds-text-dark outline-none transition hover:bg-ds-canvas-light focus-visible:ring-2 focus-visible:ring-ds-button-primary/25"
                aria-label={`Remove ${s.fullName} from care staff`}
              >
                <RemoveIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </ClientDetailSectionCard>
  )
}
