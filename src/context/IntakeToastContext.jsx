import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import ErrorToast from '../components/ErrorToast'
import SuccessToast from '../components/SuccessToast'

const IntakeToastContext = createContext(null)

const TOAST_MS = 5500
const SUCCESS_TOAST_MS = 4200

export function IntakeToastProvider({ children }) {
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)
  const timerRef = useRef(null)

  const [successMessage, setSuccessMessage] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)
  const successTimerRef = useRef(null)

  const hide = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setOpen(false)
    setMessage('')
  }, [])

  const hideSuccess = useCallback(() => {
    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current)
      successTimerRef.current = null
    }
    setSuccessOpen(false)
    setSuccessMessage('')
  }, [])

  const showError = useCallback(
    (msg) => {
      const text = String(msg || '').trim() || 'Something went wrong. Please try again.'
      if (timerRef.current) window.clearTimeout(timerRef.current)
      setMessage(text)
      setOpen(true)
      timerRef.current = window.setTimeout(() => {
        hide()
      }, TOAST_MS)
    },
    [hide],
  )

  const showSuccess = useCallback(
    (msg) => {
      const text = String(msg || '').trim() || 'Success.'
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current)
      setSuccessMessage(text)
      setSuccessOpen(true)
      successTimerRef.current = window.setTimeout(() => {
        hideSuccess()
      }, SUCCESS_TOAST_MS)
    },
    [hideSuccess],
  )

  const value = useMemo(() => ({ showError, showSuccess }), [showError, showSuccess])

  return (
    <IntakeToastContext.Provider value={value}>
      {children}
      <ErrorToast open={open} message={message} onDismiss={hide} position="top-right" />
      <SuccessToast open={successOpen} message={successMessage} onDismiss={hideSuccess} position="top-center" />
    </IntakeToastContext.Provider>
  )
}

// Hook colocated with provider (standard React pattern).
// eslint-disable-next-line react-refresh/only-export-components -- context consumer hook
export function useIntakeToast() {
  return useContext(IntakeToastContext) ?? { showError: () => {}, showSuccess: () => {} }
}
