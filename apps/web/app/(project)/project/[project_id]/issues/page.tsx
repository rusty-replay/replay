'use client';

import EventList from '@/components/event-list/event-list';
import { useGetProjectParams } from '@/components/project/hooks/use-get-project-params';
import React from 'react';

export default function ErrorListPage() {
  const { projectId } = useGetProjectParams();

  return (
    <div>
      <EventList projectId={projectId} />
    </div>
  );
}
