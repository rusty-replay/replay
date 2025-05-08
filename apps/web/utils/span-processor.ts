import {
  SimpleSpanProcessor,
  ReadableSpan,
  SpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';

class EndpointOnlySpanProcessor implements SpanProcessor {
  private delegate = new SimpleSpanProcessor(
    new OTLPTraceExporter({
      url: process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
      headers: { 'Content-Type': 'application/x-protobuf' },
    })
  );

  onStart(_span: ReadableSpan) {}

  onEnd(span: ReadableSpan) {
    const url = span.attributes['http.url'] as string | undefined;
    if (
      url &&
      url.startsWith(
        process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT!
      )
    ) {
      this.delegate.onEnd(span);
    }
  }

  shutdown() {
    return this.delegate.shutdown();
  }
  forceFlush() {
    return this.delegate.forceFlush();
  }
}
