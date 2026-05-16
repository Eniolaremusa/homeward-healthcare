import CareTypeTag from './CareTypeTag'
import ClientDetailInfoField from './ClientDetailInfoField'
import ClientDetailSectionCard from './ClientDetailSectionCard'
import DynamicCareStaffRequirementCard from './DynamicCareStaffRequirementCard'
import SectionCardTitle from './SectionCardTitle'
import PersonAvatar from '../PersonAvatar'
import ZoneTag from '../ZoneTag'
import { careTypeDisplayLabel } from '../../schedule/careNeedsPicker'
import { normalizeZoneKey } from '../../utils/mapIntakeSummaryToClientDetails'

/**
 * Left column client details — outer white card + stacked inner section cards (Figma 610:63915).
 * @param {string[]} [props.careTypes] — when set (e.g. scheduling), overrides `intake.careTypes`.
 * @param {'default' | 'careCase'} [props.variant] — care case omits care-needs + scheduling staff cards only.
 */
export default function ClientDetailsPanel({
  intake,
  careTypes: careTypesProp,
  selectedStaff,
  onRemoveStaff,
  variant = 'default',
  className = '',
}) {
  const { personal, emergency, preferences, careTypes: careTypesOnIntake } = intake
  const careTypesList = careTypesProp ?? careTypesOnIntake ?? []

  return (
    <aside
      className={`flex w-full min-w-0 flex-col gap-ds-5 rounded-ds-l border border-ds-border-base bg-ds-canvas-base p-[16px] shadow-[0px_0px_2px_1px_rgba(19,19,21,0.04)] ${className}`}
    >
      <div className="flex w-full items-center gap-ds-5">
        {intake.avatarSrc ? (
          <div className="relative size-16 shrink-0 overflow-hidden rounded-ds-s border border-ds-border-base bg-ds-canvas-base">
            <img src={intake.avatarSrc} alt="" className="size-full object-cover" width={64} height={64} />
          </div>
        ) : (
          <PersonAvatar name={intake.displayName} size="md" />
        )}
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[2.5px]">
          <ZoneTag zone={normalizeZoneKey(intake.zone ?? intake.zoneLabel)} />
          <p className="w-full text-left text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark">
            {intake.displayName}
            {['M', 'F'].includes(intake.genderLetter) ? ` (${intake.genderLetter})` : ''}
          </p>
          <p className="w-full text-left text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-base">
            {intake.email}
          </p>
        </div>
      </div>

      {variant === 'default' && careTypesList.length > 0 ? (
        <ClientDetailSectionCard className="gap-ds-2">
          <SectionCardTitle>Care needs</SectionCardTitle>
          <div className="flex flex-wrap items-center gap-[5px]">
            {careTypesList.map((need) => (
              <CareTypeTag key={need} label={careTypeDisplayLabel(need)} styleKey={need} />
            ))}
          </div>
        </ClientDetailSectionCard>
      ) : null}

      <ClientDetailSectionCard className="gap-ds-5 text-[13px] font-medium leading-[21px] tracking-[-0.26px]">
        <ClientDetailInfoField label="Address:" value={personal.address} />
        <div className="flex w-full gap-ds-5">
          <ClientDetailInfoField label="Phone Number" value={personal.phone} />
          <ClientDetailInfoField label="Date of Birth" value={personal.dateOfBirth} />
        </div>
        <div className="flex w-full gap-ds-5">
          <ClientDetailInfoField label="Insurance Provider" value={personal.insuranceProvider} />
          <ClientDetailInfoField label="Insurance Number" value={personal.insuranceNumber} />
        </div>
      </ClientDetailSectionCard>

      <ClientDetailSectionCard className="gap-ds-2">
        <SectionCardTitle>Emergency contact</SectionCardTitle>
        <div className="flex flex-col gap-ds-5 text-[13px] font-medium leading-[21px] tracking-[-0.26px]">
          <div className="flex w-full gap-ds-5">
            <ClientDetailInfoField label="Name" value={emergency.name} />
            <ClientDetailInfoField label="Phone number" value={emergency.phone} />
          </div>
          <div className="flex w-full gap-ds-5">
            <ClientDetailInfoField label="Address" value={emergency.address} />
            <ClientDetailInfoField label="Relationship" value={emergency.relationship} />
          </div>
        </div>
      </ClientDetailSectionCard>

      <ClientDetailSectionCard className="gap-ds-5 text-[13px] font-medium leading-[21px] tracking-[-0.26px]">
        <div className="flex w-full gap-ds-5">
          <ClientDetailInfoField label="Nurse preference:" value={preferences.nurseGender} />
          <ClientDetailInfoField label="Language:" value={preferences.language} />
        </div>
        <div className="flex w-full gap-ds-5">
          <ClientDetailInfoField label="Communication :" value={preferences.communication} />
          <ClientDetailInfoField label="Living Situation" value={preferences.livingSituation} />
        </div>
      </ClientDetailSectionCard>

      {variant === 'default' ? (
        <DynamicCareStaffRequirementCard selectedStaff={selectedStaff} onRemoveStaff={onRemoveStaff} />
      ) : null}
    </aside>
  )
}
