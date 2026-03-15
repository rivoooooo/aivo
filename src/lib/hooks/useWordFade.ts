"use client"

import { useState, useEffect, useRef, useSyncExternalStore } from "react"

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
  const shouldAnimate = useReducedMotionSync()
  const startedRef = useRef(false)
  
  const initialCount = shouldAnimate ? 0 : words.length
  const [visibleCount, setVisibleCount] = useState(initialCount)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    if (!shouldAnimate) {
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
