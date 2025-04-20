'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from '@tanstack/react-query';
import { startRecording } from '@/utils/record';

export default function QueryClientProvider({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({});

  useEffect(() => {
    startRecording();
  }, []);

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  );
}
