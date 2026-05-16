import { TASK_DURATION_OPTIONS, TASK_FREQUENCY_OPTIONS } from '../../data/clinicalProfileOptions'

function labelFor(options, value) {
  return options.find((o) => o.value === value)?.label ?? value
}

function formatDateDisplay(iso) {
  if (!iso) return '—'
  const [y, m, d] = String(iso).split('-')
  if (!y || !m || !d) return iso
  return `${m}/${d}/${y}`
}

function IconReload({ className = 'size-[14px] shrink-0 text-ds-icon-base' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13.65 8A5.65 5.65 0 008 2.35V1M8 1l1.75 1.75M8 1L6.25 2.75M2.35 8A5.65 5.65 0 008 13.65V15M8 15l-1.75-1.75M8 15l1.75-1.75"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconClock({ className = 'size-[14px] shrink-0 text-ds-icon-base' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.1" />
      <path d="M8 5.2V8l2.2 1.3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function IconCalendar({ className = 'size-[14px] shrink-0 text-ds-icon-base' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2.5" y="3.25" width="11" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M2.5 6.25h11M5.25 2v2.25M10.75 2v2.25" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function TaskMetaTag({ icon, children }) {
  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-ds-2 rounded-ds-s border border-ds-border-base bg-ds-canvas-dark px-ds-3 py-ds-1">
      {icon}
      <span className="min-w-0 truncate text-[12px] font-medium leading-[18px] tracking-[-0.12px] text-ds-text-dark">
        {children}
      </span>
    </span>
  )
}

/**
 * Task summary card: top = title + description; bottom = frequency / duration / start / end tags.
 * @param {'form' | 'preview'} [props.variant] — `form` shows Edit/Delete; `preview` is read-only.
 */
export default function TaskCard({ task, onEdit, onDelete, variant = 'form' }) {
  const isPreview = variant === 'preview'
  const startRaw = task.startDate || task.visitTime
  const endRaw = String(task.endDate ?? '').trim()
  const endLabel = endRaw ? formatDateDisplay(endRaw) : 'Ongoing'
  const durationLabel = labelFor(TASK_DURATION_OPTIONS, task.duration)
  const frequencyLabel = labelFor(TASK_FREQUENCY_OPTIONS, task.frequency)

  const tagRow = (
    <div className="mt-ds-4 flex flex-wrap gap-ds-2 border-t border-ds-border-base pt-ds-4">
      <TaskMetaTag icon={<IconReload />}>{frequencyLabel}</TaskMetaTag>
      <TaskMetaTag icon={<IconClock />}>{durationLabel}</TaskMetaTag>
      <TaskMetaTag icon={<IconCalendar />}>{formatDateDisplay(startRaw)}</TaskMetaTag>
      <TaskMetaTag icon={<IconCalendar />}>{endLabel}</TaskMetaTag>
    </div>
  )

  return (
    <article className="rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-5 shadow-ds-sm">
      <div className="flex flex-wrap items-start justify-between gap-ds-4">
        <div className="flex min-w-0 flex-1 flex-col gap-ds-1">
          <p className="text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark">{task.name}</p>
          <p className="text-[13px] font-normal leading-[21px] tracking-[-0.26px] text-ds-text-dark">{task.notes}</p>
        </div>
        {!isPreview && (onEdit || onDelete) ? (
          <div className="flex shrink-0 gap-ds-2">
            {onEdit ? (
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="rounded-ds-full border border-ds-border-base bg-ds-button-gray px-ds-4 py-ds-2 text-[13px] font-medium text-ds-text-dark shadow-ds-sm hover:bg-ds-canvas-light"
              >
                Edit
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="rounded-ds-full border border-ds-border-base bg-ds-button-gray px-ds-4 py-ds-2 text-[13px] font-medium text-ds-status-error shadow-ds-sm hover:bg-ds-canvas-light"
              >
                Delete
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      {tagRow}
    </article>
  )
}
