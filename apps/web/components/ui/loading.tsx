import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div className={cn("animate-spin", sizeClasses[size], className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="text-[var(--primary)]"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" />
    </div>
  );
}

interface LoadingPageProps {
  text?: string;
}

export function LoadingPage({ text = 'Loading...' }: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8 flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-[var(--primary)] animate-pulse">{text}</p>
    </div>
  );
}

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="md" />
        <p className="text-sm text-[var(--muted-foreground)]">Loading...</p>
      </div>
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse bg-[var(--muted)] rounded", className)} />
  );
}

export function LoadingSkeletonCard({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("card-terminal", className)}>
      <div className="card-terminal-header">
        <LoadingSkeleton className="h-4 w-24" />
      </div>
      <div className="p-4 space-y-3">
        <LoadingSkeleton className="h-6 w-3/4" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
