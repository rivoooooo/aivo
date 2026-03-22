'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface SessionUser {
  id: string
  email: string
  name: string | null
  image: string | null
}

interface Session {
  user: SessionUser
  expires: string
}

interface BetterAuthSession {
  session: {
    token: string
    expiresAt: string
    userId: string
  }
  user: SessionUser
}

interface SessionContextType {
  session: Session | null
  loading: boolean
  refreshSession: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = async () => {
    try {
      const res = await fetch('/api/auth/get-session', {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        if (data.session) {
          const betterAuthSession = data.session as BetterAuthSession
          setSession({
            user: betterAuthSession.user,
            expires: betterAuthSession.session.expiresAt,
          })
        } else {
          setSession(null)
        }
      } else {
        setSession(null)
      }
    } catch {
      setSession(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        await refreshSession()
        return {}
      } else {
        const data = await res.json()
        return { error: data.message || 'invalid credentials' }
      }
    } catch {
      return { error: 'network error' }
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/sign-up/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      })

      if (res.ok) {
        await refreshSession()
        return {}
      } else {
        const data = await res.json()
        return { error: data.message || 'registration failed' }
      }
    } catch {
      return { error: 'network error' }
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
      })
      setSession(null)
    } catch {
      console.error('sign out error')
    }
  }

  return (
    <SessionContext.Provider
      value={{ session, loading, refreshSession, signIn, signUp, signOut }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
