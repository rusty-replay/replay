import { useQuery } from '@tanstack/react-query';
import { UseQueryCustomOptions } from '../types';
import { EventReportResponse } from './types';
import axiosInstance from '../axios';

export default function useQueryErrorDetail({
  projectId,
  issueId,
  options,
}: {
  projectId: number;
  issueId: number;
  options?: UseQueryCustomOptions<void, EventReportResponse>;
}) {
  const queryKey = `/api/projects/${projectId}/events/${issueId}`;
  const queryFn = async () =>
    await axiosInstance.get(queryKey).then((res) => res.data);

  return useQuery({
    queryKey: [queryKey],
    queryFn,
    ...options,
  });
}
