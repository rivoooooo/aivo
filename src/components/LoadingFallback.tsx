'use client'

export function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-primary font-mono text-sm animate-pulse">
        {'> loading...'}
      </div>
    </div>
  )
}
