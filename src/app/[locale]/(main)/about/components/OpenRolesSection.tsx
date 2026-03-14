"use client"

import { FadeInSection } from "./FadeInSection"
import { useInView } from "@/lib/hooks/useInView"

interface OpenRolesSectionProps {
  title: string
  description: string[]
  needsLabel: string
  needs: string[]
  ctaText: string
  ctaLink: string
}

export function OpenRolesSection({
  title,
  description,
  needsLabel,
  needs,
  ctaText,
  ctaLink,
}: OpenRolesSectionProps) {
  const [ref] = useInView<HTMLElement>({ threshold: 0.15 })

  return (
    <section ref={ref} className="py-16">
      <FadeInSection>
        <div className="border border-dashed border-border p-8">
          <div className="text-xs font-bold text-primary font-mono mb-6">
            ─── {title} ───
          </div>

          <div className="space-y-4 text-sm text-foreground font-mono leading-[1.9] mb-6">
            {description.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>

          <div className="text-sm text-primary font-mono mb-6">
            {needsLabel} = [{needs.join(", ")}]
          </div>

          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-secondary hover:underline font-mono"
          >
            → {ctaText}
          </a>
        </div>
      </FadeInSection>
    </section>
  )
}
