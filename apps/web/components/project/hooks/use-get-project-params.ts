import { useParams } from 'next/navigation';
import React from 'react';

export function useGetProjectParams() {
  const { project_id: projectId } = useParams<{
    project_id: string;
  }>();

  return { projectId: projectId ? parseInt(projectId) : undefined };
}
