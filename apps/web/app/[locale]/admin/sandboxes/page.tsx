'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Sandbox {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: string;
  createdAt: string;
}

export default function SandboxesPage() {
  const [sandboxes, setSandboxes] = useState<Sandbox[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/sandboxes')
      .then(res => res.json())
      .then(data => {
        setSandboxes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching sandboxes:', err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sandbox?')) return;
    
    try {
      await fetch(`/api/admin/sandboxes/${id}`, { method: 'DELETE' });
      setSandboxes(sandboxes.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting sandbox:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--muted-foreground)]">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Sandboxes</h1>
          <p className="text-[var(--muted-foreground)]">Manage code templates</p>
        </div>
        <Link
          href="/en/admin/sandboxes/new"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Sandbox
        </Link>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Created</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {sandboxes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                  No sandboxes yet. Create your first one!
                </td>
              </tr>
            ) : (
              sandboxes.map((sandbox) => (
                <tr key={sandbox.id} className="hover:bg-[var(--muted)]">
                  <td className="px-4 py-3 text-sm text-[var(--foreground)]">{sandbox.name}</td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">{sandbox.slug}</td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                    <span className="px-2 py-1 bg-[var(--primary)]/20 text-[var(--primary)] rounded text-xs">
                      {sandbox.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                    {new Date(sandbox.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/en/admin/sandboxes/${sandbox.id}`}
                        className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(sandbox.id)}
                        className="p-2 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
