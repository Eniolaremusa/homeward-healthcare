import { useNavigate } from 'react-router-dom'
import CareTypeTag from '../client-details/CareTypeTag'
import CareCaseStepFooter from './CareCaseStepFooter'
import LayeredSectionCard from './LayeredSectionCard'
import TaskCard from './TaskCard'
import {
  CARE_STAFF_EXPERIENCE_OPTIONS,
  CARE_STAFF_ROLE_OPTIONS,
  EQUIPMENT_OPTIONS,
  MEDICATION_FREQUENCY_INTERVAL_OPTIONS,
  PREFERRED_VISIT_TIME_OPTIONS,
  PHYSICIAN_OPTIONS,
  RISK_LEVEL_OPTIONS,
  VISIT_DURATION_UNIT_OPTIONS,
  VISIT_FREQUENCY_OPTIONS,
} from '../../data/clinicalProfileOptions'

function labelFor(options, value) {
  return options.find((o) => o.value === value)?.label ?? value ?? '—'
}

function formatIsoDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = String(iso).split('-')
  if (!y || !m || !d) return iso
  return `${m}/${d}/${y}`
}

function formatMedicationFrequency(m) {
  if (!m?.frequencyCount || !m?.frequencyInterval) return '—'
  const intl =
    MEDICATION_FREQUENCY_INTERVAL_OPTIONS.find((o) => o.value === m.frequencyInterval)?.label ?? m.frequencyInterval
  return `${m.frequencyCount}× ${intl}`
}

/** Label + value block — no borders; spacing comes from parent layout. */
function PreviewField({ label, children, className = '' }) {
  return (
    <div className={`flex min-w-0 flex-col gap-ds-1 ${className}`.trim()}>
      <p className="text-[11px] font-semibold uppercase leading-[16px] tracking-[0.06em] text-ds-text-base">{label}</p>
      <div className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">{children}</div>
    </div>
  )
}

/**
 * Final care case step — read-only summary of clinical profile, care plan, and tasks.
 */
