"use client";

import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { ClientOnly } from './ClientOnly';
import { languageSwitcherTranslations } from '@/i18n/languageSwitcher';

export function LanguageSwitcher() {
  const pathname = usePathname();
  
  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(zh|en|ja)/, '');
    window.location.assign(`/${newLocale}${pathWithoutLocale || '/'}`);
  };

  const languages = [
    { code: 'zh', name: languageSwitcherTranslations.zh.switchTo.zh },
    { code: 'en', name: languageSwitcherTranslations.zh.switchTo.en },
    { code: 'ja', name: languageSwitcherTranslations.zh.switchTo.ja }
  ];

  return (
    <ClientOnly fallback={<Button variant="ghost" size="icon" className="relative"><Globe className="absolute inset-0 m-auto size-4" /><span className="sr-only">Language</span></Button>}>
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" size="icon" className="relative">
            <Globe className="absolute inset-0 m-auto size-4" />
            <span className="sr-only">Language</span>
          </Button>
        } />
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
            >
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ClientOnly>
  );
}