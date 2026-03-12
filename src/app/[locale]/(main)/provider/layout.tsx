"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { providerConfig } from "./config";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslations } from 'next-intl';

interface ProviderLayoutProps {
  children: ReactNode;
}

export default function ProviderLayout({ children }: ProviderLayoutProps) {
  const pathname = usePathname();
  const t = useTranslations('common');

  const { isProviderPage, title, description } = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const localeIndex = segments[0];
    const isLocale = localeIndex === 'en' || localeIndex === 'zh';
    const startIdx = isLocale ? 1 : 0;
    
    if (segments[startIdx] === "provider" && segments[startIdx + 1]) {
      const provider = segments[startIdx + 1];
      const slug = segments[startIdx + 2] || "";
      const config = providerConfig[provider];

      if (config) {
        const pageConfig = config.pages[slug] || null;
        return {
          isProviderPage: true,
          title: pageConfig?.title || config.title,
          description: pageConfig?.description || `Configure ${config.title} API`,
        };
      }
    }
    return {
      isProviderPage: false,
      title: "",
      description: "",
    };
  }, [pathname]);

  const handleGoBack = () => {
    window.history.back();
  };

  if (!isProviderPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="scanlines" />
      <nav className="sticky top-0 p-2 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              type="button"
              className="flex items-center gap-2 text-sm text-foreground hover:text-glow transition-all px-2 py-1 border border-transparent hover:border-primary cursor-pointer"
            >
              &lt; {t('back')}
            </button>

            <h1 className="text-sm md:text-base font-bold text-glow truncate max-w-[200px] md:max-w-none">
              {title}
            </h1>

            <div className="flex items-center gap-4">
              <Link
                href="/en"
                className="text-sm text-foreground hover:text-glow transition-all px-2 py-1 border border-transparent hover:border-primary"
              >
                {t('home')}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-4">
        <div className="max-w-4xl mx-auto ">
          <div className="card-terminal mb-6">
            <div className="card-terminal-header">
              +-- {title.toUpperCase()} --+
            </div>
            <div className="">
              <p className="text-sm opacity-60">$ {description}</p>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
