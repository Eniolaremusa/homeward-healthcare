import FlowProgressCard from './FlowProgressCard'

const steps = [
  { id: 1, label: 'Patient Identity', numberVariant: 'body3' },
  { id: 2, label: 'Emergency Contacts', numberVariant: 'footnote' },
  { id: 3, label: 'Care Preferences', numberVariant: 'body3' },
]

/**
 * @param {object} props
 * @param {number} [props.completedThroughStep] — e.g. after valid Step 1 submit, pass `1` to show a check on step 1. `0` = all steps use numbered inactive state.
 */
function Stepper({ completedThroughStep = 0 }) {
  return (
    <FlowProgressCard
      ariaLabel="Patient intake progress"
      title="Patient Intake Form"
      steps={steps}
      completedThroughStep={completedThroughStep}
    />
  )
}

export default Stepper