export default function PreviewStep({ clinical, carePlan, tasks, onPrevious, onCancel }) {
  const navigate = useNavigate()

  const physicianName = labelFor(PHYSICIAN_OPTIONS, clinical?.physicianId)
  const riskLabel = labelFor(RISK_LEVEL_OPTIONS, clinical?.riskLevel)
  const equipmentLabel = labelFor(EQUIPMENT_OPTIONS, clinical?.equipment)
  const visitFreqLabel = labelFor(VISIT_FREQUENCY_OPTIONS, carePlan?.visitFrequency)
  const preferredLabel = labelFor(PREFERRED_VISIT_TIME_OPTIONS, carePlan?.preferredVisitTime)
  const durationUnitLabel = labelFor(VISIT_DURATION_UNIT_OPTIONS, carePlan?.visitDurationUnit)
  const visitDurationText =
    carePlan?.visitDurationAmount !== '' && carePlan?.visitDurationAmount != null
      ? `${carePlan.visitDurationAmount} ${durationUnitLabel}`
      : '—'

  const handleConfirm = () => {
    navigate('/scheduling/map', {
      state: { careCaseSuccessMessage: 'You successfully created your care case.' },
    })
  }

  const allergiesText = clinical?.allergies?.length ? clinical.allergies.join(', ') : '—'

  return (
    <article className="w-full min-w-0 overflow-hidden rounded-ds-l border border-ds-border-base bg-ds-canvas-base shadow-[0px_0px_1px_rgba(19,19,21,0.04)]">
      <header className="border-b border-ds-border-base bg-ds-canvas-base px-ds-8 py-ds-5">
        <p className="text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-light">STEP 4 / 4</p>
        <h2 className="text-[18px] font-medium leading-6 tracking-[-0.54px] text-ds-text-dark">Preview</h2>
      </header>

      <div className="border-b border-ds-border-base bg-ds-canvas-light p-ds-6">
        <div className="flex flex-col gap-ds-5">
          <LayeredSectionCard title="Clinical profile">
            <div className="flex flex-col gap-ds-6">
              <div className="grid grid-cols-1 gap-x-ds-8 gap-y-ds-5 md:grid-cols-2">
                <PreviewField label="Attending physician">{physicianName}</PreviewField>
                <PreviewField label="Risk level">{riskLabel}</PreviewField>
              </div>

              <div className="grid grid-cols-1 gap-x-ds-8 gap-y-ds-5 md:grid-cols-2">
                <PreviewField label="Care type">
                  {clinical?.careTypes?.length ? (
                    <div className="flex flex-wrap gap-ds-2">
                      {clinical.careTypes.map((ct) => (
                        <CareTypeTag key={ct} label={ct} styleKey={ct} />
                      ))}
                    </div>
                  ) : (
                    '—'
                  )}
                </PreviewField>
                <PreviewField label="Allergies">{allergiesText}</PreviewField>
              </div>

              <PreviewField label="Diagnosis">
                <p className="whitespace-pre-wrap">{clinical?.diagnosis?.trim() || '—'}</p>
              </PreviewField>

              <PreviewField label="Current medication">
                {clinical?.medications?.length ? (
                  <div className="mt-ds-1 flex flex-col gap-ds-3">
                    {clinical.medications.map((m) => (
                      <div
                        key={m.id}
                        className="rounded-ds-m border border-solid border-ds-canvas-dark bg-ds-canvas-light px-ds-4 py-ds-3"
                      >
                        <p className="text-[13px] font-medium leading-[21px] text-ds-text-dark">{m.drugName || '—'}</p>
                        <p className="mt-ds-1 text-[12px] leading-[18px] text-ds-text-base">
                          Dosage:{' '}
                          {m.drugDosage != null && m.drugDosage !== ''
                            ? `${m.drugDosage} ${m.dosageUnit || ''}`.trim()
                            : '—'}
                        </p>
                        <p className="text-[12px] leading-[18px] text-ds-text-base">
                          Frequency: {formatMedicationFrequency(m)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  '—'
                )}
              </PreviewField>

              <PreviewField label="Equipment required at home">{equipmentLabel}</PreviewField>
            </div>
          </LayeredSectionCard>

          <LayeredSectionCard title="Care plan">
            <div className="flex flex-col gap-ds-6">
              <div className="grid grid-cols-1 gap-x-ds-8 gap-y-ds-5 md:grid-cols-2">
                <PreviewField label="Care start date">{formatIsoDate(carePlan?.careStartDate)}</PreviewField>
                <PreviewField label="Visit frequency">{visitFreqLabel}</PreviewField>
              </div>

              <div className="grid grid-cols-1 gap-x-ds-8 gap-y-ds-5 md:grid-cols-2">
                <PreviewField label="Preferred visit time">{preferredLabel}</PreviewField>
                <PreviewField label="Visit duration">{visitDurationText}</PreviewField>
              </div>

              <PreviewField label="Specific care needs">
                <p className="whitespace-pre-wrap">{carePlan?.specificCareNeeds?.trim() || '—'}</p>
              </PreviewField>
            </div>
          </LayeredSectionCard>

          <LayeredSectionCard title="Care staff requirements">
            {carePlan?.staffRequirements?.length ? (
              <div className="grid grid-cols-1 gap-ds-4 sm:grid-cols-2">
                {carePlan.staffRequirements.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-ds-m border border-solid border-ds-canvas-dark bg-ds-canvas-light px-ds-4 py-ds-3"
                  >
                    <p className="text-[13px] font-medium text-ds-text-dark">
                      {labelFor(CARE_STAFF_ROLE_OPTIONS, s.roleType)}
                    </p>
                    <p className="mt-ds-1 text-[12px] leading-[18px] text-ds-text-base">
                      Years of experience: {labelFor(CARE_STAFF_EXPERIENCE_OPTIONS, s.experience)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] font-medium leading-[21px] text-ds-text-dark">—</p>
            )}
          </LayeredSectionCard>

          <LayeredSectionCard title="Tasks">
            {tasks?.length ? (
              <div className="flex flex-col gap-[20px]">
                {tasks.map((t) => (
                  <TaskCard key={t.id} task={t} variant="preview" />
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-ds-text-base">No tasks added.</p>
            )}
          </LayeredSectionCard>
        </div>
      </div>

      <CareCaseStepFooter
        showPrevious
        onPrevious={onPrevious}
        onCancel={onCancel}
        submitType="button"
        submitDisabled={false}
        submitLabel="Confirm Case"
        onSubmitClick={handleConfirm}
      />
    </article>
  )
}
