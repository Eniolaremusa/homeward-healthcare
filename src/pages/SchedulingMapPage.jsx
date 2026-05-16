import ScheduleClientsWorkspace from '../components/ScheduleClientsWorkspace'
import { IntakeToastProvider } from '../context/IntakeToastContext'

/**
 * Scheduling / staff–client mapping workspace.
 * Mounted only at `/scheduling/map` so it does not share state with patient intake.
 */
export default function SchedulingMapPage() {
  return (
    <IntakeToastProvider>
      <ScheduleClientsWorkspace />
    </IntakeToastProvider>
  )
}
