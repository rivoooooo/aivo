'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/hooks/use-session'
import { useToast } from '@/components/ui/toast'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const t = useTranslations('auth')
  const { signUp } = useSession()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setName('')
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

  const getErrorKey = (errorMsg: string): string => {
    const errorMap: Record<string, string> = {
      'username already taken': 'usernameTaken',
      'password must be at least 8 characters': 'passwordTooShort',
      'invalid email address': 'emailInvalid',
      'email already in use': 'emailInvalid',
    }
    return errorMap[errorMsg] || 'invalidCredentials'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 8) {
      setError('password must be at least 8 characters')
      toast({ title: 'Registration failed', description: 'Password must be at least 8 characters', variant: 'error' })
      setLoading(false)
      return
    }

    const result = await signUp(name, email, password)

    if (result.error) {
      setError(result.error)
      toast({ title: 'Registration failed', description: result.error, variant: 'error' })
    } else {
      toast({ title: 'Registration successful', description: 'Welcome to AI-Era!', variant: 'success' })
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
            <span className="terminal-title">{t('modal.registerTitle')}</span>
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
                {t('modal.username')}
              </label>
              <div className="terminal-input-wrapper">
                <span className="terminal-prefix">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="terminal-input"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="terminal-label">
                {t('modal.email')}
              </label>
              <div className="terminal-input-wrapper">
                <span className="terminal-prefix">&gt;</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="terminal-input"
                  required
                  autoComplete="email"
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
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {error && (
              <div className="terminal-error">
                [ERR] {t(`modal.errors.${getErrorKey(error)}`) || error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? '...' : t('register').toUpperCase()}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              {t('modal.haveAccount')}{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary hover:underline"
              >
                {t('login')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
