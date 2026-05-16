/**
 * Care-type chip visuals from Figma (node 812:11194).
 * Keys must match CLIENT_INTAKE_RECORD.careTypes labels.
 */
export const CARE_TYPE_STYLES = {
  'IV Therapy': {
    background: '#fff0fa',
    border: '#ffc6ec',
    color: '#df0075',
  },
  'Palliative Care': {
    background: '#eef6ff',
    border: '#bcddff',
    color: '#216ff5',
  },
  'Chronic Disease': {
    background: '#fdfee8',
    border: '#ebf558',
    color: '#726d11',
  },
  'Wound Care': {
    background: '#f3f0ff',
    border: '#d9cdff',
    color: '#6400df',
  },
  Physiotherapy: {
    background: '#fdf5ef',
    border: '#f6ceb2',
    color: '#b0371e',
  },
  /** Figma label “Pediatric” (not “Pediatric Care”) */
  Pediatric: {
    background: '#f0fdf4',
    border: '#bbf7d0',
    color: '#15803d',
  },
}

export function getCareTypeStyle(label) {
  if (label === 'Pediatric Care') {
    return CARE_TYPE_STYLES.Pediatric
  }
  return (
    CARE_TYPE_STYLES[label] ?? {
      background: 'var(--color-ds-canvas-light)',
      border: 'var(--color-ds-border-base)',
      color: 'var(--color-ds-text-dark)',
    }
  )
}
