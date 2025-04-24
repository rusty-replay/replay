'use client';

import React, { useEffect, useState, useRef } from 'react';
import useQueryErrorDetail from '@/api/error/use-query-error-detail';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { Button } from '@workspace/ui/components/button';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import {
  ArrowLeft,
  Calendar,
  Globe,
  Smartphone,
  Video,
  AlertCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import 'rrweb-player/dist/style.css';
import { unpack } from '@rrweb/packer';

export default function ErrorDetail({
  params,
}: {
  params: { projectId: string; errorId: string };
}) {
  const router = useRouter();
  const projectId = parseInt(params.projectId);
  const errorId = parseInt(params.errorId);
  const playerRef = useRef<HTMLDivElement>(null);
  const [playerInitialized, setPlayerInitialized] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: error, isLoading } = useQueryErrorDetail({
    projectId,
    errorId,
    options: {
      refetchOnWindowFocus: false,
    },
  });

  console.log('replay>>>', error?.replay);

  const hasReplay =
    error?.replay && Array.isArray(error.replay) && error.replay.length > 0;

  useEffect(() => {
    if (
      activeTab !== 'replay' ||
      !hasReplay ||
      !error?.replay ||
      typeof window === 'undefined'
    ) {
      return;
    }

    const initPlayer = async () => {
      try {
        setPlayerInitialized(false);
        setPlayerError(null);

        if (playerRef.current) {
          playerRef.current.innerHTML = '';
        }

        console.log('Replay data:', error.replay);
        console.log('Replay type:', typeof error.replay);
        console.log('Replay length:', error.replay.length);

        const { default: Player } = await import('rrweb-player');

        let events = error.replay;

        if (typeof events === 'string') {
          try {
            events = JSON.parse(events);
          } catch (e) {
            console.error('Failed to parse replay string:', e);
            setPlayerError('리플레이 데이터 파싱에 실패했습니다.');
            return;
          }
        }

        if (!Array.isArray(events)) {
          console.error('Replay data is not an array:', events);
          setPlayerError('리플레이 데이터가 올바른 형식이 아닙니다.');
          return;
        }

        if (events.length === 0) {
          console.error('Replay data is empty');
          setPlayerError('리플레이 데이터가 비어있습니다.');
          return;
        }

        const validEvents = events.every(
          (event: any) =>
            typeof event === 'object' &&
            event !== null &&
            typeof event.type === 'number' &&
            typeof event.timestamp === 'number'
        );

        if (!validEvents) {
          console.error('Some events are invalid:', events.slice(0, 3));
          setPlayerError('일부 이벤트 데이터가 올바르지 않습니다.');
          return;
        }

        console.log('rrweb player version:', Player.version);

        new Player({
          target: playerRef.current!,
          props: {
            events: events,
            width: 1000,
            height: 600,
            autoPlay: false,
            showController: true,
            skipInactive: true,
            // unpackFn: unpack,
          },
        });

        setPlayerInitialized(true);
        console.log('Player initialized successfully');
      } catch (err) {
        console.error('리플레이 플레이어 초기화 오류:', err);
        setPlayerError(
          `리플레이 플레이어 초기화 오류: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.innerHTML = '';
      }
    };
  }, [error, hasReplay, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const goBack = () => {
    router.push(`/project/${projectId}/errors`);
  };

  const formatStacktrace = (stacktrace: string) => {
    if (!stacktrace) return 'No stacktrace available';

    const lines = stacktrace.split('\n').map((line, index) => {
      if (index === 0) {
        return `<div class="text-red-600 font-semibold">${line}</div>`;
      }

      return line
        .replace(
          /at\s+([^\s\(]+)/g,
          'at <span class="text-blue-600 font-medium">$1</span>'
        )
        .replace(
          /\(([^:]+):(\d+):(\d+)\)/g,
          '(<span class="text-gray-600">$1</span>:<span class="text-orange-500 font-medium">$2</span>:<span class="text-purple-500 font-medium">$3</span>)'
        );
    });

    return lines.join('\n');
  };

  const formatDate = (date: string) => {
    return dayjs(date).format('YYYY년 MM월 DD일 HH:mm:ss');
  };

  return (
    <div className="space-y-6">
      {/* 뒤로가기 버튼 */}
      <div>
        <Button variant="outline" size="sm" onClick={goBack}>
          <ArrowLeft size={16} className="mr-2" />
          에러 목록으로 돌아가기
        </Button>
      </div>

      {isLoading ? (
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
      ) : error ? (
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="stacktrace">스택트레이스</TabsTrigger>
            {hasReplay && (
              <TabsTrigger value="replay">세션 리플레이</TabsTrigger>
            )}
          </TabsList>

          {/* 개요 탭 */}
          <TabsContent value="overview">
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
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      발생 시간
                    </h3>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(error.timestamp)}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      앱 버전
                    </h3>
                    <Badge variant="outline">{error.appVersion}</Badge>
                  </div>

                  {error.browser && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        브라우저
                      </h3>
                      <div className="flex items-center gap-2">
                        <Globe size={16} />
                        <span>{error.browser}</span>
                      </div>
                    </div>
                  )}

                  {error.os && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        운영체제
                      </h3>
                      <div className="flex items-center gap-2">
                        <Smartphone size={16} />
                        <span>{error.os}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      이슈 ID
                    </h3>
                    <Badge variant="secondary">{error.issueId}</Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      세션 리플레이
                    </h3>
                    {hasReplay ? (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                      >
                        사용 가능 ({error.replay.length}개 이벤트)
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        없음
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-md font-semibold mb-2">
                    스택트레이스 미리보기
                  </h3>
                  <div className="bg-gray-100 p-3 rounded-md overflow-auto max-h-32">
                    <pre className="text-xs">
                      {error.stacktrace.split('\n').slice(0, 5).join('\n')}
                      {error.stacktrace.split('\n').length > 5 && '\n...'}
                    </pre>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.history.back()}
                >
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
          </TabsContent>

          {/* 스택트레이스 탭 */}
          <TabsContent value="stacktrace">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">스택트레이스</CardTitle>
                <CardDescription>
                  에러가 발생한 위치와 호출 스택을 확인할 수 있습니다.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[500px]">
                  <pre
                    className="text-xs leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: formatStacktrace(error.stacktrace),
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 리플레이 탭 */}
          {hasReplay && (
            <TabsContent value="replay">
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
                        <AlertTriangle
                          className="text-red-500 mr-2 mt-0.5"
                          size={18}
                        />
                        <div>
                          <h3 className="font-medium text-red-800">
                            리플레이 로드 오류
                          </h3>
                          <p className="text-sm text-red-700 mt-1">
                            {playerError}
                          </p>
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
                  {hasReplay && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>
                        {error.replay.length} 이벤트 | 첫 이벤트:{' '}
                        {dayjs(error.replay[0]?.timestamp).format('HH:mm:ss')} |
                        마지막 이벤트:{' '}
                        {dayjs(
                          error.replay[error.replay.length - 1]?.timestamp
                        ).format('HH:mm:ss')}
                      </span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              에러를 찾을 수 없습니다
            </h2>
            <p className="text-muted-foreground text-center">
              요청하신 에러 ID: {errorId}를 찾을 수 없습니다.
              <br />
              에러가 삭제되었거나 접근 권한이 없을 수 있습니다.
            </p>
            <Button variant="outline" className="mt-4" onClick={goBack}>
              에러 목록으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
