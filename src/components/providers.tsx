import { ReactNode } from "react";
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/theme-provider';

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
      <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
