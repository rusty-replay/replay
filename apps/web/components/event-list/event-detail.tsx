'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useQueryEventDetail } from '@/api/event/use-query-event-detail';
import { useRouter } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';

import 'dayjs/locale/ko';
import 'rrweb-player/dist/style.css';

import {
  BackButton,
  LoadingSkeleton,
  ErrorNotFound,
  OverviewTab,
  StacktraceTab,
  ReplayTab,
} from './preview';
import { decompressFromBase64 } from '@workspace/rusty-replay/index';

interface ErrorDetailProps {
  params: {
    projectId: number | undefined;
    issueId: number | undefined;
  };
}

export default function EventDetail({ params }: ErrorDetailProps) {
  const router = useRouter();
  const projectId = params.projectId;
  const issueId = params.issueId;
  const playerRef = useRef<HTMLDivElement>(null);
  const [playerInitialized, setPlayerInitialized] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: error, isLoading } = useQueryEventDetail({
    projectId: projectId as number,
    issueId: issueId as number,
    options: {
      refetchOnWindowFocus: false,
      enabled: !!(issueId && projectId),
    },
  });

  const hasReplay =
    !!error?.replay &&
    ((typeof error.replay === 'string' && error.replay.trim().length > 0) ||
      (Array.isArray(error.replay) && error.replay.length > 0));

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

        const { default: Player } = await import('rrweb-player');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let events: any = error.replay;

        if (typeof events === 'string') {
          try {
            const decompressed = decompressFromBase64(events);

            if (!decompressed) {
              throw new Error('Base64 디코딩 결과가 null입니다.');
            }

            events = decompressed;
          } catch (e) {
            console.error('리플레이 base64 디코딩 또는 파싱 실패:', e);
            setPlayerError(
              '리플레이 데이터 압축 해제 또는 파싱에 실패했습니다.'
            );
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        new Player({
          target: playerRef.current!,
          props: {
            events,
            width: 1200,
            height: 800,
            autoPlay: false,
            showController: true,
            skipInactive: true,
          },
        });

        setPlayerInitialized(true);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        playerRef.current.innerHTML = '';
      }
    };
  }, [error, hasReplay, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const goBack = () => {
    router.push(`/project/${projectId}/issues`);
  };

  const formatStacktrace = (stacktrace: string) => {
    if (!stacktrace) return 'No stacktrace available';

    const lines = stacktrace.split('\n').map((line, index) => {
      if (index === 0) {
        return `<div class="text-red-600 font-semibold">${line}</div>`;
      }

      return line
        .replace(
          /at\s+([^\s\\(]+)/g,
          'at <span class="text-blue-600 font-medium">$1</span>'
        )
        .replace(
          /\(([^:]+):(\d+):(\d+)\)/g,
          '(<span class="text-gray-600">$1</span>:<span class="text-orange-500 font-medium">$2</span>:<span class="text-purple-500 font-medium">$3</span>)'
        );
    });

    return lines.join('\n');
  };

  return (
    <div className="space-y-6">
      <div>
        <BackButton onClick={goBack} />
      </div>

      {isLoading ? (
        <LoadingSkeleton />
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

          <TabsContent value="overview">
            <OverviewTab
              error={error}
              formatStacktrace={formatStacktrace}
              hasReplay={hasReplay}
              setActiveTab={setActiveTab}
              projectId={projectId}
            />
          </TabsContent>

          <TabsContent value="stacktrace">
            <StacktraceTab error={error} formatStacktrace={formatStacktrace} />
          </TabsContent>

          {hasReplay && (
            <TabsContent value="replay">
              <ReplayTab
                error={error}
                playerRef={playerRef}
                playerInitialized={playerInitialized}
                playerError={playerError}
                setPlayerError={setPlayerError}
                setPlayerInitialized={setPlayerInitialized}
                setActiveTab={setActiveTab}
              />
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <ErrorNotFound issueId={issueId} goBack={goBack} />
      )}
    </div>
  );
}
