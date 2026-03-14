"use client"

import { FadeInSection } from "./FadeInSection"
import { TypewriterText } from "./TypewriterText"
import { JsonHighlight } from "./JsonHighlight"
import { useInView } from "@/lib/hooks/useInView"

interface StackSectionProps {
  title: string
  packageJson: string
}

export function StackSection({ packageJson }: StackSectionProps) {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.15 })

  return (
    <section ref={ref} className="py-16">
      <FadeInSection>
        <div className="text-sm text-primary mb-8 font-mono font-bold">
          {isInView ? (
            <TypewriterText text={`> cat package.json`} charDelay={18} />
          ) : (
            <span>&nbsp;</span>
          )}
        </div>

        <JsonHighlight content={packageJson} />
      </FadeInSection>
    </section>
  )
}
