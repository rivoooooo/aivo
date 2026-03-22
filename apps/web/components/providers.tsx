import { ReactNode } from "react";
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from '@/lib/hooks/use-session'
import { ToastProvider } from '@/components/ui/toast'
import type { AbstractIntlMessages } from 'next-intl';

interface ProvidersProps {
  children: ReactNode;
  messages: AbstractIntlMessages;
}

export default function Providers({ children, messages }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ToastProvider>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
