import type { eventWithTime, listenerHandler } from '@rrweb/types';
import { record } from 'rrweb';

let events: eventWithTime[] = [];
const MAX_EVENTS = 1000;
let stopFn: listenerHandler | undefined = undefined;

export function startRecording() {
  events = [];
  stopFn?.();
  stopFn = record({
    emit(event) {
      if (event.type === 2) console.log('[rrweb] FullSnapshot 기록됨:', event);

      events.push(event);
      if (events.length > MAX_EVENTS) {
        events = events.slice(-MAX_EVENTS);
      }
    },
    // checkoutEveryNms: 1000, // 1초마다 체크아웃
    checkoutEveryNms: 15000, // 15초마다 한 번
    checkoutEveryNth: 100, // 100개 이벤트마다 한 번
    maskAllInputs: true,
    sampling: {
      mouseInteraction: {
        MouseUp: false,
        MouseDown: false,
        Click: false,
        ContextMenu: false,
        DblClick: false,
        Focus: false,
        Blur: false,
        TouchStart: false,
        TouchEnd: false,
      },
    },
  });
}

export function getRecordedEvents(
  beforeErrorSec = 10,
  errorTime = Date.now(),
  source = events
): eventWithTime[] {
  const sliced = source.filter(
    (e) => errorTime - e.timestamp < beforeErrorSec * 1000
  );

  const snapshotCandidates = source.filter((e) => e.type === 2);
  const lastSnapshot = [...snapshotCandidates]
    .reverse()
    .find((e) => e.timestamp <= errorTime);

  if (lastSnapshot && !sliced.includes(lastSnapshot)) {
    return [lastSnapshot, ...sliced];
  }

  if (!sliced.some((e) => e.type === 2)) {
    console.warn('⚠️ Snapshot 없이 잘린 replay입니다. 복원 불가능할 수 있음.');
  }

  return sliced;
}

export function clearEvents() {
  events = [];
}

export function getCurrentEvents(): eventWithTime[] {
  return events.slice();
}
