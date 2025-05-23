import { getBrowserInfo, getEnvironment } from './environment';
import { ErrorBatcher } from './error-batcher';
import {
  startRecording,
  getRecordedEvents,
  getCurrentEvents,
  clearEvents,
} from './recorder';
import { compressToBase64 } from './utils';

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
  replay: string | null;
  environment: string;
  browser: string;
  os: string;
  userAgent: string;
  userId?: number;
  additionalInfo?: Partial<AdditionalInfo>;
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
    if (document.readyState === 'complete') {
      requestAnimationFrame(() => startRecording());
    } else {
      window.addEventListener('load', () => {
        requestAnimationFrame(() => startRecording());
      });
    }
  }
}

export function captureException(
  error: Error,
  additionalInfo?: Partial<AdditionalInfo>,
  userId?: number
): string {
  const errorTime = Date.now();
  const eventsSnapshot = getCurrentEvents();
  const rawReplay = getRecordedEvents(
    globalOpts.beforeErrorSec,
    errorTime,
    eventsSnapshot
  );

  clearEvents();

  const { browser, os, userAgent } = getBrowserInfo();

  const compressedReplay = compressToBase64(rawReplay);

  return batcher.capture({
    message: error.message ?? '',
    stacktrace: error.stack ?? '',
    replay: compressedReplay as any,
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
