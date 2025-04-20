import { useParams } from 'next/navigation';
import React from 'react';

export function useGetProjectParams() {
  const { project_id: projectId } = useParams();

  return { projectId };
}
