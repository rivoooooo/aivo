"use client";

import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { CommandPaletteWrapper } from "./command-palette";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-3.5rem)]">
        {children}
      </main>
      <CommandPaletteWrapper />
    </>
  );
}
