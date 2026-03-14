"use client"

interface MemberCardProps {
  name: string
  role: string
  handle: string
  comment?: string[]
  index?: number
}

export function MemberCard({
  name,
  role,
  handle,
  comment,
  index = 0,
}: MemberCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className="border border-border bg-card p-4 transition-all duration-120 hover:border-primary hover:-translate-y-0.5"
      style={{
        animationDelay: `${index * 40}ms`,
      }}
    >
      {/* Avatar - Initials */}
      <div className="mb-3">
        <div className="w-12 h-12 border border-border bg-muted flex items-center justify-center">
          <span className="text-sm font-bold text-primary font-mono">
            {initials}
          </span>
        </div>
      </div>

      {/* Name */}
      <div className="text-[13px] font-bold text-foreground font-mono mb-1">
        {name}
      </div>

      {/* Role */}
      <div className="text-[11px] text-muted-foreground font-mono mb-3">
        {role}
      </div>

      {/* Comment */}
      {comment && comment.length > 0 && (
        <div className="space-y-1 mb-3">
          {comment.map((line, i) => (
            <div
              key={i}
              className="text-[11px] text-muted-foreground italic font-mono"
            >
              {"// "}{line}
            </div>
          ))}
        </div>
      )}

      {/* Handle */}
      <a
        href={`https://github.com/${handle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] text-secondary hover:underline font-mono"
      >
        @{handle}
      </a>
    </div>
  )
}
