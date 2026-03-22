'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Challenge {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  difficulty: string;
  isPublished: boolean;
  createdAt: string;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/challenges')
      .then(res => res.json())
      .then(data => {
        setChallenges(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching challenges:', err);
        setLoading(false);
      });
  }, []);

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/admin/challenges/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      setChallenges(challenges.map(c => 
        c.id === id ? { ...c, isPublished: !currentStatus } : c
      ));
    } catch (err) {
      console.error('Error toggling publish status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;
    
    try {
      await fetch(`/api/admin/challenges/${id}`, { method: 'DELETE' });
      setChallenges(challenges.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting challenge:', err);
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
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Challenges</h1>
          <p className="text-[var(--muted-foreground)]">Manage programming challenges</p>
        </div>
        <Link
          href="/en/admin/challenges/new"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Challenge
        </Link>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Difficulty</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Created</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {challenges.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                  No challenges yet. Create your first one!
                </td>
              </tr>
            ) : (
              challenges.map((challenge) => (
                <tr key={challenge.id} className="hover:bg-[var(--muted)]">
                  <td className="px-4 py-3 text-sm text-[var(--foreground)]">{challenge.name}</td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">{challenge.slug}</td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                    <span className={`px-2 py-1 rounded text-xs ${
                      challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-500' :
                      challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      challenge.isPublished ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {challenge.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                    {new Date(challenge.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePublish(challenge.id, challenge.isPublished)}
                        className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                        title={challenge.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {challenge.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <Link
                        href={`/en/admin/challenges/${challenge.id}`}
                        className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(challenge.id)}
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
