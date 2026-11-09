'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckSquare, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Le password non coincidono')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Errore di registrazione')
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('Errore di connessione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)] text-white mb-4">
            <CheckSquare size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">MattuTask</h1>
          <p className="text-[var(--muted)] mt-2">Crea un nuovo account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-4"
        >
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              pattern="[a-zA-Z0-9_]+"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              placeholder="scegli_un_username"
              autoComplete="username"
            />
            <p className="text-xs text-[var(--muted)] mt-1">Solo lettere, numeri e underscore</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              placeholder="minimo 6 caratteri"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Conferma password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              placeholder="ripeti la password"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium py-2.5 px-4 rounded-xl transition-colors disabled:opacity-60"
          >
            <UserPlus size={18} />
            {loading ? 'Registrazione...' : 'Registrati'}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--muted)] mt-6">
          Hai già un account?{' '}
          <Link href="/login" className="text-[var(--primary)] font-medium hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  )
}
