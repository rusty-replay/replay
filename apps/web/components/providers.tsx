'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import QueryClientProvider from '@/providers/query-client-provider';
import TelemetryProvider from '@/providers/telemetry-provider';
import FlagProvider from '@/providers/flag-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <TelemetryProvider>
        {/* <FlagProvider> */}
        <QueryClientProvider>{children}</QueryClientProvider>
        {/* </FlagProvider> */}
      </TelemetryProvider>
    </NextThemesProvider>
  );
}
