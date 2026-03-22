'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/hooks/use-session'
import { useToast } from '@/components/ui/toast'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const t = useTranslations('auth')
  const { signIn } = useSession()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setPassword('')
      setError('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn(email, password)

    if (result.error) {
      setError(result.error)
      toast({ title: 'Login failed', description: result.error, variant: 'error' })
    } else {
      toast({ title: 'Login successful', description: `Welcome back!`, variant: 'success' })
      onClose()
    }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-[440px] min-w-[360px] mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-title">{t('modal.loginTitle')}</span>
            <button
              onClick={onClose}
              className="terminal-close"
              aria-label="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="terminal-label">
                {t('modal.usernameOrEmail')}
              </label>
              <div className="terminal-input-wrapper">
                <span className="terminal-prefix">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="terminal-input"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="terminal-label">
                {t('modal.password')}
              </label>
              <div className="terminal-input-wrapper">
                <span className="terminal-prefix">&gt;</span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="terminal-input"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="terminal-error">
                [ERR] {t(`modal.errors.${error}`) || error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? '...' : t('login').toUpperCase()}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              {t('modal.noAccount')}{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-primary hover:underline"
              >
                {t('register')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
