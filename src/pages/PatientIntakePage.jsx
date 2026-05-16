import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CarePreferencesForm from '../components/CarePreferencesForm'
import EmergencyContactForm from '../components/EmergencyContactForm'
import Header from '../components/Header'
import IntakeSuccessModal from '../components/IntakeSuccessModal'
import PatientForm from '../components/PatientForm'
import Stepper from '../components/Stepper'
import { IntakeToastProvider } from '../context/IntakeToastContext'

/**
 * Full patient intake flow (steps 1–3 + success modal).
 * Mounted only at `/patients/new` so state is isolated from scheduling.
 */
export default function PatientIntakePage() {
  const navigate = useNavigate()
  const [completedThroughStep, setCompletedThroughStep] = useState(0)
  const [intakeSummary, setIntakeSummary] = useState({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [intakeFormKey, setIntakeFormKey] = useState(0)

  const mergeStep = (stepIndex, partial) => {
    setIntakeSummary((prev) => ({ ...prev, ...partial }))
    setCompletedThroughStep((prev) => Math.max(prev, stepIndex))
  }

  const handleStep3Complete = (step3Partial) => {
    setIntakeSummary((prev) => ({ ...prev, ...step3Partial }))
    setCompletedThroughStep(3)
    setShowSuccessModal(true)
  }

  return (
    <IntakeToastProvider>
      <main className="min-h-screen bg-white">
        <Header breadcrumbs={['Home', 'New Patient']} title="Create a New Care Case" />
        <section className="dot-grid-bg min-h-[calc(100vh-93px)] px-8 py-6">
          <div className="mx-auto grid w-full max-w-[1180px] grid-cols-[360px_1fr] items-start gap-6">
            <Stepper completedThroughStep={completedThroughStep} />
            {completedThroughStep < 1 ? (
              <PatientForm key={intakeFormKey} onIntakeStepValidated={mergeStep} />
            ) : completedThroughStep < 2 ? (
              <EmergencyContactForm key={intakeFormKey} onIntakeStepValidated={mergeStep} />
            ) : (
              <CarePreferencesForm key={intakeFormKey} onWorkflowComplete={handleStep3Complete} />
            )}
          </div>
        </section>

        <IntakeSuccessModal
          open={showSuccessModal}
          summary={intakeSummary}
          onClose={() => setShowSuccessModal(false)}
          onDoLater={() => {
            setShowSuccessModal(false)
            setCompletedThroughStep(0)
            setIntakeSummary({})
            setIntakeFormKey((k) => k + 1)
          }}
          onCreateCareCase={() => {
            setShowSuccessModal(false)
            navigate('/patients/new/care-case', { state: { intakeSummary } })
          }}
        />
      </main>
    </IntakeToastProvider>
  )
}
