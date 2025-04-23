'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from '@tanstack/react-query';

export default function QueryClientProvider({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({});

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  );
}
