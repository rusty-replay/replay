'use client';

import { FrontendTracer } from '@/utils/front-end-tracer';
import React, { PropsWithChildren, useEffect } from 'react';

export default function TelemetryProvider({ children }: PropsWithChildren) {
  // useEffect(() => {
  //   FrontendTracer();
  // }, []);

  return <>{children}</>;
}
