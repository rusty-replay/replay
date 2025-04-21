import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../axios';
import { UseQueryCustomOptions } from '../types';
import { ErrorReportListResponse } from './types';

export function useQueryErrorList({
  projectId,
  options,
}: {
  projectId: number;
  options?: UseQueryCustomOptions<void, ErrorReportListResponse[]>;
}) {
  const queryKey = `/api/projects/${projectId}/errors`;
  const queryFn = async () =>
    await axiosInstance.get(queryKey).then((res) => res.data);

  return useQuery({
    queryKey: [queryKey],
    queryFn,
    ...options,
  });
}
