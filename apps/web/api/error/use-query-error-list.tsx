import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../axios';
import { UseQueryCustomOptions } from '../types';
import { ErrorReportResponse } from './types';

export function useQueryErrorList({
  projectId,
  options,
}: {
  projectId: number;
  options?: UseQueryCustomOptions<void, ErrorReportResponse[]>;
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
