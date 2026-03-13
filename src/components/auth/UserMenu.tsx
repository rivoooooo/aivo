'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import { useSession } from '@/lib/hooks/use-session'

interface UserMenuProps {
  user: {
    name: string | null
    email: string
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const t = useTranslations('auth')
  const locale = useLocale()
  const { signOut } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const handleLogout = async () => {
    await signOut()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium outline-button"
        aria-expanded={isOpen}
      >
        <span>{user.name || user.email.split('@')[0]}</span>
        <ChevronDown 
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 min-w-[200px] terminal-window animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="terminal-header">
            <span className="terminal-title">USER</span>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <div className="text-sm font-medium">{user.name || 'User'}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
            
            <div className="border-t border-border" />
            
            <nav className="space-y-1">
              <Link
                href={`/${locale}/profile`}
                className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors py-1"
                onClick={() => setIsOpen(false)}
              >
                &gt; {t('profile')}
              </Link>
              <Link
                href={`/${locale}/challenge`}
                className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors py-1"
                onClick={() => setIsOpen(false)}
              >
                &gt; {t('myChallenges')}
              </Link>
              <Link
                href={`/${locale}/settings`}
                className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors py-1"
                onClick={() => setIsOpen(false)}
              >
                &gt; {t('settings')}
              </Link>
            </nav>
            
            <div className="border-t border-border" />
            
            <button
              onClick={handleLogout}
              className="flex items-center text-xs text-destructive hover:text-destructive/80 transition-colors py-1 w-full text-left"
            >
              &gt; {t('logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
