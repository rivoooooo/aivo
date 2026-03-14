"use client"

import { FadeInSection } from "./FadeInSection"
import { TypewriterText } from "./TypewriterText"
import { useInView } from "@/lib/hooks/useInView"
import { useState } from "react"

interface ContactLink {
  label: string
  url: string
}

interface ContactSectionProps {
  title: string
  links: ContactLink[]
  email: string
  okMessage: string
  newsletterTitle: string
  newsletterDescription: string[]
  newsletterPlaceholder: string
  newsletterButton: string
}

export function ContactSection({
  title,
  links,
  email,
  okMessage,
  newsletterDescription,
  newsletterPlaceholder,
  newsletterButton,
}: ContactSectionProps) {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.15 })
  const [emailInput, setEmailInput] = useState("")

  return (
    <section ref={ref} className="py-16">
      <FadeInSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Shell Script */}
          <div>
            <div className="text-sm text-primary mb-6 font-mono font-bold">
              {isInView ? (
                <TypewriterText text={`> ${title}`} charDelay={18} />
              ) : (
                <span>&nbsp;</span>
              )}
            </div>

            <div className="font-mono text-sm space-y-2">
              <div className="text-muted-foreground italic">#!/bin/bash</div>
              <div>&nbsp;</div>

              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:bg-primary/5 transition-colors group"
                >
                  <span className="text-muted-foreground"># {link.label}</span>
                  <br />
                  <span className="text-success">
                    open <span className="text-secondary">{link.url}</span>
                  </span>
                </a>
              ))}

              <div>&nbsp;</div>
              <div className="text-muted-foreground"># Email (serious inquiries)</div>
              <div>
                echo <span className="text-secondary">&ldquo;{email}&rdquo;</span>
              </div>
              <div>&nbsp;</div>
              <div className="text-primary font-bold">echo &ldquo;{okMessage}&rdquo;</div>
            </div>
          </div>

          {/* Right Column - Newsletter */}
          <div>
            <div className="text-sm text-primary mb-4 font-mono font-bold">
              {`> subscribe --monthly`}
            </div>

            <div className="space-y-1 mb-6">
              {newsletterDescription.map((line, index) => (
                <p key={index} className="text-[13px] text-muted-foreground font-mono">
                  {line}
                </p>
              ))}
            </div>

            <div className="flex gap-4">
              <input
                type="email"
                placeholder={newsletterPlaceholder}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 bg-transparent border-0 border-b border-border rounded-none px-0 py-2 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground text-xs font-mono hover:bg-primary/90 transition-colors">
                {newsletterButton}
              </button>
            </div>
          </div>
        </div>
      </FadeInSection>
    </section>
  )
}
