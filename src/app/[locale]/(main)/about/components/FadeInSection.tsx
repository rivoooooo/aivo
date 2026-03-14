"use client"

import { useInView } from "@/lib/hooks/useInView"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"
import { ReactNode } from "react"

interface FadeInSectionProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function FadeInSection({
  children,
  className = "",
  delay = 0,
}: FadeInSectionProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.15 })
  const prefersReducedMotion = useReducedMotion()

  const animationStyle = prefersReducedMotion
    ? {}
    : {
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 400ms ease-out ${delay}ms, transform 400ms ease-out ${delay}ms`,
      }

  return (
    <div
      ref={ref}
      className={className}
      style={animationStyle}
    >
      {children}
    </div>
  )
}
