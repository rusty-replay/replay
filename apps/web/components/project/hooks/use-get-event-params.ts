import { useParams } from 'next/navigation';
import React from 'react';

export function useGetEventParams() {
  const { event_id: eventId } = useParams<{
    event_id: string;
  }>();

  return { eventId: eventId ? parseInt(eventId) : undefined };
}
