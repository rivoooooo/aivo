"use client"

import { useWordFade } from "@/lib/hooks/useWordFade"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"
import { CharacterDivider } from "./CharacterDivider"

interface HeroSectionProps {
  title: string[]
  subtitle: string[]
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  const titleWords = title.join(" ").split(" ")
  const { visibleCount: visibleTitleCount, shouldAnimate } = useWordFade({
    words: titleWords,
    stagger: 80,
    delay: 200,
  })
  const prefersReducedMotion = useReducedMotion()

  // Calculate if subtitle should be visible based on animation state
  const totalTitleAnimationTime = titleWords.length * 80
  const subtitleDelay = 400
  // If reduced motion or animation is effectively complete, show subtitle
  const showSubtitle = prefersReducedMotion || !shouldAnimate || visibleTitleCount >= titleWords.length

  return (
    <section className="min-h-[50vh] flex flex-col justify-center py-16">
      <div className="text-sm text-muted-foreground mb-4 font-mono">
        {`> cat ABOUT.md`}
      </div>

      <CharacterDivider className="mb-8" />

      <h1 className="text-primary font-bold mb-8" style={{ fontSize: "clamp(28px, 5vw, 48px)", lineHeight: 1.2 }}>
        {titleWords.map((word, index) => (
          <span
            key={index}
            className="inline-block mr-[0.3em] transition-opacity duration-300"
            style={{
              opacity: index < visibleTitleCount ? 1 : 0,
            }}
          >
            {word}
          </span>
        ))}
      </h1>

      <CharacterDivider className="mb-8" />

      <div
        className="transition-opacity duration-500"
        style={{
          opacity: showSubtitle ? 1 : 0,
          transitionDelay: showSubtitle ? `${totalTitleAnimationTime + subtitleDelay}ms` : '0ms',
        }}
      >
        {subtitle.map((line, index) => (
          <p
            key={index}
            className="text-muted-foreground text-sm leading-8 font-mono pl-4"
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  )
}
