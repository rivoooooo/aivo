"use client"

import { useAsciiLogoCycle } from "@/lib/hooks/useAsciiLogoCycle"
import { asciiLogoList } from "@/data/asciiLogo"

interface AsciiLogoDisplayProps {
  className?: string
}

export function AsciiLogoDisplay({ className = "" }: AsciiLogoDisplayProps) {
  const { displayedText } = useAsciiLogoCycle({
    logos: asciiLogoList,
    charDelay: 30,
    clearDelay: 2000,
  })

  return (
    <div className={className}>
      <pre className="text-[12px] leading-[1.4] text-primary font-mono overflow-x-auto whitespace-pre">
        {displayedText}
      </pre>
    </div>
  )
}
