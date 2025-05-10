import { useState, useMemo, ReactNode } from 'react';
import { useQuerySpans } from '@/api/traces/use-query-spans';
import { SpansResponse, TransactionResponse } from '@/api/traces/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Badge } from '@workspace/ui/components/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import {
  ChevronRight,
  ChevronDown,
  Clock,
  Server,
  Globe,
  Info,
  AlertCircle,
} from 'lucide-react';
import dayjs from 'dayjs';
import { formatDuration } from '@/utils/date';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface SpanNode {
  span: SpansResponse;
  children: SpanNode[];
  level: number;
}

interface TraceViewProps {
  traceId: string;
}

export default function TraceView({ traceId }: TraceViewProps) {
  const { data, isLoading, isError, error } = useQuerySpans({ traceId });
  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const spanTree = useMemo(() => {
    if (!data?.spans) return [];

    const spanMap = new Map<string, SpanNode>();
    const rootNodes: SpanNode[] = [];

    // 먼저 모든 스팬을 맵에 추가
    data.spans.forEach((span) => {
      spanMap.set(span.spanId, {
        span,
        children: [],
        level: 0,
      });
    });

    data.spans.forEach((span) => {
      const node = spanMap.get(span.spanId);
      if (!node) return;

      if (span.parentSpanId && spanMap.has(span.parentSpanId)) {
        const parent = spanMap.get(span.parentSpanId);
        if (parent) {
          parent.children.push(node);
          node.level = parent.level + 1;
        }
      } else {
        rootNodes.push(node);
      }
    });

    const sortNodesByStartTime = (nodes: SpanNode[]) => {
      nodes.sort(
        (a, b) =>
          dayjs(a.span.startTimeStamp).valueOf() -
          dayjs(b.span.startTimeStamp).valueOf()
      );
      nodes.forEach((node) => {
        if (node.children.length > 0) {
          sortNodesByStartTime(node.children);
        }
      });
      return nodes;
    };

    return sortNodesByStartTime(rootNodes);
  }, [data]);

  const selectedSpan = useMemo(() => {
    if (!selectedSpanId || !data?.spans) return null;
    return data.spans.find((span) => span.spanId === selectedSpanId);
  }, [selectedSpanId, data]);

  const toggleNode = (spanId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(spanId)) {
        newSet.delete(spanId);
      } else {
        newSet.add(spanId);
      }
      return newSet;
    });
  };

  const handleSelectSpan = (spanId: string) => {
    setSelectedSpanId(spanId);

    const expandParents = (spans: SpansResponse[], spanId: string) => {
      const span = spans.find((s) => s.spanId === spanId);
      if (!span) return;

      if (span.parentSpanId) {
        setExpandedNodes((prev) => {
          const newSet = new Set(prev);
          newSet.add(span.parentSpanId!);
          return newSet;
        });
        expandParents(spans, span.parentSpanId);
      }
    };

    if (data?.spans) {
      expandParents(data.spans, spanId);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-red-500">에러 발생</CardTitle>
          <CardDescription>
            트레이스 데이터를 불러올 수 없습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            {error?.message || '데이터를 불러오는 중 오류가 발생했습니다.'}
          </div>
        </CardContent>
      </Card>
    );
  }

  // 첫 렌더링 시 아직 선택된 스팬이 없으면 첫 번째 span 선택
  if (!selectedSpanId && data.spans.length > 0) {
    setTimeout(() => {
      handleSelectSpan(data.spans[0].spanId);
    }, 0);
  }

  // 선택된 스팬이 없는 경우
  if (!selectedSpan && data.spans.length > 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 타임라인 섹션 */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Trace Timeline</CardTitle>
          <CardDescription>
            트랜잭션 지속 시간: {formatDuration(data.transaction.durationMs)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TraceTimeline spans={data.spans} transaction={data.transaction} />
        </CardContent>
      </Card>

      {/* 스팬 트리 및 상세 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 왼쪽 사이드바 */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">span tree</CardTitle>
              <CardDescription>총 {data.spans.length}개의 span</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-350px)] w-full">
                <div className="px-4 pb-4">
                  {spanTree.map((node) => (
                    <SpanTreeNode
                      key={node.span.spanId}
                      node={node}
                      isExpanded={expandedNodes.has(node.span.spanId)}
                      isSelected={selectedSpanId === node.span.spanId}
                      onToggle={toggleNode}
                      onSelect={handleSelectSpan}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 선택된 span 상세 정보 */}
        <div className="md:col-span-2">
          {selectedSpan && (
            <SpanDetails span={selectedSpan} transaction={data.transaction} />
          )}
        </div>
      </div>
    </div>
  );
}

function TraceTimeline({
  spans,
  transaction,
}: {
  spans: SpansResponse[];
  transaction: TransactionResponse;
}) {
  const transactionStart = dayjs(transaction.startTimeStamp).valueOf();
  const transactionEnd = dayjs(transaction.endTimeStamp).valueOf();
  const totalDuration = transactionEnd - transactionStart;

  const sortedSpans = [...spans].sort(
    (a, b) =>
      dayjs(a.startTimeStamp).valueOf() - dayjs(b.startTimeStamp).valueOf()
  );

  return (
    <div className="space-y-1">
      {/* 타임라인 눈금 */}
      <div className="w-full flex justify-between text-xs text-muted-foreground mb-2">
        <div>0ms</div>
        <div>{formatDuration(totalDuration / 4)}</div>
        <div>{formatDuration(totalDuration / 2)}</div>
        <div>{formatDuration((totalDuration * 3) / 4)}</div>
        <div>{formatDuration(totalDuration)}</div>
      </div>

      {/* 각 스팬에 대한 타임라인 막대 */}
      {sortedSpans.map((span) => {
        const spanStart = dayjs(span.startTimeStamp).valueOf();
        const spanEnd = dayjs(span.endTimeStamp).valueOf();
        const safeTotal = totalDuration <= 0 ? 1 : totalDuration;

        const offsetPercentage =
          ((spanStart - transactionStart) / safeTotal) * 100;
        const widthPercentage = ((spanEnd - spanStart) / safeTotal) * 100;

        const displayOffsetPercentage = isNaN(offsetPercentage)
          ? 0
          : Math.max(0, Math.min(100, offsetPercentage));
        const displayWidthPercentage =
          isNaN(widthPercentage) || widthPercentage <= 0
            ? 1
            : Math.min(100, widthPercentage);

        const isHttpSpan = span.httpMethod && span.httpUrl;

        return (
          <div key={span.spanId} className="flex items-center mb-2">
            <div className="w-48 truncate text-sm pr-2">
              <div className="flex items-center">
                {isHttpSpan ? (
                  <Globe className="h-4 w-4 mr-1 text-blue-500" />
                ) : (
                  <Server className="h-4 w-4 mr-1 text-slate-500" />
                )}
                <span className="truncate">{span.name}</span>
              </div>
            </div>
            <div className="flex-1 relative h-6 bg-muted/30 rounded-md">
              <div
                className={`absolute top-0 h-full rounded-md ${
                  span.httpStatusCode && span.httpStatusCode >= 400
                    ? 'bg-red-500/20'
                    : 'bg-blue-500/20'
                }`}
                style={{
                  left: `${displayOffsetPercentage}%`,
                  width: `${displayWidthPercentage}%`,
                  minWidth: '3px',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {formatDuration(span.durationMs)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SpanTreeNode({
  node,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
  expandedNodes,
  selectedSpanId,
}: {
  node: SpanNode;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: (spanId: string) => void;
  onSelect: (spanId: string) => void;
  expandedNodes: Set<string>;
  selectedSpanId: string | null;
}) {
  const { span, children, level } = node;
  const hasChildren = children.length > 0;

  const isHttpSpan = span.httpMethod && span.httpUrl;

  return (
    <div className="mb-1">
      <div
        className={`flex items-center py-1 px-2 rounded hover:bg-muted/70 cursor-pointer ${isSelected ? 'bg-muted' : ''}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => onToggle(span.spanId)}
            className="mr-1 p-1 rounded-sm hover:bg-muted-foreground/20"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="ml-4 mr-1"></span>
        )}

        <div
          className="flex items-center flex-1 cursor-pointer"
          onClick={() => onSelect(span.spanId)}
        >
          {isHttpSpan ? (
            <Globe className="h-4 w-4 mr-2 text-blue-500" />
          ) : (
            <Server className="h-4 w-4 mr-2 text-slate-500" />
          )}

          <div className="flex-1 truncate">
            <Badge variant="outline" className="mr-2">
              {span.httpMethod}
            </Badge>
            <span className="text-xs">{span.httpUrl}</span>
          </div>

          <div className="ml-2 flex items-center">
            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDuration(span.durationMs)}
            </span>
          </div>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="ml-2">
          {children.map((childNode) => (
            <SpanTreeNode
              key={childNode.span.spanId}
              node={childNode}
              isExpanded={expandedNodes.has(childNode.span.spanId)}
              isSelected={selectedSpanId === childNode.span.spanId}
              onToggle={onToggle}
              onSelect={onSelect}
              expandedNodes={expandedNodes}
              selectedSpanId={selectedSpanId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SpanDetails({
  span,
  transaction,
}: {
  span: SpansResponse;
  transaction: TransactionResponse;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{span.name}</CardTitle>
            <CardDescription className="font-mono text-xs">
              Span ID: {span.spanId}
              {span.parentSpanId && <> | Parent: {span.parentSpanId}</>}
            </CardDescription>
          </div>
          <Badge
            variant={
              span.httpStatusCode && span.httpStatusCode >= 400
                ? 'destructive'
                : 'default'
            }
          >
            {formatDuration(span.durationMs)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">세부 정보</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            {/* 개요 섹션 */}
            <div>
              <h3 className="text-sm font-medium mb-2">개요</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  label="시작 시간"
                  value={dayjs(span.startTimeStamp).format(
                    'YYYY-MM-DD HH:mm:ss.SSS'
                  )}
                />
                <InfoItem
                  label="종료 시간"
                  value={dayjs(span.endTimeStamp).format(
                    'YYYY-MM-DD HH:mm:ss.SSS'
                  )}
                />
                <InfoItem
                  label="지속 시간"
                  value={formatDuration(span.durationMs)}
                  icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                />
                <InfoItem
                  label="환경"
                  value={transaction.environment}
                  icon={<Server className="h-4 w-4 text-muted-foreground" />}
                />
              </div>
            </div>

            {/* HTTP 정보 섹션 */}
            {span.httpMethod && span.httpUrl && (
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">HTTP 정보</h3>
                <div className="space-y-4">
                  <div className="rounded-md bg-muted p-4">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {span.httpMethod}
                      </Badge>
                      <span className="font-mono text-sm overflow-hidden">
                        {span.httpUrl}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {span.httpStatusCode && (
                      <InfoItem
                        label="Status"
                        value={`${span.httpStatusCode} ${span.httpStatusText || ''}`}
                        icon={
                          span.httpStatusCode >= 400 ? (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <Info className="h-4 w-4 text-green-500" />
                          )
                        }
                      />
                    )}
                    {span.httpHost && (
                      <InfoItem label="Host" value={span.httpHost} />
                    )}
                    {span.httpScheme && (
                      <InfoItem label="Scheme" value={span.httpScheme} />
                    )}
                    {span.httpResponseContentLength && (
                      <InfoItem
                        label="Response Size"
                        value={`${formatBytes(span.httpResponseContentLength)}`}
                      />
                    )}
                    {span.httpUserAgent && (
                      <InfoItem
                        label="User Agent"
                        value={span.httpUserAgent}
                        className="col-span-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function InfoItem({
  label,
  value,
  icon,
  className = '',
}: {
  label: string;
  value: string | ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-center">
        {icon && <span className="mr-1">{icon}</span>}
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
