import type { eventWithTime } from '@rrweb/types';
import { record } from 'rrweb';

let events: eventWithTime[] = [];
const MAX_EVENTS = 300;

export function startRecording(): void {
  events = [];
  record({
    emit(event) {
      if (shouldCaptureEvent(event)) {
        events.push(event);
        if (events.length > MAX_EVENTS) {
          events = events.slice(-MAX_EVENTS);
        }
      }
    },

    blockClass: 'no-record',
    ignoreClass: 'ignore-recording',
    maskTextClass: 'mask-text',
    maskAllInputs: true,
    mousemoveWait: 100,
  });
}

function shouldCaptureEvent(event: eventWithTime): boolean {
  // 마우스 움직임, 스크롤 등 빈번한 이벤트는 샘플링
  if (event.type === 3) {
    return Date.now() % 300 === 0;
  }

  // 스크롤 이벤트 샘플링
  if (event.type === 4) {
    return Date.now() % 200 === 0;
  }

  return true;
}

export function getRecordedEvents(beforeErrorSec = 30): eventWithTime[] {
  const now = Date.now();
  return events.filter((e) => now - e.timestamp < beforeErrorSec * 1000);
}
