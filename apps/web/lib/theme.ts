export type ThemeColorId = 'phosphor' | 'windows' | 'ember' | 'alarm' | 'void'

export interface ThemeColor {
  id: ThemeColorId
  name: string
  comment: string
  dot: string
}

export const THEME_COLORS: ThemeColor[] = [
  { id: 'phosphor', name: 'PHOSPHOR', comment: 'default green CRT', dot: '#33ff00' },
  { id: 'windows', name: 'WINDOWS', comment: 'retro blue monitor', dot: '#00aaff' },
  { id: 'ember', name: 'EMBER', comment: 'amber terminal 1980s', dot: '#ff8800' },
  { id: 'alarm', name: 'ALARM', comment: 'emergency system red', dot: '#ff2244' },
  { id: 'void', name: 'VOID', comment: 'cyberpunk neon purple', dot: '#cc44ff' },
]

export function applyThemeColor(themeColorId: ThemeColorId) {
  document.documentElement.setAttribute('data-theme-color', themeColorId)
  localStorage.setItem('theme-color', themeColorId)
}

export function getStoredThemeColor(): ThemeColorId {
  if (typeof window === 'undefined') return 'phosphor'
  return (localStorage.getItem('theme-color') as ThemeColorId) ?? 'phosphor'
}

export function getThemeColorById(id: ThemeColorId): ThemeColor {
  return THEME_COLORS.find(t => t.id === id) ?? THEME_COLORS[0]
}
