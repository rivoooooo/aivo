"use client"

import { FadeInSection } from "./FadeInSection"
import { TypewriterText } from "./TypewriterText"
import { CharacterDivider } from "./CharacterDivider"
import { useInView } from "@/lib/hooks/useInView"

interface MissionSectionProps {
  label: string
  badge: string
  lineNumber: string
  problemText: string[]
  solutionText: string[]
}

export function MissionSection({
  label,
  badge,
  lineNumber,
  problemText,
  solutionText,
}: MissionSectionProps) {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.15 })

  return (
    <section ref={ref} className="py-16">
      <FadeInSection>
        <div className="text-sm text-primary mb-8 font-mono font-bold">
          {isInView ? (
            <TypewriterText text={`> cat MISSION.md`} charDelay={18} />
          ) : (
            <span>&nbsp;</span>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-0">
          {/* Left Column - Sticky Labels */}
          <div className="md:w-[180px] md:pr-8 md:border-r md:border-dashed md:border-border md:sticky md:top-[120px] md:self-start flex flex-row md:flex-col gap-4 md:gap-2 mb-6 md:mb-0">
            <div className="text-xs font-bold text-primary font-mono">
              ## {label}
            </div>
            <div className="text-[10px] text-success border border-dashed border-success px-1.5 py-0.5 rounded inline-block font-mono">
              [{badge}]
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              {lineNumber}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex-1 md:pl-8">
            <div className="space-y-6 text-[15px] leading-[1.9] text-foreground font-mono">
              {problemText.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <CharacterDivider char="─" count={50} className="my-8" />

            <div className="space-y-6 text-base leading-[1.9] text-foreground font-mono">
              {solutionText.map((paragraph, index) => (
                <p key={index}>
                  {paragraph.split(/(\*\*.*?\*\*)/).map((part, i) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return (
                        <span key={i} className="text-primary font-bold">
                          {part.slice(2, -2)}
                        </span>
                      )
                    }
                    return part
                  })}
                </p>
              ))}
            </div>
          </div>
        </div>
      </FadeInSection>
    </section>
  )
}
