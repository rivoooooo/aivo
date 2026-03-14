"use client"

import { ReactElement } from "react"

interface JsonHighlightProps {
  content: string
}

export function JsonHighlight({ content }: JsonHighlightProps) {
  const highlightJson = (json: string) => {
    const lines = json.split("\n")

    return lines.map((line, lineIndex) => {
      const parts: ReactElement[] = []
      let remaining = line
      let keyIndex = 0

      // Handle indentation
      const indentMatch = remaining.match(/^(\s+)/)
      if (indentMatch) {
        parts.push(
          <span key={`indent-${lineIndex}`}>
            {indentMatch[1].replace(/\s/g, "\u00A0")}
          </span>
        )
        remaining = remaining.slice(indentMatch[0].length)
      }

      // Process the rest of the line
      while (remaining.length > 0) {
        // Check for comment
        const commentMatch = remaining.match(/^(\/\/.*$)/)
        if (commentMatch) {
          parts.push(
            <span key={`comment-${lineIndex}-${keyIndex}`} className="text-muted-foreground italic">
              {commentMatch[1]}
            </span>
          )
          remaining = ""
          break
        }

        // Check for string value (after colon)
        const stringValueMatch = remaining.match(/^(:\s*)("[^"]*")(.*)/)
        if (stringValueMatch) {
          parts.push(
            <span key={`colon-${lineIndex}-${keyIndex}`}>{stringValueMatch[1]}</span>
          )
          parts.push(
            <span key={`value-${lineIndex}-${keyIndex}`} className="text-secondary">
              {stringValueMatch[2]}
            </span>
          )
          remaining = stringValueMatch[3]
          keyIndex++
          continue
        }

        // Check for key (quoted string before colon)
        const keyMatch = remaining.match(/^"([^"]+)"(.*)/)
        if (keyMatch) {
          parts.push(
            <span key={`key-${lineIndex}-${keyIndex}`} className="text-primary">
              &ldquo;{keyMatch[1]}&rdquo;
            </span>
          )
          remaining = keyMatch[2]
          keyIndex++
          continue
        }

        // Check for braces and brackets
        const braceMatch = remaining.match(/^([{}\[\],])(.*)/)
        if (braceMatch) {
          parts.push(
            <span key={`brace-${lineIndex}-${keyIndex}`} className="text-muted-foreground">
              {braceMatch[1]}
            </span>
          )
          remaining = braceMatch[2]
          keyIndex++
          continue
        }

        // Any other character
        parts.push(
          <span key={`char-${lineIndex}-${keyIndex}`}>{remaining[0]}</span>
        )
        remaining = remaining.slice(1)
        keyIndex++
      }

      return (
        <div key={lineIndex} className="font-mono">
          {parts.length > 0 ? parts : <span>&nbsp;</span>}
        </div>
      )
    })
  }

  return (
    <pre className="bg-card border border-border p-6 overflow-x-auto text-sm">
      {highlightJson(content)}
    </pre>
  )
}
