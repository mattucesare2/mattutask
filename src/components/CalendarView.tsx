'use client'

import { useMemo, useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns'
import { it } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Task } from '@/lib/types'
import { getCategoryColor } from '@/lib/colors'

type Props = {
  tasks: Task[]
  onSelectTask: (task: Task) => void
}

export default function CalendarView({ tasks, onSelectTask }: Props) {
  const [current, setCurrent] = useState(new Date())

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(current), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(current), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [current])

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>()
    tasks.forEach((t) => {
      if (!t.dueDate) return
      const key = format(new Date(t.dueDate), 'yyyy-MM-dd')
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(t)
    })
    return map
  }, [tasks])

  const weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <button
          onClick={() => setCurrent(subMonths(current, 1))}
          className="p-2 rounded-lg hover:bg-[var(--background)]"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="font-semibold capitalize">
          {format(current, 'MMMM yyyy', { locale: it })}
        </h2>
        <button
          onClick={() => setCurrent(addMonths(current, 1))}
          className="p-2 rounded-lg hover:bg-[var(--background)]"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-[var(--border)]">
        {weekDays.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-medium text-[var(--muted)] uppercase tracking-wide"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const dayTasks = tasksByDay.get(key) || []
          const inMonth = isSameMonth(day, current)

          return (
            <div
              key={key}
              className={`min-h-[90px] sm:min-h-[110px] border-b border-r border-[var(--border)] p-1.5 ${
                !inMonth ? 'bg-[var(--background)]/50' : ''
              }`}
            >
              <div
                className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${
                  isToday(day)
                    ? 'bg-[var(--primary)] text-white'
                    : inMonth
                    ? ''
                    : 'text-[var(--muted)]'
                }`}
              >
                {format(day, 'd')}
              </div>
              <div className="space-y-0.5">
                {dayTasks.slice(0, 3).map((t) => {
                  const colors = getCategoryColor(t.category)
                  return (
                    <button
                      key={t.id}
                      onClick={() => onSelectTask(t)}
                      className={`w-full text-left text-[10px] sm:text-xs px-1.5 py-0.5 rounded truncate ${
                        t.completed
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 line-through'
                          : colors.calendar
                      }`}
                      title={t.title}
                    >
                      {t.title}
                    </button>
                  )
                })}
                {dayTasks.length > 3 && (
                  <div className="text-[10px] text-[var(--muted)] px-1">
                    +{dayTasks.length - 3} altre
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}