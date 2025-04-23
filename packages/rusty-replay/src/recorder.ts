import type { eventWithTime } from '@rrweb/types';
import { record } from 'rrweb';
import { pack } from '@rrweb/packer';

let events: eventWithTime[] = [];
const MAX_EVENTS = 1000;

export function startRecording() {
  events = [];
  record({
    emit(event) {
      events.push(event);
      if (events.length > MAX_EVENTS) {
        events = events.slice(-MAX_EVENTS);
      }
    },
    // packFn: pack,
  });
}

export function getRecordedEvents(beforeErrorSec = 30): eventWithTime[] {
  const now = Date.now();
  return events.filter((e) => now - e.timestamp < beforeErrorSec * 1000);
}
