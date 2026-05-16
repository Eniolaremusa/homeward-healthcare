import { useMemo, useState } from 'react'
import CareCaseStepFooter from './CareCaseStepFooter'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'
import { useIntakeToast } from '../../context/IntakeToastContext'

function validateTasks(tasks) {
  if (!tasks.length) return { tasks: 'Add at least one task' }
  return {}
}

export default function TaskStep({ tasks, onTasksChange, onComplete, onPrevious, onCancel }) {
  const { showError } = useIntakeToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => validateTasks(tasks), [tasks])
  const isValid = Object.keys(errors).length === 0
  const showTaskListError = submitted && errors.tasks

  const openAdd = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const openEdit = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleSave = (payload) => {
    onTasksChange?.((list) => {
      const idx = list.findIndex((t) => t.id === payload.id)
      if (idx === -1) return [...list, payload]
      const next = [...list]
      next[idx] = payload
      return next
    })
  }

  const handleDelete = (id) => {
    onTasksChange?.((list) => list.filter((t) => t.id !== id))
  }

  const handleContinue = () => {
    setSubmitted(true)
    if (!validateTasks(tasks).tasks) {
      onComplete?.({ tasks })
    } else {
      showError('Add at least one task before continuing.')
    }
  }

  return (
    <>
      <article className="w-full min-w-0 overflow-hidden rounded-ds-l border border-ds-border-base bg-ds-canvas-base shadow-[0px_0px_1px_rgba(19,19,21,0.04)]">
        <header className="border-b border-ds-border-base bg-ds-canvas-base px-ds-8 py-ds-5">
          <p className="text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-light">STEP 3 / 4</p>
          <h2 className="text-[18px] font-medium leading-6 tracking-[-0.54px] text-ds-text-dark">Task</h2>
        </header>

        <div className="border-b border-ds-border-base bg-ds-canvas-light p-ds-6">
          <div className="flex flex-col gap-ds-5 rounded-ds-m border border-ds-border-base bg-ds-canvas-base p-ds-6">
            <div className="flex flex-wrap items-center justify-between gap-ds-4">
              <p className="text-[13px] font-medium leading-[21px] tracking-[-0.26px] text-ds-text-dark">Tasks</p>
              <button
                type="button"
                onClick={openAdd}
                className="flex h-9 items-center justify-center rounded-ds-full border border-ds-border-base bg-ds-button-gray px-ds-5 text-[13px] font-medium text-ds-text-dark shadow-ds-sm"
              >
                Add task
              </button>
            </div>
            {showTaskListError ? (
              <p className="text-[12px] leading-[18px] text-ds-status-error">{errors.tasks}</p>
            ) : null}
            <div className="flex flex-col gap-[20px]">
              {tasks.map((t) => (
                <TaskCard key={t.id} task={t} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        </div>

        <CareCaseStepFooter
          showPrevious
          onPrevious={onPrevious}
          onCancel={onCancel}
          submitType="button"
          submitDisabled={!isValid}
          onSubmitClick={handleContinue}
        />
      </article>

      <TaskModal
        open={modalOpen}
        initialTask={editingTask}
        onClose={() => {
          setModalOpen(false)
          setEditingTask(null)
        }}
        onSave={handleSave}
      />
    </>
  )
}
