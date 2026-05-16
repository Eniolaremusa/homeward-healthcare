import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import PatientIntakePage from './pages/PatientIntakePage'
import CareCaseCreationPage from './pages/CareCaseCreationPage'
import SchedulingMapPage from './pages/SchedulingMapPage'
import HomePage from './pages/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/patients/new" element={<PatientIntakePage />} />
        <Route path="/patients/new/care-case" element={<CareCaseCreationPage />} />
        <Route path="/scheduling/map" element={<SchedulingMapPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
