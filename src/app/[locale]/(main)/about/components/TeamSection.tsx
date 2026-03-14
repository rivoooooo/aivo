"use client"

import { FadeInSection } from "./FadeInSection"
import { TypewriterText } from "./TypewriterText"
import { MemberCard } from "./MemberCard"
import { useInView } from "@/lib/hooks/useInView"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

interface TeamMember {
  name: string
  role: string
  handle: string
  comment?: string[]
  avatarUrl?: string
}

interface TeamSectionProps {
  title: string
  subtitle: string[]
  members: TeamMember[]
}

export function TeamSection({ subtitle, members }: TeamSectionProps) {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.15 })
  const prefersReducedMotion = useReducedMotion()

  return (
    <section ref={ref} className="py-16">
      <FadeInSection>
        <div className="text-sm text-primary mb-2 font-mono font-bold">
          {isInView ? (
            <TypewriterText text={`> cat TEAM.config`} charDelay={18} />
          ) : (
            <span>&nbsp;</span>
          )}
        </div>

        <div className="space-y-1 mb-8">
          {subtitle.map((line, index) => (
            <div
              key={index}
              className="text-[11px] text-muted-foreground italic font-mono"
            >
              {"// "}{line}
            </div>
          ))}
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          style={{
            opacity: isInView || prefersReducedMotion ? 1 : 0,
            transform:
              isInView || prefersReducedMotion
                ? "translateY(0)"
                : "translateY(12px)",
            transition: "opacity 400ms ease-out, transform 400ms ease-out",
          }}
        >
          {members.map((member, index) => (
            <div
              key={member.handle}
              style={{
                opacity: isInView || prefersReducedMotion ? 1 : 0,
                transform:
                  isInView || prefersReducedMotion
                    ? "translateY(0)"
                    : "translateY(12px)",
                transition: `opacity 400ms ease-out ${index * 40}ms, transform 400ms ease-out ${index * 40}ms`,
              }}
            >
              <MemberCard {...member} index={index} />
            </div>
          ))}
        </div>
      </FadeInSection>
    </section>
  )
}
