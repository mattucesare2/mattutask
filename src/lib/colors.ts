function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

export const COLOR_OPTIONS = [
  { id: 'blue',   bg: 'bg-blue-100 dark:bg-blue-900/40',   text: 'text-blue-800 dark:text-blue-200',   border: 'border-blue-400',   soft: 'bg-blue-50 dark:bg-blue-950/40',   calendar: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200' },
  { id: 'green',  bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-800 dark:text-green-200', border: 'border-green-400',  soft: 'bg-green-50 dark:bg-green-950/40', calendar: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200' },
  { id: 'purple', bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-800 dark:text-purple-200', border: 'border-purple-400', soft: 'bg-purple-50 dark:bg-purple-950/40', calendar: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200' },
  { id: 'amber',  bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-400',  soft: 'bg-amber-50 dark:bg-amber-950/40',  calendar: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200' },
  { id: 'rose',   bg: 'bg-rose-100 dark:bg-rose-900/40',   text: 'text-rose-800 dark:text-rose-200',   border: 'border-rose-400',   soft: 'bg-rose-50 dark:bg-rose-950/40',   calendar: 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200' },
  { id: 'cyan',   bg: 'bg-cyan-100 dark:bg-cyan-900/40',   text: 'text-cyan-800 dark:text-cyan-200',   border: 'border-cyan-400',   soft: 'bg-cyan-50 dark:bg-cyan-950/40',   calendar: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-200' },
  { id: 'orange', bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-800 dark:text-orange-200', border: 'border-orange-400', soft: 'bg-orange-50 dark:bg-orange-950/40', calendar: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200' },
  { id: 'indigo', bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-800 dark:text-indigo-200', border: 'border-indigo-400', soft: 'bg-indigo-50 dark:bg-indigo-950/40', calendar: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200' },
  { id: 'teal',   bg: 'bg-teal-100 dark:bg-teal-900/40',   text: 'text-teal-800 dark:text-teal-200',   border: 'border-teal-400',   soft: 'bg-teal-50 dark:bg-teal-950/40',   calendar: 'bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200' },
  { id: 'pink',   bg: 'bg-pink-100 dark:bg-pink-900/40',   text: 'text-pink-800 dark:text-pink-200',   border: 'border-pink-400',   soft: 'bg-pink-50 dark:bg-pink-950/40',   calendar: 'bg-pink-100 dark:bg-pink-900/40 text-pink-800 dark:text-pink-200' },
]

const STORAGE_KEY = 'mattutask_category_colors'

export function getSavedColors(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveCategoryColor(category: string, colorId: string) {
  const current = getSavedColors()
  current[category] = colorId
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
}

export function getCategoryColor(category: string | null | undefined) {
  if (!category) {
    return {
      badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300',
      border: 'border-l-4 border-l-slate-400',
      card: '',
      calendar: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200',
    }
  }

  const saved = getSavedColors()
  const colorId = saved[category]

  let color
  if (colorId) {
    color = COLOR_OPTIONS.find(c => c.id === colorId) || COLOR_OPTIONS[0]
  } else {
    const index = hashString(category.toLowerCase()) % COLOR_OPTIONS.length
    color = COLOR_OPTIONS[index]
  }

  return {
    badge: `${color.bg} ${color.text} border ${color.border}`,
    border: `border-l-4 ${color.border}`,
    card: color.soft,
    calendar: color.calendar,
  }
}