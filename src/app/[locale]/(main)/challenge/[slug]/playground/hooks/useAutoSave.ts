'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { ChallengeFile } from '@/types/challenge';

interface UseAutoSaveOptions {
  challengeId: string;
  code: ChallengeFile[];
  enabled?: boolean;
  debounceMs?: number;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSavedAt: Date | null;
  error: string | null;
  saveNow: () => Promise<void>;
}

export function useAutoSave({
  challengeId,
  code,
  enabled = true,
  debounceMs = 2000,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCodeRef = useRef<string>(JSON.stringify(code));

  const saveProgress = useCallback(async () => {
    if (!challengeId || code.length === 0) return;

    const currentCodeString = JSON.stringify(code);
    // 如果代码没有变化，不保存
    if (currentCodeString === lastCodeRef.current) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId,
          status: 'in_progress',
          userCode: code,
        }),
      });

      if (!response.ok) {
        // 401 表示未登录，这是预期的行为，不视为错误
        if (response.status === 401) {
          console.log('User not logged in, skipping auto-save');
          return;
        }
        throw new Error(`Failed to save progress: ${response.statusText}`);
      }

      lastCodeRef.current = currentCodeString;
      setLastSavedAt(new Date());
    } catch (err) {
      console.error('Auto-save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  }, [challengeId, code]);

  // Debounce 保存
  useEffect(() => {
    if (!enabled) return;

    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 设置新的定时器
    timeoutRef.current = setTimeout(() => {
      saveProgress();
    }, debounceMs);

    // 清理函数
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code, enabled, debounceMs, saveProgress]);

  // 组件卸载时立即保存
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // 注意：这里不能调用异步的 saveProgress，因为卸载时无法更新 state
      // 如果需要确保保存，可以使用 sendBeacon API
    };
  }, []);

  return {
    isSaving,
    lastSavedAt,
    error,
    saveNow: saveProgress,
  };
}
