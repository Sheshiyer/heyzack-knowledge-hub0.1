'use client';

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <div suppressHydrationWarning>
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          themes={['light', 'dark']}
          disableTransitionOnChange
        >
          {children}
        </NextThemesProvider>
      </div>
    </HeroUIProvider>
  );
}