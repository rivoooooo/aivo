'use client'

import * as React from 'react'

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'error'
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { ...toast, id }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <Toaster toasts={toasts} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function Toaster({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-lg border p-4 shadow-lg animate-in slide-in-from-bottom-5 fade-in duration-200 ${
            t.variant === 'error'
              ? 'bg-destructive/10 border-destructive text-destructive'
              : t.variant === 'success'
                ? 'bg-green-500/10 border-green-500 text-green-600 dark:text-green-400'
                : 'bg-background border-border'
          }`}
        >
          {t.title && <div className="font-medium">{t.title}</div>}
          {t.description && <div className="text-sm opacity-80">{t.description}</div>}
        </div>
      ))}
    </div>
  )
}
