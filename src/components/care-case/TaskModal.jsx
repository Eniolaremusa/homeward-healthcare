import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import DateField from '../DateField'
import Field from '../Field'
import SelectField from '../SelectField'
import TextareaField from '../TextareaField'
import { TASK_DURATION_OPTIONS, TASK_FREQUENCY_OPTIONS } from '../../data/clinicalProfileOptions'

function newTaskId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function validateTaskForm(v) {
  const e = {}
  if (!String(v.name).trim()) e.name = 'Required'
  if (!v.duration) e.duration = 'Required'
  if (!v.frequency) e.frequency = 'Required'
  if (!v.startDate) e.startDate = 'Required'
  if (!String(v.notes).trim()) e.notes = 'Required'
  return e
}

/**
 * Modal to add or edit a care-case task (portal + scrim).
 */
export default function TaskModal({ open, initialTask, onClose, onSave }) {
  const isEdit = Boolean(initialTask?.id)
  const [values, setValues] = useState({
    name: '',
    duration: '',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: '',
  })
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!open) return
    setSubmitted(false)
    setTouched({})
    if (initialTask) {
      setValues({
        name: initialTask.name ?? '',
        duration: initialTask.duration ?? '',
        frequency: initialTask.frequency ?? '',
        startDate: initialTask.startDate ?? initialTask.visitTime ?? '',
        endDate: initialTask.endDate ?? '',
        notes: initialTask.notes ?? '',
      })
    } else {
      setValues({
        name: '',
        duration: '',
        frequency: '',
        startDate: '',
        endDate: '',
        notes: '',
      })
    }
  }, [open, initialTask])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(ev) {
      if (ev.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const errors = useMemo(() => validateTaskForm(values), [values])
  const visible = useMemo(() => {
    const o = {}
    Object.keys(errors).forEach((k) => {
      if (submitted || touched[k]) o[k] = errors[k]
    })
    return o
  }, [errors, submitted, touched])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTouched({
      name: true,
      duration: true,
      frequency: true,
      startDate: true,
      endDate: true,
      notes: true,
    })
    const next = validateTaskForm(values)
    if (Object.keys(next).length) return
    const endTrimmed = String(values.endDate ?? '').trim()
    onSave?.({
      id: initialTask?.id ?? newTaskId(),
      name: values.name.trim(),
      duration: values.duration,
      frequency: values.frequency,
      startDate: values.startDate,
      endDate: endTrimmed,
      notes: values.notes.trim(),
    })
    onClose?.()
  }

  if (!open) return null

  const modal = (
    <div
      role="presentation"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-ds-overlay-scrim p-4 backdrop-blur-[2px]"
      onClick={() => onClose?.()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="w-full max-w-[480px] rounded-ds-xxl border border-ds-border-base bg-ds-canvas-base p-ds-8 shadow-ds-md"
        onClick={(ev) => ev.stopPropagation()}
      >
        <h2 id="task-modal-title" className="mb-ds-5 text-[18px] font-medium leading-6 tracking-[-0.54px] text-ds-text-dark">
          {isEdit ? 'Edit task' : 'Add task'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-ds-5" noValidate>
          <Field
            name="name"
            label="Task name"
            required
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Task name"
            error={visible.name}
          />
          <div className="grid grid-cols-1 gap-ds-5 sm:grid-cols-2">
            <SelectField
              name="duration"
              label="Task duration"
              required
              placeholder="Select"
              value={values.duration}
              onChange={handleChange}
              onBlur={handleBlur}
              options={TASK_DURATION_OPTIONS}
              error={visible.duration}
            />
            <SelectField
              name="frequency"
              label="Frequency"
              required
              placeholder="Select"
              value={values.frequency}
              onChange={handleChange}
              onBlur={handleBlur}
              options={TASK_FREQUENCY_OPTIONS}
              error={visible.frequency}
            />
          </div>
          <div className="grid grid-cols-1 gap-ds-5 sm:grid-cols-2">
            <DateField
              name="startDate"
              label="Task start date"
              required
              allowFuture
              value={values.startDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={visible.startDate}
            />
            <DateField
              name="endDate"
              label="Task end date (optional)"
              required={false}
              allowFuture
              value={values.endDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={visible.endDate}
            />
          </div>
          <TextareaField
            name="notes"
            label="Task notes"
            required
            rows={4}
            value={values.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Required notes for this task"
            error={visible.notes}
          />
          <div className="flex justify-end gap-ds-4 pt-ds-2">
            <button
              type="button"
              onClick={() => onClose?.()}
              className="flex h-10 items-center justify-center rounded-ds-full border border-ds-border-base bg-ds-button-gray px-ds-6 text-[15px] font-medium text-ds-text-dark shadow-ds-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex h-10 items-center justify-center rounded-ds-full border border-[rgba(56,0,18,0.5)] bg-ds-button-primary px-ds-6 text-[15px] font-medium text-ds-text-white shadow-[inset_0px_0px_1px_2px_rgba(255,255,255,0.22)]"
            >
              {isEdit ? 'Save task' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
