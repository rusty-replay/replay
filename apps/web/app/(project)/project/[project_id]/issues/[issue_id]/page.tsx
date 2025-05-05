'use client';

import EventDetail from '@/components/event-list/event-detail';
import { useGetEventParams } from '@/components/project/hooks/use-get-event-params';
import { useGetProjectParams } from '@/components/project/hooks/use-get-project-params';
import React from 'react';

export default function ErrorDetailPage() {
  const { projectId } = useGetProjectParams();
  const { eventId } = useGetEventParams();

  console.log('eventId!!!!!!>>>', eventId);

  return (
    <div>
      <EventDetail params={{ eventId, projectId }} />
    </div>
  );
}
