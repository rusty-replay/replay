import { useParams } from 'next/navigation';
import React from 'react';

export function useGetErrorParams() {
  const { issue_id: issueId } = useParams<{
    issue_id: string;
  }>();

  return { issueId: issueId ? parseInt(issueId) : undefined };
}
