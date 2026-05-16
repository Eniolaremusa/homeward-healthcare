/**
 * Inner “gray” panel — canvas/dark bg, radius-m, padding spacing/5 (12px).
 */
export default function ClientDetailSectionCard({ children, className = '' }) {
  return (
    <div
      className={`flex w-full flex-col rounded-ds-m bg-ds-canvas-dark p-ds-5 ${className}`}
    >
      {children}
    </div>
  )
}
