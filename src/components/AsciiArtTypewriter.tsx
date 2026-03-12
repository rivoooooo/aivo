"use client";

import { useState, useEffect, useRef } from "react";

interface AsciiArtTypewriterProps {
  lines: string[];
  totalDuration?: number;
  className?: string;
}

export function AsciiArtTypewriter({
  lines,
  totalDuration = 2000,
  className = "",
}: AsciiArtTypewriterProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const lineRef = useRef(0);

  useEffect(() => {
    const totalChars = lines.reduce((acc, line) => acc + line.length, 0);
    const charDelay = totalDuration / totalChars;

    const interval = setInterval(() => {
      if (lineRef.current < lines.length) {
        const currentLine = lines[lineRef.current];
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          const currentDisplayed = newLines[lineRef.current] || "";
          if (currentDisplayed.length < currentLine.length) {
            newLines[lineRef.current] = currentLine + currentLine[currentDisplayed.length];
          } else {
            lineRef.current += 1;
          }
          return newLines;
        });
      } else {
        clearInterval(interval);
      }
    }, charDelay);

    return () => clearInterval(interval);
  }, [lines, totalDuration]);

  return (
    <pre className={`font-mono text-xs md:text-sm leading-none ${className}`}>
      {lines.map((line, index) => (
        <div key={index} className="whitespace-pre">
          {displayedLines[index] || ""}
        </div>
      ))}
    </pre>
  );
}
