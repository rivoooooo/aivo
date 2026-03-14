'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { ChallengeNodeData, NodeStatus } from '../lib/types';

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'var(--success)',
  medium: 'var(--warning)',
  hard: 'var(--destructive)',
};

const STATUS_ICON: Record<NodeStatus, string> = {
  available: '',
  in_progress: '[~]',
  completed: '[✓]',
};

const STATUS_ICON_COLOR: Record<NodeStatus, string> = {
  available: '',
  in_progress: 'var(--warning)',
  completed: 'var(--primary)',
};

interface ChallengeNodeProps {
  data: ChallengeNodeData;
  selected?: boolean;
}

export const ChallengeNode = memo(function ChallengeNode({
  data,
  selected,
}: ChallengeNodeProps) {
  const { challenge, status } = data;
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';

  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />

      <div
        style={{
          width: 140,
          height: 72,
          padding: '8px 10px',
          border: selected
            ? '2px solid var(--primary)'
            : isCompleted
              ? '2px solid var(--primary)'
              : isInProgress
                ? '1px dashed var(--primary)'
                : '1px solid var(--border)',
          background: selected
            ? 'color-mix(in srgb, var(--primary) 25%, var(--card))'
            : isCompleted
              ? 'color-mix(in srgb, var(--primary) 12%, var(--card))'
              : 'var(--card)',
          outline: selected ? '2px solid var(--primary)' : 'none',
          outlineOffset: selected ? '3px' : '0',
          fontFamily: 'JetBrains Mono, monospace',
          cursor: 'pointer',
          transition: 'border-color 120ms, background 120ms, transform 120ms',
          filter: isCompleted
            ? 'drop-shadow(0 0 4px color-mix(in srgb, var(--primary) 50%, transparent))'
            : 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color:
                DIFFICULTY_COLOR[challenge.difficulty] ?? 'var(--foreground)',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {challenge.difficulty}
          </span>
          {STATUS_ICON[status] && (
            <span
              style={{
                fontSize: 10,
                color: STATUS_ICON_COLOR[status],
                fontWeight: 700,
              }}
            >
              {STATUS_ICON[status]}
            </span>
          )}
        </div>

        <div
          style={{
            fontSize: 11,
            color: isCompleted ? 'var(--primary)' : 'var(--foreground)',
            fontWeight: isCompleted ? 700 : 400,
            lineHeight: 1.4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-all',
          }}
        >
          {challenge.name}
        </div>
      </div>
    </>
  );
});
