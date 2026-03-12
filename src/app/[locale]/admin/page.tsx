'use client';

import { Shield, Box, Code2, Users } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { name: 'Sandboxes', value: '0', icon: Box, color: 'text-blue-500' },
    { name: 'Challenges', value: '0', icon: Code2, color: 'text-green-500' },
    { name: 'Users', value: '0', icon: Users, color: 'text-purple-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
        <p className="text-[var(--muted-foreground)]">Manage your playground platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">{stat.name}</p>
                <p className="text-3xl font-bold text-[var(--foreground)]">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/en/admin/sandboxes/new"
            className="p-4 bg-[var(--muted)] rounded-lg text-center hover:bg-[var(--border)] transition-colors"
          >
            <Box className="w-6 h-6 mx-auto mb-2 text-[var(--primary)]" />
            <span className="text-sm text-[var(--foreground)]">New Sandbox</span>
          </a>
          <a
            href="/en/admin/challenges/new"
            className="p-4 bg-[var(--muted)] rounded-lg text-center hover:bg-[var(--border)] transition-colors"
          >
            <Code2 className="w-6 h-6 mx-auto mb-2 text-[var(--primary)]" />
            <span className="text-sm text-[var(--foreground)]">New Challenge</span>
          </a>
        </div>
      </div>
    </div>
  );
}
