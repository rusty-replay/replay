import { getBrowserInfo, getEnvironment } from './environment';
import { ErrorBatcher } from './error-batcher';
import {
  startRecording,
  getRecordedEvents,
  getCurrentEvents,
  clearEvents,
} from './recorder';

export interface AdditionalInfo {
  pageUrl: string;
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
  };
  response: {
    data: {
      message: string;
      errorCode: string;
    };
    status: number;
    statusText: string;
  };
}

export interface BatchedEvent {
  id: string;
  timestamp: string;
  message: string;
  stacktrace: string;
  replay: any[];
  environment: string;
  browser: string;
  os: string;
  userAgent: string;
  userId?: number;
  additionalInfo?: AdditionalInfo;
  appVersion: string;
  apiKey: string;
}

export interface BatcherOptions {
  endpoint: string;
  apiKey: string;
  flushIntervalMs?: number;
  maxBufferSize?: number;
}

export interface InitOptions {
  endpoint: string;
  apiKey: string;
  flushIntervalMs?: number;
  maxBufferSize?: number;
  beforeErrorSec?: number;
}

let batcher: ErrorBatcher;
let globalOpts: { beforeErrorSec: number } = { beforeErrorSec: 30 };

export function init(options: InitOptions) {
  globalOpts.beforeErrorSec = options.beforeErrorSec ?? 10;

  batcher = new ErrorBatcher({
    endpoint: options.endpoint,
    apiKey: options.apiKey,
    flushIntervalMs: options.flushIntervalMs,
    maxBufferSize: options.maxBufferSize,
  });

  if (typeof window !== 'undefined') {
    const start = () => {
      startRecording(); // DOM 렌더링 후에 시작되도록 지연 실행
      import('./handler.js').then((mod) => mod.setupGlobalErrorHandler());
    };

    if (document.readyState === 'complete') {
      requestAnimationFrame(() => startRecording());
    } else {
      window.addEventListener('load', () => {
        requestAnimationFrame(() => startRecording());
      });
    }

    // if ('requestIdleCallback' in window) {
    //   window.requestIdleCallback(start);
    // } else {
    //   setTimeout(start, 100);
    // }
  }
}

export function captureException(
  error: Error,
  additionalInfo?: AdditionalInfo,
  userId?: number
): string {
  const errorTime = Date.now();
  const eventsSnapshot = getCurrentEvents();
  const replay = getRecordedEvents(
    globalOpts.beforeErrorSec,
    errorTime,
    eventsSnapshot
  );

  clearEvents(); // 다음 에러 기록을 위해 초기화

  const { browser, os, userAgent } = getBrowserInfo();

  return batcher.capture({
    message: error.message ?? '',
    stacktrace: error.stack ?? '',
    replay,
    environment: getEnvironment(),
    browser,
    os,
    userAgent,
    userId,
    additionalInfo,
    appVersion: '1.0.0',
    apiKey: batcher.getApiKey(),
  });
}
