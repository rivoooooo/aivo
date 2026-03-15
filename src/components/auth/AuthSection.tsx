'use client'

import { useState, useSyncExternalStore } from 'react'
import { useSession } from '@/lib/hooks/use-session'
import { GuestButtons } from './GuestButtons'
import { UserMenu } from './UserMenu'
import { LoginModal } from './LoginModal'
import { RegisterModal } from './RegisterModal'

function getMountedStore() {
  return {
    subscribe() {
      return () => {}
    },
    getSnapshot() {
      return true
    },
    getServerSnapshot() {
      return false
    }
  }
}

const mountedStore = getMountedStore()

export function AuthSection() {
  const { session, loading } = useSession()
  const mounted = useSyncExternalStore(
    mountedStore.subscribe,
    mountedStore.getSnapshot,
    mountedStore.getServerSnapshot
  )
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  if (!mounted) {
    return <div className="flex items-center w-[140px]" />
  }

  if (loading) {
    return <div className="flex items-center w-[140px]" />
  }

  const handleLoginClick = () => {
    setLoginOpen(true)
  }

  const handleRegisterClick = () => {
    setRegisterOpen(true)
  }

  const handleCloseModals = () => {
    setLoginOpen(false)
    setRegisterOpen(false)
  }

  const handleSwitchToRegister = () => {
    setLoginOpen(false)
    setRegisterOpen(true)
  }

  const handleSwitchToLogin = () => {
    setRegisterOpen(false)
    setLoginOpen(true)
  }

  return (
    <div className="flex items-center">
      <>
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <GuestButtons 
            onLoginClick={handleLoginClick} 
            onRegisterClick={handleRegisterClick} 
          />
        )}

        <LoginModal
          isOpen={loginOpen}
          onClose={handleCloseModals}
          onSwitchToRegister={handleSwitchToRegister}
        />

        <RegisterModal
          isOpen={registerOpen}
          onClose={handleCloseModals}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </>
    </div>
  )
}
