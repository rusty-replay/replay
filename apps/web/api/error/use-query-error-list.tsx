import { useQuery } from '@tanstack/react-query';
import { UseQueryCustomOptions } from '../types';
import { EventReportListResponse } from './types';
import axiosInstance from '../axios';

export function useQueryErrorList({
  projectId,
  options,
}: {
  projectId: number;
  options?: UseQueryCustomOptions<void, EventReportListResponse[]>;
}) {
  const queryKey = `/api/projects/${projectId}/events`;
  const queryFn = async () =>
    await axiosInstance.get(queryKey).then((res) => res.data);

  return useQuery({
    queryKey: [queryKey],
    queryFn,
    ...options,
  });
}
