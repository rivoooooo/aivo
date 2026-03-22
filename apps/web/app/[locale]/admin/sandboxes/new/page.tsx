'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, Plus, Trash2, FileCode, FileJson, FileType } from 'lucide-react';

interface ChallengeFile {
  filename: string;
  language: string;
  content: string;
}

const defaultFiles: ChallengeFile[] = [
  { filename: 'index.html', language: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My App</title>\n</head>\n<body>\n  \n</body>\n</html>' },
];

export default function SandboxFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('html');
  const [importSource, setImportSource] = useState('');
  const [files, setFiles] = useState<ChallengeFile[]>(defaultFiles);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/sandboxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, type, importSource, files }),
      });

      if (res.ok) {
        router.push('/en/admin/sandboxes');
      } else {
        alert('Failed to create sandbox');
      }
    } catch (err) {
      console.error('Error creating sandbox:', err);
      alert('Failed to create sandbox');
    } finally {
      setLoading(false);
    }
  };

  const addFile = () => {
    const newFile: ChallengeFile = {
      filename: `file${files.length + 1}.js`,
      language: 'javascript',
      content: '// Your code here',
    };
    setFiles([...files, newFile]);
    setActiveFileIndex(files.length);
  };

  const removeFile = (index: number) => {
    if (files.length === 1) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (activeFileIndex >= newFiles.length) {
      setActiveFileIndex(newFiles.length - 1);
    }
  };

  const updateFileContent = (content: string) => {
    const newFiles = [...files];
    newFiles[activeFileIndex] = { ...newFiles[activeFileIndex], content };
    setFiles(newFiles);
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.html')) return FileCode;
    if (filename.endsWith('.css')) return FileType;
    return FileJson;
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/en/admin/sandboxes"
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">New Sandbox</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="My Sandbox"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              required
              className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="my-sandbox"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="Describe what this sandbox does..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="html">HTML</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React</option>
            <option value="vue">Vue</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Import Source (esm.sh)
          </label>
          <textarea
            value={importSource}
            onChange={(e) => setImportSource(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder={`import React from 'https://esm.sh/react@18';\nimport { render } from 'https://esm.sh/react-dom/client';`}
          />
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Enter import statements for external dependencies
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Files
            </label>
            <button
              type="button"
              onClick={addFile}
              className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--primary)] hover:bg-[var(--muted)] rounded"
            >
              <Plus className="w-3 h-3" />
              Add File
            </button>
          </div>

          <div className="flex gap-4">
            <div className="w-48 bg-[var(--card)] border border-[var(--border)] rounded-md">
              <div className="border-b border-[var(--border)]">
                {files.map((file, index) => {
                  const Icon = getFileIcon(file.filename);
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[var(--muted)] ${
                        activeFileIndex === index ? 'bg-[var(--muted)]' : ''
                      }`}
                      onClick={() => setActiveFileIndex(index)}
                    >
                      <Icon className="w-4 h-4 text-[var(--muted-foreground)]" />
                      <input
                        type="text"
                        value={file.filename}
                        onChange={(e) => {
                          const newFiles = [...files];
                          newFiles[index] = { ...file, filename: e.target.value };
                          setFiles(newFiles);
                        }}
                        className="flex-1 bg-transparent text-sm text-[var(--foreground)] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="p-1 text-[var(--muted-foreground)] hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-md">
              <textarea
                value={files[activeFileIndex]?.content || ''}
                onChange={(e) => updateFileContent(e.target.value)}
                className="w-full h-64 px-4 py-2 bg-[var(--card)] text-[var(--foreground)] font-mono text-sm resize-none focus:outline-none rounded-md"
                placeholder="Enter file content..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/en/admin/sandboxes"
            className="px-4 py-2 text-[var(--foreground)] border border-[var(--border)] rounded-md hover:bg-[var(--muted)]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:opacity-90 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Sandbox'}
          </button>
        </div>
      </form>
    </div>
  );
}
