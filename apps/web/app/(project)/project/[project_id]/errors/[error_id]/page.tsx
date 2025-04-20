'use client';

import ErrorDetail from '@/components/error-list/error-detail';
import { useGetErrorParams } from '@/components/project/hooks/use-get-error-params';
import { useGetProjectParams } from '@/components/project/hooks/use-get-project-params';
import React from 'react';

export default function ErrorDetailPage() {
  const { projectId } = useGetProjectParams();
  const { errorId } = useGetErrorParams();
  return (
    <div>
      <ErrorDetail params={{ errorId, projectId }} />
    </div>
  );
}
