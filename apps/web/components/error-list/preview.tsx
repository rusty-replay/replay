import React, { RefObject } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@workspace/ui/components/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@workspace/ui/components/collapsible';
import {
  ArrowLeft,
  Calendar,
  Globe,
  Smartphone,
  Video,
  AlertCircle,
  Clock,
  AlertTriangle,
  FileText,
  Globe2,
  Send,
  CornerDownRight,
} from 'lucide-react';
import dayjs from 'dayjs';
import { AdditionalInfo } from 'rusty-replay';
import { ErrorReportResponse } from '@/api/error/types';

export interface BackButtonProps {
  onClick: () => void;
}

export const BackButton = ({ onClick }: BackButtonProps) => (
  <Button variant="outline" size="sm" onClick={onClick}>
    <ArrowLeft size={16} className="mr-2" />
    에러 목록으로 돌아가기
  </Button>
);

export const LoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </CardContent>
  </Card>
);

export interface ErrorNotFoundProps {
  issueId: number | undefined;
  goBack: VoidFunction;
}

export const ErrorNotFound = ({ issueId, goBack }: ErrorNotFoundProps) => (
  <Card>
    <CardContent className="p-6 flex flex-col items-center justify-center">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">에러를 찾을 수 없습니다</h2>
      <p className="text-muted-foreground text-center">
        요청하신 에러 ID: {issueId}를 찾을 수 없습니다.
        <br />
        에러가 삭제되었거나 접근 권한이 없을 수 있습니다.
      </p>
      <Button variant="outline" className="mt-4" onClick={goBack}>
        에러 목록으로 돌아가기
      </Button>
    </CardContent>
  </Card>
);

export interface BasicInfoItemProps {
  label: string;
  children: React.ReactNode;
}

export const BasicInfoItem = ({ label, children }: BasicInfoItemProps) => (
  <div>
    <h3 className="text-sm font-medium text-muted-foreground mb-1">{label}</h3>
    {children}
  </div>
);

export interface StacktracePreviewProps {
  stacktrace: string;
}

export const StacktracePreview = ({ stacktrace }: StacktracePreviewProps) => (
  <div>
    <h3 className="text-md font-semibold mb-2">스택트레이스 미리보기</h3>
    <div className="bg-gray-100 p-3 rounded-md overflow-auto max-h-32">
      <pre className="text-xs">
        {stacktrace.split('\n').slice(0, 5).join('\n')}
        {stacktrace.split('\n').length > 5 && '\n...'}
      </pre>
    </div>
  </div>
);

export interface AdditionalInfoSectionProps {
  additionalInfo: AdditionalInfo | null;
}

