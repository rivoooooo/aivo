"use client"

import { FadeInSection } from "./FadeInSection"
import { CharacterDivider } from "./CharacterDivider"
import { useInView } from "@/lib/hooks/useInView"

interface FounderSectionProps {
  name: string
  role: string
  handle: string
  comment: string[]
}

export function FounderSection({
  name,
  role,
  handle,
  comment,
}: FounderSectionProps) {
  const [ref] = useInView<HTMLElement>({ threshold: 0.15 })

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <section ref={ref} className="py-16">
      <FadeInSection>
        <CharacterDivider className="mb-8" />

        <div className="border border-border bg-card p-8">
          <div className="flex gap-6">
            {/* Avatar - Initials */}
            <div className="shrink-0">
              <div className="w-16 h-16 border-2 border-primary bg-muted flex items-center justify-center">
                <span className="text-lg font-bold text-primary font-mono">
                  {initials}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="text-sm font-bold text-foreground font-mono mb-1">
                {name}
              </div>
              <div className="text-xs text-muted-foreground font-mono mb-4">
                {role}
              </div>

              <div className="space-y-1 mb-4">
                {comment.map((line, index) => (
                  <div
                    key={index}
                    className="text-[13px] text-muted-foreground italic font-mono"
                  >
                    {"// "}{line}
                  </div>
                ))}
              </div>

              <a
                href={`https://github.com/${handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-secondary hover:underline font-mono"
              >
                @{handle}
              </a>
            </div>
          </div>
        </div>

        <CharacterDivider className="mt-8" />
      </FadeInSection>
    </section>
  )
}
