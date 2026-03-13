'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/hooks/use-session'
import { GuestButtons } from './GuestButtons'
import { UserMenu } from './UserMenu'
import { LoginModal } from './LoginModal'
import { RegisterModal } from './RegisterModal'

export function AuthSection() {
  const { session, loading } = useSession()
  const [mounted, setMounted] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="flex items-center w-[140px]" />
  }

  if (loading) {
    return <div className="flex items-center w-[140px]" />
  }

  const handleLoginClick = () => {
    setShowRegister(false)
    setLoginOpen(true)
  }

  const handleRegisterClick = () => {
    setShowRegister(true)
    setRegisterOpen(true)
  }

  const handleCloseModals = () => {
    setLoginOpen(false)
    setRegisterOpen(false)
  }

  const handleSwitchToRegister = () => {
    setLoginOpen(false)
    setShowRegister(true)
    setRegisterOpen(true)
  }

  const handleSwitchToLogin = () => {
    setRegisterOpen(false)
    setShowRegister(false)
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
