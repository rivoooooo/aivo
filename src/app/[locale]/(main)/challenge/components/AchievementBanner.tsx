'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface Props {
  achievement: { name: string; xp: number } | null;
  onDismiss: () => void;
}

export function AchievementBanner({ achievement, onDismiss }: Props) {
  useEffect(() => {
    if (!achievement) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [achievement, onDismiss]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
            padding: '12px 32px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 13,
            fontWeight: 700,
            textAlign: 'center',
            minWidth: 320,
          }}
        >
          <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 4 }}>
            [✓] ACHIEVEMENT UNLOCKED
          </div>
          <div>{achievement.name}</div>
          <div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>
            +{achievement.xp} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
