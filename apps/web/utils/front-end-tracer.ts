import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { resourceFromAttributes, osDetector } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
// import { SessionIdProcessor } from './SessionIdProcessor';
import { detectResources } from '@opentelemetry/resources/build/src/detect-resources';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';

declare global {
  interface Window {
    ENV: {
      NEXT_PUBLIC_PLATFORM?: string;
      NEXT_PUBLIC_OTEL_SERVICE_NAME?: string;
      NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT?: string;
      IS_SYNTHETIC_REQUEST?: string;
    };
  }
}

const {
  NEXT_PUBLIC_OTEL_SERVICE_NAME = 'replay',
  NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = '',
  IS_SYNTHETIC_REQUEST = '',
} = typeof window !== 'undefined' && window.ENV
  ? window.ENV
  : {
      NEXT_PUBLIC_OTEL_SERVICE_NAME:
        process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME || 'replay',
      NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT:
        process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || '',
      IS_SYNTHETIC_REQUEST: process.env.IS_SYNTHETIC_REQUEST || '',
    };

const endpoint =
  NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
  'http://localhost:8081/traces';

export const FrontendTracer = async () => {
  const { ZoneContextManager } = await import('@opentelemetry/context-zone');

  let resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: NEXT_PUBLIC_OTEL_SERVICE_NAME,
  });
  const detectedResources = detectResources({ detectors: [osDetector] });
  resource = resource.merge(detectedResources);

  const provider = new WebTracerProvider({
    resource,
    spanProcessors: [
      // new SessionIdProcessor(),
      new BatchSpanProcessor(
        new OTLPTraceExporter({
          url:
            NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
            'http://localhost:8081/traces',

          headers: {
            'Content-Type': 'application/x-protobuf',
          },
        }),
        {
          scheduledDelayMillis: 500,
        }
      ),
    ],
  });

  const contextManager = new ZoneContextManager();

  provider.register({
    contextManager,
    // fetch, xhr을 제외한 모든 event
    // propagator: new CompositePropagator({
    //   propagators: [
    //     new W3CBaggagePropagator(),
    //     new W3CTraceContextPropagator(),
    //   ],
    // }),
  });

  const backendOrigin = new URL(endpoint).origin; // "http://localhost:8081"

  const fetchInstrumentation = new FetchInstrumentation({
    propagateTraceHeaderCorsUrls: [backendOrigin],
    clearTimingResources: true,
  });

  const xhrInstrumentation = new XMLHttpRequestInstrumentation({
    propagateTraceHeaderCorsUrls: [backendOrigin],
    clearTimingResources: true,
  });

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      fetchInstrumentation,
      xhrInstrumentation,
      // getWebAutoInstrumentations({
      //   '@opentelemetry/instrumentation-fetch': {
      //     propagateTraceHeaderCorsUrls: /.*/,
      //     clearTimingResources: true,
      //     applyCustomAttributesOnSpan(span) {
      //       span.setAttribute('app.synthetic_request', IS_SYNTHETIC_REQUEST);
      //     },
      //   },
      // }),
    ],
  });
};
