"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useLocale } from "next-intl"
import { useTypewriter } from "@/lib/hooks/useTypewriter"
import { TypewriterText } from "@/components/TypewriterText"
import { AsciiLogoDisplay } from "@/components/AsciiLogoDisplay"

const HERO_LINES = [
  "> AI-Era_",
  "booting developer training system...",
  "[✓] frontend challenge engine",
  "[✓] ai-assisted coding",
  "[✓] debugging arena",
  "[✓] skill progression",
  "system online",
]

const SUBTITLE_TEXTS = [
  "Web Dev Skills",
  "Frontend Challenges",
  "AI Coding",
  "Debugging Arena",
]

export function HeroSection() {
  const locale = useLocale()
  const { displayedLines, isComplete } = useTypewriter({
    lines: HERO_LINES,
    charDelay: 30,
    lineDelay: 350,
  })

  const heroRef = useRef<HTMLDivElement>(null)
  const [isScrolledPast, setIsScrolledPast] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom
        setIsScrolledPast(heroBottom < 0)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <h1 className="sr-only">
        AI-Era — Gamified Web Developer Training: Frontend Challenges & AI Coding
      </h1>
      
      <div 
        ref={heroRef}
        className="flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-center p-4 md:p-8 box-border"
      >
        <div className="w-full md:w-[55%] min-h-[300px] md:min-h-[400px] max-h-[60vh] md:max-h-[70vh] overflow-hidden flex flex-col">
          <div className="mb-6 flex-shrink-0">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-glow tracking-tight">
              <TypewriterText
                texts={["AI-Era", ...SUBTITLE_TEXTS]}
                typingSpeed={120}
                deletingSpeed={80}
                pauseDuration={5000}
                prefix=""
                suffix="_"
              />
              <span className="animate-blink text-2xl md:text-3xl ml-1">█</span>
            </h2>
          </div>

          <div className="font-mono text-sm md:text-base leading-relaxed whitespace-pre flex-1 overflow-y-auto">
            {displayedLines.map((line, index) => (
              <div key={index}>
                {line}
                {index === displayedLines.length - 1 && isComplete && (
                  <span className="animate-blink inline-block ml-1">█</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-[45%] md:pt-2 md:flex md:justify-center md:items-start">
          <AsciiLogoDisplay />
        </div>
      </div>

      <div 
        className={`
          fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border
          transition-all duration-300 ease-in-out
          ${isScrolledPast 
            ? "translate-y-0 opacity-100" 
            : "translate-y-full opacity-0"
          }
        `}
      >
        <div className="flex justify-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={`/${locale}/challenge`}
              className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Challenges
            </Link>
            <Link
              href={`/${locale}/challenge`}
              className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium rounded-lg border-2 border-border bg-transparent hover:bg-muted hover:border-muted-foreground transition-colors"
            >
              Explore Modules
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
