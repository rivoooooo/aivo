"use client"

interface CharacterDividerProps {
  char?: string
  count?: number
  className?: string
}

export function CharacterDivider({
  char = "─",
  count = 200,
  className = "",
}: CharacterDividerProps) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <span className="text-muted-foreground select-none">
        {char.repeat(count)}
      </span>
    </div>
  )
}
