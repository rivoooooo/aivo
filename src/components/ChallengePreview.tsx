'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface ChallengePreviewProps {
  challenge: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    difficulty: string;
  } | null;
  isExpanded: boolean;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const difficultyColors: Record<string, string> = {
  EASY: 'var(--success)',
  MEDIUM: 'var(--warning)',
  HARD: 'var(--destructive)',
  EXPERT: 'var(--error)',
};

export default function ChallengePreview({
  challenge,
  isExpanded,
  onLoginClick,
  onRegisterClick,
}: ChallengePreviewProps) {
  const locale = useLocale();

  if (!challenge) {
    return (
      <div className="challenge-preview">
        <p className="text-sm opacity-60 text-center">
          &gt; click a challenge to view details
        </p>
      </div>
    );
  }

  const difficultyColor = difficultyColors[challenge.difficulty] || 'var(--foreground)';

  return (
    <div className={`challenge-preview ${isExpanded ? 'challenge-preview-expanded' : ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold">
              {challenge.name}
            </h3>
            <span
              className="text-xs px-2 py-0.5 border inline-block mt-1"
              style={{
                color: difficultyColor,
                borderColor: difficultyColor
              }}
            >
              {challenge.difficulty}
            </span>
          </div>
        </div>

        {challenge.description && (
          <p className="text-sm opacity-80 mb-3">
            $ {challenge.description}
          </p>
        )}

        <div className="flex gap-3 mt-4">
          <Link
            href={`/${locale}/challenge/${challenge.slug}`}
            className="btn-terminal text-xs"
          >
            START CHALLENGE
          </Link>
          
          <button
            onClick={onRegisterClick}
            className="outline-button text-xs"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Register to track progress
          </button>
        </div>
      </div>
    </div>
  );
}
