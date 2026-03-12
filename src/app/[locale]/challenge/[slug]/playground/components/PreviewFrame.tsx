'use client';

import { useMemo } from 'react';

interface PreviewFrameProps {
  code: {
    html: string;
    css: string;
    js: string;
  };
  dependencies?: string[];
}

function buildImportMap(deps: string[]): string {
  if (!deps || deps.length === 0) return '';
  
  const imports: Record<string, string> = {};
  
  deps.forEach(dep => {
    const [pkg, version] = dep.split('@');
    if (pkg && version) {
      imports[pkg] = `https://esm.sh/${dep}`;
      imports[pkg + '/'] = `https://esm.sh/${dep}/`;
    }
  });
  
  return JSON.stringify({ imports }, null, 2);
}

function generateHtmlDocument(code: code, dependencies?: string[]): string {
  const importMap = buildImportMap(dependencies || []);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 16px;
      background: #0a0a0a;
      color: #33ff00;
      font-family: monospace;
    }
    ${code.css}
  </style>
  ${importMap ? `<script type="importmap">${importMap}</script>` : ''}
</head>
<body>
  ${code.html}
  <script type="module">
    try {
      ${code.js}
    } catch (err) {
      console.error('Error:', err);
      document.body.innerHTML += '<pre style="color: #ff3333; margin-top: 20px;">' + err.message + '</pre>';
    }
  </script>
</body>
</html>`;
}

interface code {
  html: string;
  css: string;
  js: string;
}

export default function PreviewFrame({ code, dependencies }: PreviewFrameProps) {
  const srcDoc = useMemo(() => {
    return generateHtmlDocument(code, dependencies);
  }, [code, dependencies]);

  return (
    <div className="h-full flex flex-col bg-[var(--card)] border border-[var(--border)]">
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--muted)] border-b border-[var(--border)]">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--primary)]">
          Preview
        </span>
        <span className="text-xs text-[var(--muted-foreground)]">
          {dependencies && dependencies.length > 0 && `esm.sh: ${dependencies.length} deps`}
        </span>
      </div>
      <div className="flex-1 min-h-0 p-0">
        <iframe
          srcDoc={srcDoc}
          title="Preview"
          sandbox="allow-scripts allow-modals"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
