'use client'

import { format, isPast, isToday, isTomorrow } from 'date-fns'
import { it } from 'date-fns/locale'
import { Check, Circle, Pencil, Trash2, Calendar, Tag, Users } from 'lucide-react'
import type { Task } from '@/lib/types'
import { getCategoryColor } from '@/lib/colors'

type Props = {
  task: Task
  onToggle: (id: string, completed: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

function formatDueDate(dateStr: string | null) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isToday(d)) return 'Oggi'
  if (isTomorrow(d)) return 'Domani'
  return format(d, 'd MMM yyyy', { locale: it })
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
  const dueLabel = formatDueDate(task.dueDate)
  const isOverdue =
    task.dueDate && !task.completed && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))

  const colors = getCategoryColor(task.category)

  return (
    <div
      className={`group flex items-start gap-3 p-4 rounded-xl border transition-all ${
        task.completed
          ? 'bg-[var(--background)] border-transparent opacity-70'
          : `border-[var(--border)] hover:shadow-sm ${colors.border} ${colors.card}`
      }`}
    >
      <button
        onClick={() => onToggle(task.id, !task.completed)}
        className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          task.completed
            ? 'bg-[var(--success)] border-[var(--success)] text-white'
            : 'border-[var(--muted)] hover:border-[var(--primary)]'
        }`}
        title={task.completed ? 'Segna come da fare' : 'Completa'}
      >
        {task.completed ? <Check size={14} strokeWidth={3} /> : <Circle size={14} className="opacity-0" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium leading-snug ${task.completed ? 'line-through text-[var(--muted)]' : ''}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-sm text-[var(--muted)] mt-1 line-clamp-2">{task.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
          {dueLabel && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                isOverdue
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'bg-black/5 dark:bg-white/5 text-[var(--muted)]'
              }`}
            >
              <Calendar size={12} />
              {dueLabel}
              {task.dueDate && ` · ${format(new Date(task.dueDate), 'HH:mm')}`}
            </span>
          )}
          {task.category && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${colors.badge}`}>
              <Tag size={12} />
              {task.category}
            </span>
          )}
          {task.assignees && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[var(--muted)]">
              <Users size={12} />
              {task.assignees}
            </span>
          )}
          <span className="text-[var(--muted)]">
            creata {format(new Date(task.createdAt), 'd MMM', { locale: it })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[var(--muted)] hover:text-[var(--primary)]"
          title="Modifica"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[var(--muted)] hover:text-[var(--danger)]"
          title="Elimina"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}