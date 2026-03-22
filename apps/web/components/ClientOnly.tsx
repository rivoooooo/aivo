"use client";

import { useSyncExternalStore } from 'react';
import { ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function getMountedStore() {
  return {
    subscribe() {
      return () => {}
    },
    getSnapshot() {
      return true
    },
    getServerSnapshot() {
      return false
    }
  }
}

const mountedStore = getMountedStore()

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const mounted = useSyncExternalStore(
    mountedStore.subscribe,
    mountedStore.getSnapshot,
    mountedStore.getServerSnapshot
  )

  return mounted ? <>{children}</> : <>{fallback}</>;
}
