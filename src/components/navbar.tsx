"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ModeToggle } from "@/components/mode-toggle";
import { Search, Menu, X, Home, Cpu, Info } from "lucide-react";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { href: "/en", label: t("home"), icon: <Home className="w-3.5 h-3.5" /> },
    { href: "/en/challenge", label: t("challenges"), icon: <Cpu className="w-3.5 h-3.5" /> },
    { href: "/en/about", label: t("about"), icon: <Info className="w-3.5 h-3.5" /> },
  ];

  const isActive = (href: string) => {
    if (href === "/en") {
      return pathname === "/en" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-14">
          <Link
            href="/en"
            className="text-sm font-bold tracking-wider text-glow hover:opacity-80 transition-opacity"
          >
            &gt; AI-ERA_
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all",
                  "hover:text-glow hover:opacity-100",
                  isActive(item.href)
                    ? "text-foreground opacity-100"
                    : "opacity-70"
                )}
              >
                {item.icon}
                <span>[{item.label}]</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <div className="hidden md:block">
              <ModeToggle />
            </div>

            <button
              type="button"
              className="md:hidden flex items-center justify-center p-2 text-xs hover:text-glow transition-all opacity-70 hover:opacity-100 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-xs transition-all",
                    "hover:text-glow hover:bg-muted",
                    isActive(item.href)
                      ? "text-foreground bg-muted"
                      : "opacity-70"
                  )}
                >
                  {item.icon}
                  <span>[{item.label}]</span>
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-2 border-t border-border mt-2">
                <div className="flex-1">
                  <LanguageSwitcher />
                </div>
                <ModeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
