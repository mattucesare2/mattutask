'use client'

import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import type { Task } from '@/lib/types'

type Props = {
  open: boolean
  onClose: () => void
  onSave: (data: {
    title: string
    description?: string | null
    dueDate?: string | null
    category?: string | null
    assignees?: string | null
  }) => Promise<void>
  initial?: Task | null
  categories: string[]
}

export default function TaskForm({ open, onClose, onSave, initial, categories }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignees, setAssignees] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initial) {
      setTitle(initial.title)
      setDescription(initial.description || '')
      setDueDate(
        initial.dueDate
          ? new Date(initial.dueDate).toISOString().slice(0, 16)
          : ''
      )
      setCategory(initial.category || '')
      setAssignees(initial.assignees || '')
    } else {
      setTitle('')
      setDescription('')
      setDueDate('')
      setCategory('')
      setAssignees('')
    }
  }, [initial, open])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || null,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        category: category.trim() || null,
        assignees: assignees.trim() || null,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-lg">
            {initial ? 'Modifica attività' : 'Nuova attività'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--background)] text-[var(--muted)]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Titolo *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Cosa devi fare?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Descrizione</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              placeholder="Dettagli opzionali..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Scadenza</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Categoria</label>
              <input
                type="text"
                list="categories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="es. Lavoro, Casa..."
              />
              <datalist id="categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Persone coinvolte</label>
            <input
              type="text"
              value={assignees}
              onChange={(e) => setAssignees(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="es. Mario, Luca, Anna"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border)] font-medium hover:bg-[var(--background)] transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium disabled:opacity-60 transition-colors"
            >
              <Plus size={18} />
              {loading ? 'Salvataggio...' : initial ? 'Salva' : 'Aggiungi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}