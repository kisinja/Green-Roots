'use client'
import { useEffect, useState } from 'react'

interface Toast { id: number; message: string; type: 'success' | 'error' }

// Simple global toast store
const listeners: ((t: Toast) => void)[] = []

export function showToast(message: string, type: 'success' | 'error' = 'success') {
  listeners.forEach(fn => fn({ id: Date.now(), message, type }))
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const fn = (t: Toast) => {
      setToasts(prev => [...prev, t])
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3000)
    }
    listeners.push(fn)
    return () => { const i = listeners.indexOf(fn); if (i > -1) listeners.splice(i, 1) }
  }, [])

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-xl animate-bounce-in ${t.type === 'error' ? 'bg-red-500' : 'bg-[#1f5e1f]'}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
