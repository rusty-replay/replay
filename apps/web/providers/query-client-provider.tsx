'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient({});

export default function QueryClientProvider({ children }: PropsWithChildren) {
  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  );
}
