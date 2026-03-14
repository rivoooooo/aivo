'use client'

import { useState, useEffect, useSyncExternalStore, useCallback } from 'react'
import { THEME_COLORS, type ThemeColorId } from '@/lib/theme'

function getThemeColorStore() {
  const callbacks = new Set<() => void>()
  
  return {
    subscribe(callback: () => void) {
      callbacks.add(callback)
      return () => callbacks.delete(callback)
    },
    getSnapshot() {
      if (typeof window === 'undefined') return 'phosphor'
      return document.documentElement.getAttribute('data-theme-color') || 'phosphor'
    },
    getServerSnapshot() {
      return 'phosphor'
    }
  }
}

const themeColorStore = getThemeColorStore()

function useThemeColor() {
  return useSyncExternalStore(
    themeColorStore.subscribe,
    themeColorStore.getSnapshot,
    themeColorStore.getServerSnapshot
  ) as ThemeColorId
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0'
}

const updateScanlineColor = (scanline: HTMLElement, themeColor: ThemeColorId) => {
  const theme = THEME_COLORS.find(t => t.id === themeColor)
  if (!theme) return

  const isDark = document.documentElement.classList.contains('dark')
  const color = isDark 
    ? `rgba(${hexToRgb(theme.dot)}, 0.12)`
    : `rgba(${hexToRgb(theme.dot)}, 0.06)`

  scanline.style.background = `repeating-linear-gradient(
    0deg,
    ${color},
    ${color} 1px,
    transparent 1px,
    transparent 2px
  )`
}

const createScanline = (themeColor: ThemeColorId) => {
  const existing = document.getElementById('global-scanlines')
  if (!existing) {
    const scanline = document.createElement('div')
    scanline.className = 'scanlines'
    scanline.id = 'global-scanlines'
    document.body.appendChild(scanline)
    updateScanlineColor(scanline, themeColor)
  }
}

const removeScanline = () => {
  const existing = document.getElementById('global-scanlines')
  if (existing) {
    existing.remove()
  }
}

const getInitialEnabled = () => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('scanline-enabled') === 'true'
}

export function ScanlineToggle() {
  const [mounted, setMounted] = useState(false)
  const [enabled, setEnabled] = useState(getInitialEnabled)
  const currentThemeColor = useThemeColor()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    localStorage.setItem('scanline-enabled', String(enabled))
    
    if (enabled) {
      createScanline(currentThemeColor)
    } else {
      removeScanline()
    }
  }, [enabled, mounted, currentThemeColor])

  useEffect(() => {
    if (!mounted || !enabled) return

    const scanline = document.getElementById('global-scanlines')
    if (scanline) {
      updateScanlineColor(scanline, currentThemeColor)
    }
  }, [currentThemeColor, enabled, mounted])

  useEffect(() => {
    if (!mounted || !enabled) return

    const observer = new MutationObserver(() => {
      const scanline = document.getElementById('global-scanlines')
      if (scanline) {
        updateScanlineColor(scanline, currentThemeColor)
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme-color', 'class']
    })

    return () => observer.disconnect()
  }, [enabled, mounted, currentThemeColor])

  const handleToggle = useCallback(() => {
    setEnabled(v => !v)
  }, [])

  if (!mounted) {
    return (
      <div style={{ marginTop: '12px' }}>
        <div style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 700 }}>
          {'> scanline.config'}
        </div>
        <div style={{ fontSize: 11, marginTop: 2, color: 'var(--muted-foreground)' }}>
          {'  '}<span>●</span>{' '}DISABLED
        </div>
      </div>
    )
  }

  const statusText = enabled ? 'ENABLED' : 'DISABLED'
  const dotColor = enabled ? 'var(--primary)' : 'var(--muted-foreground)'

  return (
    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        onClick={handleToggle}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left',
          fontFamily: 'var(--font-jetbrains), JetBrains Mono, monospace',
        }}
      >
        <div style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 700 }}>
          {'> scanline.config'}
        </div>
        <div style={{ fontSize: 11, marginTop: 2, color: 'var(--muted-foreground)' }}>
          {'  '}
          <span style={{ color: dotColor }}>●</span>
          {' '}
          {statusText}
        </div>
      </button>
    </div>
  )
}
