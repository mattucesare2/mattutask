'use client'

import { LogOut, CheckSquare, ListTodo, CalendarDays } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  username: string
  view: 'list' | 'calendar'
  onViewChange: (v: 'list' | 'calendar') => void
}

export default function Header({ username, view, onViewChange }: Props) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)] sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center">
            <CheckSquare size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">MattuTask</h1>
            <p className="text-xs text-[var(--muted)]">@{username}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[var(--background)] rounded-xl p-1">
          <button
            onClick={() => onViewChange('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'list'
                ? 'bg-[var(--card)] shadow-sm text-[var(--primary)]'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <ListTodo size={16} />
            <span className="hidden sm:inline">Lista</span>
          </button>
          <button
            onClick={() => onViewChange('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'calendar'
                ? 'bg-[var(--card)] shadow-sm text-[var(--primary)]'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <CalendarDays size={16} />
            <span className="hidden sm:inline">Calendario</span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--danger)] transition-colors px-2 py-1.5"
          title="Esci"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Esci</span>
        </button>
      </div>
    </header>
  )
}
