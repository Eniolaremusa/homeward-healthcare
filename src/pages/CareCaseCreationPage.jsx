import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import CancelCareCaseModal from '../components/care-case/CancelCareCaseModal'
import CarePlanStep from '../components/care-case/CarePlanStep'
import ClinicalProfileStep from '../components/care-case/ClinicalProfileStep'
import PreviewStep from '../components/care-case/PreviewStep'
import TaskStep from '../components/care-case/TaskStep'
import ClientDetailsPanel from '../components/client-details/ClientDetailsPanel'
import FlowProgressCard from '../components/FlowProgressCard'
import Header from '../components/Header'
import { IntakeToastProvider } from '../context/IntakeToastContext'
import { mapIntakeSummaryToClientDetails } from '../utils/mapIntakeSummaryToClientDetails'

const CARE_STEPS = [
  { id: 1, label: 'Clinical Profile', numberVariant: 'body3' },
  { id: 2, label: 'Care Plan', numberVariant: 'body3' },
  { id: 3, label: 'Task', numberVariant: 'body3' },
  { id: 4, label: 'Preview', numberVariant: 'body3' },
]

export default function CareCaseCreationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const intakeSummary = location.state?.intakeSummary

  const [completedThroughStep, setCompletedThroughStep] = useState(0)
  const [clinical, setClinical] = useState(null)
  const [carePlan, setCarePlan] = useState(null)
  const [tasks, setTasks] = useState([])
  const [cancelModalOpen, setCancelModalOpen] = useState(false)

  const clientIntake = useMemo(() => mapIntakeSummaryToClientDetails(intakeSummary ?? {}), [intakeSummary])
  const patientName = clientIntake.displayName || 'Patient'

  if (!intakeSummary || typeof intakeSummary !== 'object' || !String(intakeSummary.patientDisplayName || '').trim()) {
    return <Navigate to="/patients/new" replace />
  }

  const openCancelModal = () => setCancelModalOpen(true)
  const closeCancelModal = () => setCancelModalOpen(false)
  const confirmCancelFlow = () => {
    setCancelModalOpen(false)
    navigate('/patients/new', { replace: true })
  }

  const mainColumn =
    completedThroughStep < 1 ? (
      <ClinicalProfileStep
        initialData={clinical}
        onComplete={(data) => {
          setClinical(data)
          setCompletedThroughStep(1)
        }}
        onCancel={openCancelModal}
      />
    ) : completedThroughStep < 2 ? (
      <CarePlanStep
        initialData={carePlan}
        onComplete={(data) => {
          setCarePlan(data)
          setCompletedThroughStep(2)
        }}
        onPrevious={() => setCompletedThroughStep(0)}
        onCancel={openCancelModal}
      />
    ) : completedThroughStep < 3 ? (
      <TaskStep
        tasks={tasks}
        onTasksChange={setTasks}
        onComplete={() => setCompletedThroughStep(3)}
        onPrevious={() => setCompletedThroughStep(1)}
        onCancel={openCancelModal}
      />
    ) : (
      <PreviewStep
        clinical={clinical}
        carePlan={carePlan}
        tasks={tasks}
        onPrevious={() => setCompletedThroughStep(2)}
        onCancel={openCancelModal}
      />
    )

  return (
    <IntakeToastProvider>
      <main className="flex min-h-screen flex-col bg-ds-canvas-base">
        <Header breadcrumbs={['New Patients', patientName, 'New Care Case']} title="Create a Care Case" />
        <section className="dot-grid-bg flex-1 px-8 py-6">
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)_360px]">
            <FlowProgressCard
              ariaLabel="Care case creation progress"
              title="Care Case Creation"
              steps={CARE_STEPS}
              completedThroughStep={completedThroughStep}
            />
            <div className="min-w-0 xl:col-span-1">{mainColumn}</div>
            <div className="min-w-0 xl:max-w-[360px]">
              <ClientDetailsPanel intake={clientIntake} variant="careCase" />
            </div>
          </div>
        </section>
      </main>
      <CancelCareCaseModal
        open={cancelModalOpen}
        onContinueEditing={closeCancelModal}
        onCancelFlow={confirmCancelFlow}
      />
    </IntakeToastProvider>
  )
}
