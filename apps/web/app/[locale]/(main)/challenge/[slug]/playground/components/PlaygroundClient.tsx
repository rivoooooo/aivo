'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import CodeEditor from './CodeEditor';
import PreviewFrame from './PreviewFrame';
import { EmptyState } from '@/components/ui/empty';
import { useAutoSave } from '../hooks/useAutoSave';
import type { ChallengeWithResources, ChallengeFile } from '@/types/challenge';

interface PlaygroundClientProps {
  challenge: ChallengeWithResources;
  locale: string;
}

export default function PlaygroundClient({ challenge, locale }: PlaygroundClientProps) {
  // 使用 resource 中的 initCode 作为初始代码
  const initialCode = useMemo(() => {
    if (challenge.resources.length > 0 && challenge.resources[0].initCode) {
      return challenge.resources[0].initCode as ChallengeFile[];
    }
    return [];
  }, [challenge.resources]);

  const [code, setCode] = useState<ChallengeFile[]>(initialCode);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);

  // 自动保存 hook
  const { isSaving, lastSavedAt } = useAutoSave({
    challengeId: challenge.id,
    code,
    enabled: true,
  });

  const handleCodeChange = useCallback((content: string) => {
    setCode((prevCode) => {
      if (!prevCode[activeFileIndex]) return prevCode;
      const newCode = [...prevCode];
      newCode[activeFileIndex] = {
        ...newCode[activeFileIndex],
        content,
      };
      return newCode;
    });
  }, [activeFileIndex]);

  const hasTitle = useMemo(() => !!challenge.name, [challenge.name]);
  const hasDescription = useMemo(() => !!challenge.description, [challenge.description]);
  const hasInitCode = useMemo(() => code.length > 0, [code]);

  // 获取第一个 resource 的配置
  const resource = challenge.resources[0];
  const importSource = resource?.importSource || '';
  const sandboxType = (resource?.type as 'html' | 'javascript' | 'typescript' | 'jsx' | 'vue') || 'html';

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/challenge/${challenge.slug}`}
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
          >
            ← Back
          </Link>
          <div>
            {hasTitle ? (
              <h1 className="text-lg font-bold text-[var(--foreground)] text-glow">
                {challenge.name}
              </h1>
            ) : (
              <h1 className="text-lg font-bold text-[var(--muted-foreground)]">
                Untitled Challenge
              </h1>
            )}
            {hasDescription ? (
              <p className="text-xs text-[var(--muted-foreground)]">
                {challenge.description}
              </p>
            ) : (
              <p className="text-xs text-[var(--muted-foreground)] italic">
                No description available
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            {isSaving ? (
              <span className="text-[var(--warning)]">Saving...</span>
            ) : lastSavedAt ? (
              <span>Saved at {lastSavedAt.toLocaleTimeString()}</span>
            ) : null}
          </div>
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="px-3 py-1.5 text-xs font-medium border border-[var(--border)] rounded hover:bg-[var(--muted)] transition-colors text-[var(--foreground)]"
          >
            {showDescription ? '[HIDE DESC]' : '[SHOW DESC]'}
          </button>
          <div className="text-xs text-[var(--muted-foreground)]">
            <span className="text-[var(--primary)]">{challenge.slug}</span>
            <span className="ml-2 px-1.5 py-0.5 bg-[var(--muted)] rounded text-[10px]">
              {sandboxType}
            </span>
          </div>
        </div>
      </header>

      {showDescription && (
        <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--card)] max-h-48 overflow-y-auto">
          {hasDescription ? (
            <div className="prose prose-sm prose-invert max-w-none">
              <h3 className="text-sm font-bold text-[var(--primary)] mb-2">Challenge Description</h3>
              <p className="text-sm text-[var(--foreground)] whitespace-pre-wrap">{challenge.description}</p>
              {importSource ? (
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-[var(--muted-foreground)] mb-1">Import Source:</h4>
                  <pre className="text-xs bg-[var(--muted)] p-2 rounded overflow-x-auto">
                    <code>{importSource}</code>
                  </pre>
                </div>
              ) : (
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-[var(--muted-foreground)] mb-1">Import Source:</h4>
                  <p className="text-xs text-[var(--muted-foreground)] italic">No import source available</p>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              variant="warning"
              title="No Description"
              description="This challenge doesn't have a description yet."
            />
          )}
        </div>
      )}

      <main className="flex-1 min-h-0 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-[var(--border)]">
          {hasInitCode ? (
            <CodeEditor
              files={code}
              activeFileIndex={activeFileIndex}
              onFileSelect={setActiveFileIndex}
              onChange={handleCodeChange}
            />
          ) : (
            <div className="h-full flex items-center justify-center p-4 bg-[var(--card)] border border-[var(--border)]">
              <EmptyState
                variant="warning"
                title="No Initial Code"
                description="This challenge doesn't have initial code files. Please check the challenge resources or try a different challenge."
                action={
                  <Link href={`/${locale}/challenge/${challenge.slug}`} className="btn-terminal text-xs px-3 py-1.5">
                    [BACK TO CHALLENGE]
                  </Link>
                }
              />
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 h-1/2 md:h-full">
          {hasInitCode ? (
            <PreviewFrame
              codeSource={code}
              importSource={importSource}
              sandboxType={sandboxType}
            />
          ) : (
            <div className="h-full flex items-center justify-center p-4 bg-[var(--card)] border border-[var(--border)]">
              <EmptyState
                variant="warning"
                title="No Preview Available"
                description="This challenge doesn't have preview resources configured. You can still edit the code on the left side."
              />
            </div>
          )}
        </div>
      </main>

      <footer className="px-4 py-2 border-t border-[var(--border)] bg-[var(--card)] text-center">
        <span className="text-xs text-[var(--muted-foreground)]">
          &gt; root@ai-era:~/challenge/{challenge.slug}/playground#
          <span className="animate-blink">█</span>
        </span>
      </footer>
    </div>
  );
}
