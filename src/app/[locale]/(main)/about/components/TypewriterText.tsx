"use client"

import { useState, useEffect, useRef } from "react"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

interface TypewriterTextProps {
  text: string
  charDelay?: number
  className?: string
  onComplete?: () => void
}

export function TypewriterText({
  text,
  charDelay = 18,
  className = "",
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const prefersReducedMotion = useReducedMotion()
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    if (prefersReducedMotion) {
      setDisplayedText(text)
      onComplete?.()
      return
    }

    let currentIndex = 0
    const timeouts: NodeJS.Timeout[] = []

    const typeNextChar = () => {
      if (currentIndex >= text.length) {
        onComplete?.()
        return
      }

      setDisplayedText(text.substring(0, currentIndex + 1))
      currentIndex++

      const timeout = setTimeout(typeNextChar, charDelay)
      timeouts.push(timeout)
    }

    const initialTimeout = setTimeout(typeNextChar, charDelay)
    timeouts.push(initialTimeout)

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [text, charDelay, prefersReducedMotion, onComplete])

  return <span className={className}>{displayedText}</span>
}
