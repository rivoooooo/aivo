"use client"

import { useState, useEffect, useRef, useSyncExternalStore } from "react"
import Link from "next/link"
import { useLocale } from "next-intl"
import { useTypewriter } from "@/lib/hooks/useTypewriter"
import { AsciiLogoDisplay } from "@/components/AsciiLogoDisplay"
import { TerminalEmulator } from "@/components/ui/TerminalEmulator"

const HERO_LINES = [
  "> AI-Era_",
  "booting developer training system...",
  "[✓] frontend challenge engine",
  "[✓] ai-assisted coding",
  "[✓] debugging arena",
  "[✓] skill progression",
  "system online",
]

const SEO_TEXT =
  "AI-Era is a gamified platform for training real web developer skills in the age of AI."

function getMountedStore() {
  return {
    subscribe() {
      return () => {}
    },
    getSnapshot() {
      return true
    },
    getServerSnapshot() {
      return false
    }
  }
}

const mountedStore = getMountedStore()

export function HeroSection() {
  const locale = useLocale()
  const { displayedLines, isComplete } = useTypewriter({
    lines: HERO_LINES,
    charDelay: 30,
    lineDelay: 350,
  })

  const isClient = useSyncExternalStore(
    mountedStore.subscribe,
    mountedStore.getSnapshot,
    mountedStore.getServerSnapshot
  )
  const [showStaticLayer, setShowStaticLayer] = useState(false)
  const typingLayerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isComplete && typingLayerRef.current) {
      typingLayerRef.current.style.opacity = "0"

      const showStaticTimeout = setTimeout(() => {
        setShowStaticLayer(true)
      }, 300)

      return () => clearTimeout(showStaticTimeout)
    }
  }, [isComplete])

  return (
    <>
      <h1 className="sr-only">
        AI-Era — Gamified Web Developer Training: Frontend Challenges & AI Coding
      </h1>

      <div
        ref={heroRef}
        className="flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-center p-4 md:p-8 box-border"
      >
        <div className="w-full md:w-[55%] min-h-[300px] md:min-h-[400px] max-h-[60vh] md:max-h-[70vh] overflow-hidden flex flex-col relative">
          <div className="mb-6 flex-shrink-0">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-glow tracking-tight">
              AI-Era
              <span className="animate-blink text-2xl md:text-3xl ml-1 text-primary">█</span>
            </h2>
          </div>

          <div className="font-mono text-sm md:text-base leading-relaxed whitespace-pre flex-1 overflow-y-auto relative">
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{ opacity: showStaticLayer ? 1 : 0 }}
              aria-hidden="true"
            >
              {HERO_LINES.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>

            <div
              ref={typingLayerRef}
              className="absolute inset-0 transition-opacity duration-300"
              style={{ opacity: 1 }}
            >
              {HERO_LINES.map((line, index) => (
                <div key={index}>
                  {index < displayedLines.length ? displayedLines[index] : ""}
                  {index === displayedLines.length - 1 && !isComplete && (
                    <span className="animate-blink inline-block ml-1">█</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-muted-foreground text-sm md:text-base">
            {SEO_TEXT}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
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

        <div className="w-full md:w-[45%] md:pt-2 md:flex md:justify-center md:items-start">
          <AsciiLogoDisplay />
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12 px-4 md:px-8">
        <TerminalEmulator isVisible={isClient} />
      </div>
    </>
  )
}