export const AdditionalInfoSection = ({
  additionalInfo,
}: AdditionalInfoSectionProps) => {
  if (!additionalInfo) return null;

  return (
    <div>
      <h3 className="text-md font-semibold mb-2 flex items-center">
        <FileText size={16} className="mr-2" />
        추가 정보
      </h3>

      <div className="space-y-4">
        {/* 페이지 URL */}
        {additionalInfo.pageUrl && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
              <Globe2 size={14} className="mr-1" />
              페이지 URL
            </h4>
            <div className="bg-gray-50 p-2 rounded text-sm break-all">
              {additionalInfo.pageUrl}
            </div>
          </div>
        )}

        {/* 요청 정보 */}
        {additionalInfo.request && (
          <Collapsible className="w-full">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Send size={14} className="mr-1" />
                요청 정보
              </h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  자세히 보기
                </Button>
              </CollapsibleTrigger>
            </div>

            <div className="bg-gray-50 p-3 rounded overflow-auto">
              <div className="flex gap-2 mb-1">
                <Badge
                  variant="outline"
                  className="font-medium text-blue-600 bg-blue-50"
                >
                  {additionalInfo.request.method}
                </Badge>
                <span className="break-all">{additionalInfo.request.url}</span>
              </div>

              <CollapsibleContent>
                {Object.keys(additionalInfo.request.headers).length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium mb-1">Headers:</h5>
                    <ScrollArea className="h-32 rounded border p-2">
                      <pre className="text-xs">
                        {JSON.stringify(
                          additionalInfo.request.headers,
                          null,
                          2
                        )}
                      </pre>
                    </ScrollArea>
                  </div>
                )}
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}

        {/* 응답 정보 */}
        {additionalInfo.response && (
          <Collapsible className="w-full">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <CornerDownRight size={14} className="mr-1" />
                응답 정보
              </h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  자세히 보기
                </Button>
              </CollapsibleTrigger>
            </div>

            <div className="bg-gray-50 p-3 rounded overflow-auto">
              <div className="flex gap-2 mb-1">
                <Badge
                  variant="outline"
                  className={`${
                    additionalInfo.response.status >= 400
                      ? 'text-red-600 bg-red-50'
                      : 'text-green-600 bg-green-50'
                  }`}
                >
                  {additionalInfo.response.status}
                </Badge>
                <span>{additionalInfo.response.statusText}</span>
              </div>

              <CollapsibleContent>
                {additionalInfo.response.data && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium mb-1">응답 데이터:</h5>
                    <div className="bg-gray-100 p-2 rounded">
                      <Table>
                        <TableBody>
                          {additionalInfo.response.data.errorCode && (
                            <TableRow>
                              <TableCell className="font-medium text-xs py-1">
                                에러 코드
                              </TableCell>
                              <TableCell className="py-1">
                                <code className="bg-gray-200 px-1 rounded text-xs">
                                  {additionalInfo.response.data.errorCode}
                                </code>
                              </TableCell>
                            </TableRow>
                          )}
                          {additionalInfo.response.data.message && (
                            <TableRow>
                              <TableCell className="font-medium text-xs py-1">
                                메시지
                              </TableCell>
                              <TableCell className="text-xs py-1">
                                {additionalInfo.response.data.message}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export interface OverviewTabProps {
  error: ErrorReportResponse;
  formatDate: (date: string) => string;
  formatStacktrace: (stacktrace: string) => string;
  hasReplay: boolean;
  setActiveTab: (tab: string) => void;
}

export const OverviewTab = ({
  error,
  formatDate,
  formatStacktrace,
  hasReplay,
  setActiveTab,
}: OverviewTabProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
        <AlertCircle size={20} />
        {error.message}
      </CardTitle>
      <CardDescription>
        Error ID: {error.id} | Group Hash: {error.groupHash}
      </CardDescription>
    </CardHeader>

    <CardContent className="space-y-6">
      {/* 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BasicInfoItem label="발생 시간">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{formatDate(error.timestamp)}</span>
          </div>
        </BasicInfoItem>

        <BasicInfoItem label="앱 버전">
          <Badge variant="outline">{error.appVersion}</Badge>
        </BasicInfoItem>

        {error.browser && (
          <BasicInfoItem label="브라우저">
            <div className="flex items-center gap-2">
              <Globe size={16} />
              <span>{error.browser}</span>
            </div>
          </BasicInfoItem>
        )}

        {error.os && (
          <BasicInfoItem label="운영체제">
            <div className="flex items-center gap-2">
              <Smartphone size={16} />
              <span>{error.os}</span>
            </div>
          </BasicInfoItem>
        )}

        <BasicInfoItem label="이슈 ID">
          <Badge variant="secondary">{error.issueId}</Badge>
        </BasicInfoItem>

        <BasicInfoItem label="세션 리플레이">
          {hasReplay ? (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              사용 가능 ({error.replay.length}개 이벤트)
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              없음
            </Badge>
          )}
        </BasicInfoItem>
      </div>

      <Separator />

      <AdditionalInfoSection additionalInfo={error.additionalInfo} />

      <StacktracePreview stacktrace={error.stacktrace} />
    </CardContent>

    <CardFooter className="flex justify-between">
      <Button variant="outline" size="sm" onClick={() => window.history.back()}>
        뒤로 가기
      </Button>
      {hasReplay && (
        <Button
          variant="default"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setActiveTab('replay')}
        >
          <Video size={16} />
          세션 리플레이 보기
        </Button>
      )}
    </CardFooter>
  </Card>
);

export interface StacktraceTabProps {
  error: ErrorReportResponse;
  formatStacktrace: (stacktrace: string) => string;
}

export const StacktraceTab = ({
  error,
  formatStacktrace,
}: StacktraceTabProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-xl">스택트레이스</CardTitle>
      <CardDescription>
        에러가 발생한 위치와 호출 스택을 확인할 수 있습니다.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <ScrollArea className="bg-gray-100 p-4 rounded-md h-[500px]">
        <pre
          className="text-xs leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{
            __html: formatStacktrace(error.stacktrace),
          }}
        />
      </ScrollArea>
    </CardContent>
  </Card>
);

export interface ReplayTabProps {
  error: ErrorReportResponse;
  playerRef: RefObject<HTMLDivElement | null>;
  playerInitialized: boolean;
  playerError: string | null;
  setPlayerError: (error: string | null) => void;
  setPlayerInitialized: (initialized: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export const ReplayTab = ({
  error,
  playerRef,
  playerInitialized,
  playerError,
  setPlayerError,
  setPlayerInitialized,
  setActiveTab,
}: ReplayTabProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-xl">세션 리플레이</CardTitle>
      <CardDescription>
        에러 발생 전 사용자의 행동을 녹화한 영상입니다.
      </CardDescription>
    </CardHeader>

    <CardContent>
      {/* 플레이어 오류 표시 */}
      {playerError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex items-start">
            <AlertTriangle className="text-red-500 mr-2 mt-0.5" size={18} />
            <div>
              <h3 className="font-medium text-red-800">리플레이 로드 오류</h3>
              <p className="text-sm text-red-700 mt-1">{playerError}</p>
              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(error.replay?.slice(0, 2), null, 2)}
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setPlayerError(null);
                  setPlayerInitialized(false);
                  setActiveTab('replay');
                }}
              >
                다시 시도
              </Button>
            </div>
          </div>
        </div>
      )}

      <div
        id="player"
        ref={playerRef}
        className="rrweb-player w-full overflow-hidden"
      >
        {!playerInitialized && !playerError && (
          <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        )}
      </div>
    </CardContent>

    <CardFooter className="text-sm text-muted-foreground">
      {error.replay &&
        Array.isArray(error.replay) &&
        error.replay.length > 0 && (
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span>
              {error.replay.length} 이벤트 | 첫 이벤트:{' '}
              {dayjs(error.replay[0]?.timestamp).format('HH:mm:ss')} | 마지막
              이벤트:{' '}
              {dayjs(error.replay[error.replay.length - 1]?.timestamp).format(
                'HH:mm:ss'
              )}
            </span>
          </div>
        )}
    </CardFooter>
  </Card>
);
