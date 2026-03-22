"use client"

import { useSyncExternalStore } from "react"

function getReducedMotionStore() {
  return {
    subscribe() {
      return () => {}
    },
    getSnapshot() {
      if (typeof window === 'undefined') return true
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    },
    getServerSnapshot() {
      return false
    }
  }
}

const reducedMotionStore = getReducedMotionStore()

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    reducedMotionStore.subscribe,
    reducedMotionStore.getSnapshot,
    reducedMotionStore.getServerSnapshot
  )
}
