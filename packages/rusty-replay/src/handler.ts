import { captureException } from './reporter';

export function setupGlobalErrorHandler() {
  if ((window as any).__errorHandlerSetup) return;

  const origOnError = window.onerror;
  window.onerror = function thisWindowOnError(
    this: Window & WindowEventHandlers,
    message: string | Event,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error
  ): boolean {
    origOnError?.call(this, message, source, lineno, colno, error);
    captureException(
      error ??
        new Error(typeof message === 'string' ? message : 'Unknown error')
    );
    return false;
  };

  const origOnUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = function thisWindowOnRejection(
    this: Window & WindowEventHandlers,
    event: PromiseRejectionEvent
  ): any {
    origOnUnhandledRejection?.call(this, event);
    const err =
      event.reason instanceof Error
        ? event.reason
        : new Error(JSON.stringify(event.reason));
    captureException(err);
  } as typeof window.onunhandledrejection;

  (window as any).__errorHandlerSetup = true;
}
