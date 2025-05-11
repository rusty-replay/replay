'use client';

import { useParams } from 'next/navigation';
import { useQuerySpans } from '@/api/traces/use-query-spans';
import { Button } from '@workspace/ui/components/button';
import { ArrowLeft } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@workspace/ui/components/breadcrumb';
import { Skeleton } from '@workspace/ui/components/skeleton';
import TraceView from '@/components/traces/trace-view';
import dayjs from 'dayjs';

export default function TracePage() {
  const params = useParams<{ trace_id: string }>();
  const traceId = params.trace_id as string;

  const { data: transaction, isLoading: isTransactionLoading } = useQuerySpans({
    traceId,
  });

  if (isTransactionLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-24" />
        </div>

        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 돌아가기
        </Button>

        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">
            트레이스를 찾을 수 없습니다
          </h2>
          <p className="text-muted-foreground">
            요청한 트레이스 ID({traceId})에 해당하는 데이터가 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/traces">Traces</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/traces/${traceId}`}>
                  {transaction.transaction.id}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="font-mono text-xs">{traceId}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-2xl font-semibold">
            {transaction.transaction.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {dayjs(transaction.transaction.startTimeStamp).format(
              'YYYY-MM-DD HH:mm:ss'
            )}
          </p>
        </div>

        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 트랜잭션 목록
        </Button>
      </div>

      <TraceView traceId={traceId} />
    </div>
  );
}
