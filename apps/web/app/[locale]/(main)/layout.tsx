'use client';

import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CommandPaletteWrapper } from "@/components/command-palette";
import { CommandPaletteProvider } from "@/components/ui/command";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <CommandPaletteProvider>
      <Header />
      <main className="min-h-[calc(100vh-60px)]">
        {children}
      </main>
      <Footer />
      <CommandPaletteWrapper />
    </CommandPaletteProvider>
  );
}
