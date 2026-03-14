"use client"

import { useState, useEffect, useRef } from "react"

interface UseWordFadeOptions {
  words: string[]
  stagger?: number
  delay?: number
}

export function useWordFade({
  words,
  stagger = 80,
  delay = 0,
}: UseWordFadeOptions) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [shouldAnimate, setShouldAnimate] = useState(true)
  const startedRef = useRef(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setShouldAnimate(!mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldAnimate(!e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    if (!shouldAnimate) {
      setVisibleCount(words.length)
      return
    }

    const timeouts: NodeJS.Timeout[] = []

    words.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleCount(index + 1)
      }, delay + index * stagger)
      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [words, stagger, delay, shouldAnimate])

  return { visibleCount, shouldAnimate }
}
