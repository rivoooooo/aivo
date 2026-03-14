'use client';

import { useState, useMemo } from 'react';
import type { Challenge } from '@/server/lib/db/schema';
import type { UserProgress } from '../lib/types';

interface Props {
  challenges: Challenge[];
  userProgress: UserProgress[];
}

export function ProgressPanel({ challenges, userProgress }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const stats = useMemo(() => {
    const progressMap = new Map(userProgress.map((p) => [p.challengeId, p.status]));
    const total = challenges.length;
    const completed = challenges.filter(
      (c) => progressMap.get(c.id) === 'completed'
    ).length;
    const pct = total ? Math.round((completed / total) * 100) : 0;
    const bar =
      '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10));

    const byDiff = ['easy', 'medium', 'hard'].map((d) => {
      const totalDiff = challenges.filter((c) => c.difficulty === d).length;
      const done = challenges.filter(
        (c) => c.difficulty === d && progressMap.get(c.id) === 'completed'
      ).length;
      const barDiff =
        '█'.repeat(Math.round((done / totalDiff) * 8 || 0)) +
        '░'.repeat(8 - Math.round((done / totalDiff) * 8 || 0));
      return { d, total: totalDiff, done, bar: barDiff };
    });

    return { total, completed, pct, bar, byDiff };
  }, [challenges, userProgress]);

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 16,
    left: 16,
    zIndex: 50,
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11,
    border: '1px solid var(--border)',
    background: 'color-mix(in srgb, var(--background) 90%, transparent)',
    backdropFilter: 'blur(8px)',
    minWidth: 240,
  };

  return (
    <div style={panelStyle}>
      <div
        onClick={() => setCollapsed((v) => !v)}
        style={{
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          padding: '5px 10px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        <span>+─── PROGRESS ───+</span>
        <span>{collapsed ? '▶' : '▼'}</span>
      </div>

      {!collapsed && (
        <div style={{ padding: '12px' }}>
          <div style={{ color: 'var(--primary)', marginBottom: 8 }}>
            {stats.bar}{' '}
            <span style={{ color: 'var(--foreground)' }}>
              {stats.completed}/{stats.total}
            </span>{' '}
            <span style={{ color: 'var(--muted-foreground)' }}>{stats.pct}%</span>
          </div>

          <div
            style={{
              borderTop: '1px dashed var(--border)',
              paddingTop: 8,
            }}
          >
            {stats.byDiff.map(({ d, total, done, bar }) => (
              <div
                key={d}
                style={{
                  display: 'flex',
                  gap: 8,
                  marginBottom: 4,
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    width: 52,
                    color: 'var(--muted-foreground)',
                    textTransform: 'uppercase',
                  }}
                >
                  {d}
                </span>
                <span style={{ color: 'var(--primary)', fontSize: 10 }}>
                  {bar}
                </span>
                <span style={{ color: 'var(--muted-foreground)' }}>
                  {done}/{total}
                </span>
                {done === total && total > 0 && (
                  <span style={{ color: 'var(--primary)' }}>[✓]</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
