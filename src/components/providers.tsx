import { ReactNode } from "react";
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from '@/lib/hooks/use-session'

interface ProvidersProps {
  children: ReactNode;
  messages: any;
}

export default function Providers({ children, messages }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <SessionProvider>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
