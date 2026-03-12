'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import CodeEditor from './components/CodeEditor';
import PreviewFrame from './components/PreviewFrame';
import { getChallengeConfig, type ChallengeConfig } from './utils';

export default function PlaygroundPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [challenge, setChallenge] = useState<ChallengeConfig | null>(null);
  const [code, setCode] = useState({
    html: '',
    css: '',
    js: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getChallengeConfig(slug).then(config => {
        if (config) {
          setChallenge(config);
          setCode(config.defaultCode);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  const handleCodeChange = useCallback((newCode: { html: string; css: string; js: string }) => {
    setCode(newCode);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-[var(--primary)] animate-blink">Loading...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="card-terminal max-w-md">
          <div className="card-terminal-header">
            +-- ERROR --
          </div>
          <div className="p-8 text-center">
            <p className="text-lg mb-4">Challenge not found</p>
            <Link href="/en/challenge" className="btn-terminal inline-block">
              [BACK TO CHALLENGES]
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center gap-4">
          <Link 
            href={`/en/challenge/${slug}`}
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[var(--foreground)] text-glow">
              {challenge.title}
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              {challenge.description}
            </p>
          </div>
        </div>
        <div className="text-xs text-[var(--muted-foreground)]">
          <span className="text-[var(--primary)]">{slug}</span>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-[var(--border)]">
          <CodeEditor code={code} onChange={handleCodeChange} />
        </div>
        <div className="w-full md:w-1/2 h-1/2 md:h-full">
          <PreviewFrame code={code} dependencies={challenge.dependencies} />
        </div>
      </main>

      <footer className="px-4 py-2 border-t border-[var(--border)] bg-[var(--card)] text-center">
        <span className="text-xs text-[var(--muted-foreground)]">
          &gt; root@ai-era:~/challenge/{slug}/playground#
          <span className="animate-blink">█</span>
        </span>
      </footer>
    </div>
  );
}
