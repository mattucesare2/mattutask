'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Filter, Search } from 'lucide-react'
import Header from '@/components/Header'
import TaskItem from '@/components/TaskItem'
import TaskForm from '@/components/TaskForm'
import CalendarView from '@/components/CalendarView'
import CategoryColorMenu from '@/components/CategoryColorMenu'
import type { Task } from '@/lib/types'

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; username: string } | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [filter, setFilter] = useState<'all' | 'open' | 'completed'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)

  const loadUser = useCallback(async () => {
    const res = await fetch('/api/auth/me')
    if (!res.ok) {
      router.replace('/login')
      return
    }
    const data = await res.json()
    setUser(data.user)
  }, [router])

  const loadTasks = useCallback(async () => {
    const res = await fetch('/api/tasks')
    if (!res.ok) return
    const data = await res.json()
    setTasks(data.tasks)
  }, [])

  useEffect(() => {
    async function init() {
      await loadUser()
      await loadTasks()
      setLoading(false)
    }
    init()
  }, [loadUser, loadTasks])

  // Ascolta i cambi di colore delle categorie
  useEffect(() => {
    const handler = () => {
      setTasks((prev) => [...prev])
    }
    window.addEventListener('category-colors-changed', handler)
    return () => window.removeEventListener('category-colors-changed', handler)
  }, [])

  const categories = useMemo(() => {
    const set = new Set<string>()
    tasks.forEach((t) => {
      if (t.category) set.add(t.category)
    })
    return Array.from(set).sort()
  }, [tasks])

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === 'open' && t.completed) return false
      if (filter === 'completed' && !t.completed) return false
      if (categoryFilter && t.category !== categoryFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !t.title.toLowerCase().includes(q) &&
          !(t.description || '').toLowerCase().includes(q) &&
          !(t.category || '').toLowerCase().includes(q) &&
          !(t.assignees || '').toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [tasks, filter, categoryFilter, search])

  async function handleCreate(data: {
    title: string
    description?: string | null
    dueDate?: string | null
    category?: string | null
    assignees?: string | null
  }) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const { task } = await res.json()
      setTasks((prev) => [task, ...prev])
    }
  }

  async function handleUpdate(data: {
    title: string
    description?: string | null
    dueDate?: string | null
    category?: string | null
    assignees?: string | null
  }) {
    if (!editing) return
    const res = await fetch(`/api/tasks/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const { task } = await res.json()
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
      setEditing(null)
    }
  }

  async function handleToggle(id: string, completed: boolean) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t))
    )
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminare questa attività?')) return
    setTasks((prev) => prev.filter((t) => t.id !== id))
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--muted)]">Caricamento...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header username={user.username} view={view} onViewChange={setView} />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca attività..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="all">Tutte</option>
              <option value="open">Da fare</option>
              <option value="completed">Completate</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="">Tutte le categorie</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <CategoryColorMenu categories={categories} />

            <button
              onClick={() => {
                setEditing(null)
                setFormOpen(true)
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium transition-colors whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nuova</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {view === 'list' ? (
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-[var(--muted)]">
                <Filter size={40} className="mx-auto mb-3 opacity-40" />
                <p className="font-medium">Nessuna attività trovata</p>
                <p className="text-sm mt-1">
                  {tasks.length === 0
                    ? 'Crea la tua prima attività!'
                    : 'Prova a cambiare i filtri'}
                </p>
              </div>
            ) : (
              filtered.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggle}
                  onEdit={(t) => {
                    setEditing(t)
                    setFormOpen(true)
                  }}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        ) : (
          <CalendarView
            tasks={filtered}
            onSelectTask={(t) => {
              setEditing(t)
              setFormOpen(true)
            }}
          />
        )}
      </main>

      <TaskForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSave={editing ? handleUpdate : handleCreate}
        initial={editing}
        categories={categories}
      />
    </div>
  )
}