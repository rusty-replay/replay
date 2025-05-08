import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import {
  resourceFromAttributes,
  osDetector,
  detectResources,
} from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';

export interface OtelConfig {
  serviceName?: string;
  endpoint?: string;
  isSyntheticRequest?: boolean;
  scheduledDelayMillis?: number;
  customHeaders?: Record<string, string>;
}

export const initOtel = async (config: OtelConfig = {}) => {
  const finalConfig = {
    serviceName: config.serviceName ?? 'replay',
    endpoint: config.endpoint ?? 'http://localhost:8081/traces',
    isSyntheticRequest: config.isSyntheticRequest ?? false,
    scheduledDelayMillis: config.scheduledDelayMillis ?? 500,
    customHeaders: {
      'Content-Type': 'application/x-protobuf',
      ...config.customHeaders,
    },
  };

  const { ZoneContextManager } = await import('@opentelemetry/context-zone');

  let resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: finalConfig.serviceName,
  });
  if (finalConfig.isSyntheticRequest) {
    resource = resource.merge(
      resourceFromAttributes({ 'app.synthetic_request': 'true' })
    );
  }
  resource = resource.merge(detectResources({ detectors: [osDetector] }));

  const spanProcessor = new BatchSpanProcessor(
    new OTLPTraceExporter({
      url: finalConfig.endpoint,
      headers: finalConfig.customHeaders,
    }),
    { scheduledDelayMillis: finalConfig.scheduledDelayMillis }
  );
  const provider = new WebTracerProvider({
    resource,
    spanProcessors: [spanProcessor],
  });
  provider.register({
    contextManager: new ZoneContextManager(),
    propagator: new W3CTraceContextPropagator(),
  });

  if (typeof window !== 'undefined') {
    const backendOrigin = new URL(finalConfig.endpoint).origin;

    const [{ FetchInstrumentation }, { XMLHttpRequestInstrumentation }] =
      await Promise.all([
        import('@opentelemetry/instrumentation-fetch'),
        import('@opentelemetry/instrumentation-xml-http-request'),
      ]);

    const fetchInst = new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: [backendOrigin],
      clearTimingResources: true,
    });
    const xhrInst = new XMLHttpRequestInstrumentation({
      propagateTraceHeaderCorsUrls: [backendOrigin],
      clearTimingResources: true,
    });

    fetchInst.setTracerProvider(provider);
    xhrInst.setTracerProvider(provider);
    fetchInst.enable();
    xhrInst.enable();
  }

  console.log('OpenTelemetry initialized successfully');
  return provider;
};
