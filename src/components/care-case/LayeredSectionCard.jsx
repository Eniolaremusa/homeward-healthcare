/**
 * Two-surface section card: tinted header band + lighter body (Figma stacked-card pattern).
 */
export default function LayeredSectionCard({ title, children, className = '' }) {
  return (
    <div
      className={`overflow-hidden rounded-ds-l border border-ds-border-base shadow-ds-sm ${className}`.trim()}
    >
      <div className="border-b border-ds-border-base bg-ds-canvas-darker px-ds-6 py-ds-4">
        <p className="text-[11px] font-semibold uppercase leading-[16px] tracking-[0.08em] text-ds-text-base">
          {title}
        </p>
      </div>
      <div className="bg-ds-canvas-base px-ds-6 py-ds-5">{children}</div>
    </div>
  )
}
