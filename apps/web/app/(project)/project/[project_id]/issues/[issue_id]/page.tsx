'use client';

import EventDetail from '@/components/event-list/event-detail';
import { useGetErrorParams } from '@/components/project/hooks/use-get-error-params';
import { useGetProjectParams } from '@/components/project/hooks/use-get-project-params';
import React from 'react';

export default function ErrorDetailPage() {
  const { projectId } = useGetProjectParams();
  const { issueId } = useGetErrorParams();
  return (
    <div>
      <EventDetail params={{ issueId, projectId }} />
    </div>
  );
}
