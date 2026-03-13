"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface UseAsciiLogoCycleOptions {
  logos: string[]
  charDelay?: number
  clearDelay?: number
}

export function useAsciiLogoCycle({
  logos,
  charDelay = 30,
  clearDelay = 2000,
}: UseAsciiLogoCycleOptions) {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [shouldAnimate, setShouldAnimate] = useState(true)

  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const charIndexRef = useRef(0)

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setShouldAnimate(!mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldAnimate(!e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const startTyping = useCallback((logoIndex: number) => {
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
            startTyping(nextIndex)
          }, charDelay)
          timeoutsRef.current.push(restartTimeout)
        }, clearDelay)
        timeoutsRef.current.push(timeout)
      }
    }

    const initialTimeout = setTimeout(typeNextChar, charDelay)
    timeoutsRef.current.push(initialTimeout)
  }, [logos, charDelay, clearDelay])

  useEffect(() => {
    if (logos.length === 0) return

    if (!shouldAnimate) {
      setDisplayedText(logos[0])
      return
    }

    clearAllTimeouts()
    startTyping(0)

    return () => {
      clearAllTimeouts()
    }
  }, [logos, shouldAnimate, clearAllTimeouts, startTyping])

  const reset = useCallback(() => {
    setCurrentLogoIndex(0)
    setDisplayedText("")
    charIndexRef.current = 0
    clearAllTimeouts()
    startTyping(0)
  }, [clearAllTimeouts, startTyping])

  return {
    displayedText,
    currentLogoIndex,
    reset,
  }
}
