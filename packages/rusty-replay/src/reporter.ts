import { startRecording, getRecordedEvents } from './recorder';
import { getBrowserInfo, getEnvironment } from './environment';
import { ErrorBatcher } from './error-batcher';

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
  additionalInfo?: Record<string, any>;
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
  startRecording();
  globalOpts.beforeErrorSec = options.beforeErrorSec ?? 30;
  batcher = new ErrorBatcher({
    endpoint: options.endpoint,
    apiKey: options.apiKey,
    flushIntervalMs: options.flushIntervalMs,
    maxBufferSize: options.maxBufferSize,
  });
  import('./handler.js').then((mod) => mod.setupGlobalErrorHandler());
}

export function captureException(
  error: Error,
  additionalInfo?: Record<string, any>,
  userId?: number
): string {
  const { browser, os, userAgent } = getBrowserInfo();
  const replay = getRecordedEvents(globalOpts.beforeErrorSec);
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

export function wrap<T extends (...args: any[]) => any>(
  fn: T,
  info?: { additionalInfo?: Record<string, any>; userId?: number }
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args) => {
    try {
      return fn(...args);
    } catch (err) {
      if (err instanceof Error) {
        captureException(err, info?.additionalInfo, info?.userId);
      } else {
        captureException(
          new Error(String(err)),
          info?.additionalInfo,
          info?.userId
        );
      }
      throw err;
    }
  };
}
