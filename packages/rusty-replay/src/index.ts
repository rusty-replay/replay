export * from './reporter';
export { setupGlobalErrorHandler } from './handler';
export { startRecording, getRecordedEvents } from './recorder';
export { getBrowserInfo, getEnvironment } from './environment';
export { ErrorBatcher } from './error-batcher';
export type { BatchedEvent, InitOptions, AdditionalInfo } from './reporter';
export { decompressFromBase64 } from './utils';
export { initOtel } from './front-end-tracer';
