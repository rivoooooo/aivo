'use client';

import dynamic from 'next/dynamic';
import type { Challenge, Category, User } from '@/server/lib/db/schema';
import type { UserProgress } from './lib/types';

const ChallengesMap = dynamic(() => import('./ChallengesMap'), {
  ssr: false,
  loading: () => <MapLoadingSkeleton />,
});

interface Props {
  categories: Category[];
  challenges: (Challenge & { categoryId: string | null })[];
  user: User | null;
  userProgress: UserProgress[] | null;
}

export function ChallengesMapWrapper(props: Props) {
  return <ChallengesMap {...props} />;
}

function MapLoadingSkeleton() {
  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          color: 'var(--muted-foreground)',
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        {'> loading skill map...'}
        <span className="animate-blink" style={{ marginLeft: 4 }}>
          █
        </span>
      </span>
    </div>
  );
}
