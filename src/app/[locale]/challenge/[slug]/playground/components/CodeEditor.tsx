'use client';

import { useState } from 'react';

type TabType = 'html' | 'css' | 'js';

interface CodeEditorProps {
  code: {
    html: string;
    css: string;
    js: string;
  };
  onChange: (code: { html: string; css: string; js: string }) => void;
}

const tabLabels: Record<TabType, string> = {
  html: 'HTML',
  css: 'CSS',
  js: 'JavaScript'
};

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('html');

  const handleChange = (value: string) => {
    onChange({
      ...code,
      [activeTab]: value
    });
  };

  return (
    <div className="h-full flex flex-col bg-[var(--card)] border border-[var(--border)]">
      <div className="flex border-b border-[var(--border)]">
        {(Object.keys(tabLabels) as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0">
        <textarea
          value={code[activeTab]}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full h-full p-4 bg-[var(--card)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none"
          spellCheck={false}
          placeholder={activeTab === 'html' ? 'Enter HTML...' : activeTab === 'css' ? 'Enter CSS...' : 'Enter JavaScript...'}
        />
      </div>
    </div>
  );
}
