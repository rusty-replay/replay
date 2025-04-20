import axios from 'axios';
import { record } from 'rrweb';

import type { eventWithTime } from '@rrweb/types';

let events: eventWithTime[] = [];

const MAX_EVENTS = 1000;

export function startRecording() {
  events = [];
  console.log('[rrweb] recording started');
  record({
    emit(event) {
      events.push(event);
      if (events.length > MAX_EVENTS) {
        events = events.slice(-MAX_EVENTS);
      }
    },
  });
}

export function getRecordedEvents(beforeErrorSec = 30) {
  const now = Date.now();
  const filteredEvents = events.filter((event) => {
    return now - event.timestamp < beforeErrorSec * 1000;
  });
  console.log(
    `[rrweb] returning ${filteredEvents.length} events within last ${beforeErrorSec} seconds`
  );
  return filteredEvents;
}

export async function reportError(error: any) {
  try {
    await axios.post(
      'http://localhost:8080/errors',
      {
        message: error.message ?? 'Test error',
        stacktrace: error.stack ?? 'stacktrace here',
        app_version: '1.0.0',
        timestamp: new Date().toISOString(),
        replay: getRecordedEvents(),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (e) {
    console.error('reportError failed:', e);
  }
}
