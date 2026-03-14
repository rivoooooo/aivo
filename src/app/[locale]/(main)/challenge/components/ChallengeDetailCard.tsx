'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter, useParams } from 'next/navigation';
import type { Challenge } from '@/server/lib/db/schema';
import type { User } from '@/server/lib/db/schema';

interface Props {
  challenge: Challenge | null;
  originRect: DOMRect | null;
  user: User | null;
  onClose: () => void;
}

const TARGET = { x: 16, y: 80, width: 340 };

export function ChallengeDetailCard({
  challenge,
  originRect,
  user,
  onClose,
}: Props) {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  const getInitial = () => {
    if (!originRect) return { x: 0, y: -20, scale: 0.8, opacity: 0 };
    const targetX = window.innerWidth - TARGET.x - TARGET.width;
    const targetY = TARGET.y;
    return {
      x: originRect.left - targetX,
      y: originRect.top - targetY,
      scale: 0.25,
      opacity: 0,
    };
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {challenge && (
        <motion.div
          key={challenge.id}
          initial={getInitial()}
          animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0, y: -8 }}
          transition={{
            type: 'spring',
            damping: 22,
            stiffness: 280,
            opacity: { duration: 0.12 },
          }}
          style={{
            position: 'fixed',
            top: TARGET.y,
            right: TARGET.x,
            width: TARGET.width,
            zIndex: 100,
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          <div
            style={{
              border: '1px solid var(--border)',
              background: 'var(--card)',
            }}
          >
            <div
              style={{
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 700,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>+─── CHALLENGE ───+</span>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary-foreground)',
                  cursor: 'pointer',
                  fontSize: 12,
                  padding: '0 4px',
                }}
              >
                [ × ]
              </button>
            </div>

            <div style={{ padding: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--foreground)',
                  }}
                >
                  {challenge.name}
                </span>
                <DifficultyBadge difficulty={challenge.difficulty} />
              </div>

              <Divider />

              <div style={{ marginBottom: 12 }}>
                <Label>$ description</Label>
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--foreground)',
                    lineHeight: 1.7,
                    margin: '6px 0 0',
                  }}
                >
                  {challenge.description}
                </p>
              </div>

              <Divider />

              {user && (
                <div style={{ marginBottom: 12 }}>
                  <Label>status:</Label>
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--primary)',
                      marginLeft: 8,
                    }}
                  >
                    [available]
                  </span>
                </div>
              )}

              {!user && (
                <div
                  style={{
                    marginBottom: 12,
                    fontSize: 12,
                    color: 'var(--muted-foreground)',
                  }}
                >
                  <span style={{ color: 'var(--primary)' }}>▓ </span>
                  Login to track this challenge
                </div>
              )}

              <Divider />

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  onClick={() =>
                    router.push(`/${locale}/challenge/${challenge.slug}`)
                  }
                  style={primaryButtonStyle}
                >
                  [ START CHALLENGE → ]
                </button>
                {!user && (
                  <button style={outlineButtonStyle}>[ LOGIN ]</button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Divider() {
  return (
    <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0' }} />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 10,
        color: 'var(--muted-foreground)',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const color = {
    easy: 'var(--success)',
    medium: 'var(--warning)',
    hard: 'var(--destructive)',
  };
  const colorValue = color[difficulty as keyof typeof color] || 'var(--foreground)';
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: colorValue,
        border: `1px dashed ${colorValue}`,
        padding: '2px 6px',
      }}
    >
      [{difficulty.toUpperCase()}]
    </span>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 12px',
  fontSize: 11,
  fontWeight: 700,
  fontFamily: 'JetBrains Mono, monospace',
  background: 'var(--primary)',
  color: 'var(--primary-foreground)',
  border: '1px solid var(--primary)',
  cursor: 'pointer',
  textTransform: 'uppercase',
};

const outlineButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  background: 'transparent',
  color: 'var(--primary)',
};
