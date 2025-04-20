'use client';

import ErrorList from '@/components/error-list/error-list';
import { useGetProjectParams } from '@/components/project/hooks/use-get-project-params';
import React from 'react';

export default function ErrorListPage() {
  const { projectId } = useGetProjectParams();

  return (
    <div>
      <ErrorList projectId={projectId} />
    </div>
  );
}
