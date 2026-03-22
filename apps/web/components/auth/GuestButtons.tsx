'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

interface GuestButtonsProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

export function GuestButtons({ onLoginClick, onRegisterClick }: GuestButtonsProps) {
  const t = useTranslations('auth')

  return (
    <>
      <Button variant="outline" size="default" onClick={onLoginClick}>
        {t('login')}
      </Button>
      <Button variant="default" size="default" onClick={onRegisterClick}>
        {t('register')}
      </Button>
    </>
  )
}
