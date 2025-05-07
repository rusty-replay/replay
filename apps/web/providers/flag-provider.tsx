'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import { OpenFeature } from '@openfeature/react-sdk';
import { FlagdWebProvider } from '@openfeature/flagd-web-provider';

export default function FlagProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    // const session = SessionGateway.getSession();
    // OpenFeature.setContext({ targetingKey: session.userId, ...session });
    OpenFeature.setContext({ targetingKey: '1' })
      .then(() => {
        const useTLS = window.location.protocol === 'https:';
        const port = window.location.port
          ? parseInt(window.location.port, 10)
          : useTLS
            ? 443
            : 80;

        OpenFeature.setProvider(
          new FlagdWebProvider({
            host: window.location.hostname,
            pathPrefix: 'flagservice',
            port,
            tls: useTLS,
            maxRetries: 3,
            maxDelay: 10000,
          })
        );
      })
      .catch(console.error);
  }, []);

  return <>{children}</>;
}
