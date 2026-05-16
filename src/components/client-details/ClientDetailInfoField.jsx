/**
 * Single label + value stack — gap spacing/1 (2px) per Figma field groups.
 */
export default function ClientDetailInfoField({ label, value, valueClassName = '' }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-ds-1">
      <p className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-base">{label}</p>
      <p
        className={`whitespace-pre-wrap break-words text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  )
}
