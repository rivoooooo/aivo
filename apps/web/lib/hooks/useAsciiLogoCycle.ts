"use client"

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react"

interface UseAsciiLogoCycleOptions {
  logos: string[]
  charDelay?: number
  clearDelay?: number
}

function getReducedMotionStore() {
  return {
    subscribe() {
      return () => {}
    },
    getSnapshot() {
      if (typeof window === 'undefined') return true
      return !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    },
    getServerSnapshot() {
      return true
    }
  }
}

const reducedMotionStore = getReducedMotionStore()

function useReducedMotionSync(): boolean {
  return useSyncExternalStore(
    reducedMotionStore.subscribe,
    reducedMotionStore.getSnapshot,
    reducedMotionStore.getServerSnapshot
  )
}

export function useAsciiLogoCycle({
  logos,
  charDelay = 30,
  clearDelay = 2000,
}: UseAsciiLogoCycleOptions) {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const shouldAnimate = useReducedMotionSync()

  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const charIndexRef = useRef(0)
  const startTypingRef = useRef<((index: number) => void) | null>(null)

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  useEffect(() => {
    const startTyping = (logoIndex: number) => {
      if (logos.length === 0) return

      const currentLogo = logos[logoIndex]
      charIndexRef.current = 0
      setDisplayedText("")

      const typeNextChar = () => {
        if (charIndexRef.current < currentLogo.length) {
          charIndexRef.current += 1
          setDisplayedText(currentLogo.slice(0, charIndexRef.current))

          const timeout = setTimeout(typeNextChar, charDelay)
          timeoutsRef.current.push(timeout)
        } else {
          const timeout = setTimeout(() => {
            setDisplayedText("")
            
            const nextIndex = (logoIndex + 1) % logos.length
            const restartTimeout = setTimeout(() => {
              if (startTypingRef.current) {
                startTypingRef.current(nextIndex)
              }
            }, charDelay)
            timeoutsRef.current.push(restartTimeout)
          }, clearDelay)
          timeoutsRef.current.push(timeout)
        }
      }

      const initialTimeout = setTimeout(typeNextChar, charDelay)
      timeoutsRef.current.push(initialTimeout)
    }

    startTypingRef.current = startTyping
  }, [logos, charDelay, clearDelay])

  useEffect(() => {
    if (logos.length === 0) return

    if (!shouldAnimate) {
      setDisplayedText(logos[0])
      return
    }

    clearAllTimeouts()
    if (startTypingRef.current) {
      startTypingRef.current(0)
    }

    return () => {
      clearAllTimeouts()
    }
  }, [logos, shouldAnimate, clearAllTimeouts])

  const reset = useCallback(() => {
    setCurrentLogoIndex(0)
    setDisplayedText("")
    charIndexRef.current = 0
    clearAllTimeouts()
    if (startTypingRef.current) {
      startTypingRef.current(0)
    }
  }, [clearAllTimeouts])

  return {
    displayedText,
    currentLogoIndex,
    reset,
  }
}
