import { SpansResponse, TransactionResponse } from '@/api/traces/types';
import { formatDuration } from '@/utils/date';
import { Badge } from '@workspace/ui/components/badge';

import dayjs from 'dayjs';
import { useMemo } from 'react';

export default function TraceTimeline({
  spans,
  transaction,
}: {
  spans: SpansResponse[];
  transaction: TransactionResponse;
}) {
  const sortedSpans = useMemo(() => {
    return [...spans].sort(
      (a, b) =>
        dayjs(a.startTimeStamp).valueOf() - dayjs(b.startTimeStamp).valueOf()
    );
  }, [spans]);

  const totalDuration = useMemo(() => {
    if (sortedSpans.length === 0) return 0;

    const firstStart = dayjs(sortedSpans[0].startTimeStamp).valueOf();
    const lastEnd = dayjs(
      sortedSpans[sortedSpans.length - 1].endTimeStamp
    ).valueOf();

    return lastEnd - firstStart;
  }, [sortedSpans]);

  const spanData = useMemo(() => {
    let accumulatedWidth = 0;
    let currentPosition = 0;

    return sortedSpans.map((span, index) => {
      const spanDuration = span.durationMs;
      const widthPercentage = (spanDuration / transaction.durationMs) * 100;

      currentPosition = accumulatedWidth;

      accumulatedWidth += widthPercentage;

      const isHttpSpan = span.httpMethod && span.httpUrl;
      const isError = span.httpStatusCode && span.httpStatusCode >= 400;

      return {
        span,
        startPosition: currentPosition,
        width: widthPercentage,
        isHttpSpan,
        isError,
        durationText:
          span.durationMs >= 1000
            ? `${(span.durationMs / 1000).toFixed(2)}s`
            : `${span.durationMs}ms`,
      };
    });
  }, [sortedSpans, transaction.durationMs]);

  const timeMarkers = useMemo(() => {
    const markers = [];
    for (let i = 0; i <= 4; i++) {
      markers.push({
        position: i * 25,
        label: formatDuration((transaction.durationMs * i) / 4),
      });
    }
    return markers;
  }, [transaction.durationMs]);

  return (
    <div className="space-y-4">
      <div className="text-sm">
        트랜잭션 지속 시간: {formatDuration(transaction.durationMs)}
      </div>

      <div className="relative w-full">
        <div className="relative h-6 mb-4">
          {timeMarkers.map((marker, i) => (
            <div
              key={i}
              className="absolute text-xs text-muted-foreground"
              style={{ left: `${marker.position}%` }}
            >
              {marker.label}
            </div>
          ))}
        </div>

        <div className="absolute top-6 left-0 w-full h-full pointer-events-none">
          {timeMarkers.map((marker, i) => (
            <div
              key={i}
              className="absolute h-full border-l border-gray-200"
              style={{ left: `${marker.position}%` }}
            />
          ))}
        </div>

        <div className="mt-10 space-y-4">
          {spanData.map((data, index) => (
            <div
              key={data.span.spanId}
              className="relative h-4 bg-gray-50 rounded-sm"
            >
              <div className="absolute left-2 top-0 h-full flex items-center z-10">
                <div className="flex items-center gap-1 bg-blue-100 p-1 rounded">
                  <span className="text-xs font-mono">
                    {data.span.durationMs}ms
                  </span>
                  {data.span.httpMethod && (
                    <Badge variant="outline" className="h-5 text-xs">
                      {data.span.httpMethod}
                    </Badge>
                  )}
                </div>
              </div>

              <div
                className={`absolute h-full rounded-sm ${
                  data.isError ? 'bg-red-200' : 'bg-blue-200'
                }`}
                style={{
                  left: `${data.startPosition}%`,
                  width: `${data.width}%`,
                  minWidth: '30px',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 범례 */}
      <div className="flex items-center gap-4 text-xs mt-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-200"></div>
          <span>정상 요청</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-200"></div>
          <span>오류 요청 (400+)</span>
        </div>
      </div>
    </div>
  );
}
