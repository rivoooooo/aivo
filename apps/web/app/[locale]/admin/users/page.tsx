'use client';

import { useState, useEffect } from 'react';
import { User, Shield } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--muted-foreground)]">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Users</h1>
        <p className="text-[var(--muted-foreground)]">Manage registered users</p>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Joined</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                  No users registered yet.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--muted)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
                        {user.image ? (
                          <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <User className="w-4 h-4 text-[var(--primary-foreground)]" />
                        )}
                      </div>
                      <span className="text-sm text-[var(--foreground)]">
                        {user.name || 'Anonymous'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)] rounded"
                    >
                      <Shield className="w-3 h-3" />
                      Make Admin
                    </button>
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
