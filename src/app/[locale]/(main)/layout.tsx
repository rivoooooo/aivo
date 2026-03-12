'use client';

import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { CommandPaletteWrapper } from "@/components/command-palette";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
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
