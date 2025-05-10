import { useQuerySpans } from '@/api/traces/use-query-spans';
import React from 'react';

interface TraceSpanProps {
  traceId: string;
}

export default function TraceSpan({ traceId }: TraceSpanProps) {
  const { data, isLoading } = useQuerySpans({ traceId });

  return <div>TraceSpan</div>;
}
