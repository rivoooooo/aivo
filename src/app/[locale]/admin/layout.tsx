'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Box, 
  Code2, 
  Users, 
  Settings,
  Shield
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/en/admin', icon: LayoutDashboard },
  { name: 'Sandboxes', href: '/en/admin/sandboxes', icon: Box },
  { name: 'Challenges', href: '/en/admin/challenges', icon: Code2 },
  { name: 'Users', href: '/en/admin/users', icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="flex">
        <aside className="w-64 min-h-screen border-r border-[var(--border)] bg-[var(--card)]">
          <div className="p-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-[var(--primary)]" />
              <span className="text-lg font-bold text-[var(--foreground)]">Admin</span>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/en/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
