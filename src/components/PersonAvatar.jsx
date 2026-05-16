function initialsFromName(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const sizeClass = {
  xs: 'size-9 text-[11px] font-semibold',
  sm: 'size-11 text-[12px] font-semibold',
  md: 'size-16 text-[18px] font-semibold',
  lg: 'size-[72px] text-[22px] font-semibold',
}

/**
 * Initials / image avatar using secondary (pink) surface and white foreground (design system).
 */
export default function PersonAvatar({
  name,
  imageUrl,
  alt = '',
  size = 'md',
  className = '',
}) {
  const box = `${sizeClass[size] ?? sizeClass.md} shrink-0 overflow-hidden rounded-ds-s border border-[rgba(152,3,79,0.35)] bg-ds-button-secondary text-ds-text-white`

  if (imageUrl) {
    return (
      <div
        className={`${sizeClass[size] ?? sizeClass.md} shrink-0 overflow-hidden rounded-ds-s border border-[rgba(152,3,79,0.35)] bg-ds-canvas-base ${className}`}
      >
        <img src={imageUrl} alt={alt} className="size-full object-cover" />
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center ${box} ${className}`} aria-hidden={!alt}>
      <span className="leading-none">{initialsFromName(name)}</span>
    </div>
  )
}
