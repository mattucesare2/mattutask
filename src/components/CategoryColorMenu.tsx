'use client'

import { useState, useEffect } from 'react'
import { Palette, X } from 'lucide-react'
import { COLOR_OPTIONS, getSavedColors, saveCategoryColor } from '@/lib/colors'

type Props = {
  categories: string[]
}

export default function CategoryColorMenu({ categories }: Props) {
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState<Record<string, string>>({})

  useEffect(() => {
    setSaved(getSavedColors())
  }, [open])

  function handleSelect(category: string, colorId: string) {
    saveCategoryColor(category, colorId)
    setSaved(prev => ({ ...prev, [category]: colorId }))
    // forza il re-render delle attività
    window.dispatchEvent(new Event('category-colors-changed'))
  }

  if (categories.length === 0) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm hover:bg-[var(--background)] transition-colors"
        title="Colori categorie"
      >
        <Palette size={16} />
        <span className="hidden sm:inline">Colori</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h2 className="font-semibold text-lg">Colori delle categorie</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--background)] text-[var(--muted)]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {categories.map((cat) => {
                const currentId = saved[cat]
                return (
                  <div key={cat}>
                    <p className="text-sm font-medium mb-2">{cat}</p>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => handleSelect(cat, color.id)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color.bg} ${
                            currentId === color.id
                              ? 'border-[var(--foreground)] scale-110 ring-2 ring-offset-2 ring-[var(--primary)]'
                              : 'border-transparent'
                          }`}
                          title={color.id}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="px-5 py-3 border-t border-[var(--border)] text-xs text-[var(--muted)]">
              I colori vengono salvati su questo browser
            </div>
          </div>
        </div>
      )}
    </>
  )
}