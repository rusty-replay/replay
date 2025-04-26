'use client';

import React, { useEffect, useState, useRef } from 'react';
import useQueryErrorDetail from '@/api/error/use-query-error-detail';
import { useRouter } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import dayjs from 'dayjs';
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

interface ErrorDetailProps {
  params: {
    projectId: string;
    errorId: string;
  };
}

export default function ErrorDetail({ params }: ErrorDetailProps) {
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

        new Player({
          target: playerRef.current!,
          props: {
            events: events,
            width: 1000,
            height: 600,
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
              formatDate={formatDate}
              formatStacktrace={formatStacktrace}
              hasReplay={hasReplay}
              setActiveTab={setActiveTab}
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
        <ErrorNotFound errorId={errorId} goBack={goBack} />
      )}
    </div>
  );
}
