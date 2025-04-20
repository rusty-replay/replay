import { useQuery } from '@tanstack/react-query';
import { UseQueryCustomOptions } from '../types';
import { ErrorReportResponse } from './types';
import { axiosInstance } from '../axios';

export default function useQueryErrorDetail({
  projectId,
  errorId,
  options,
}: {
  projectId: number;
  errorId: number;
  options?: UseQueryCustomOptions<ErrorReportResponse, void>;
}) {
  const queryKey = `/api/projects/${projectId}/errors/${errorId}`;
  const queryFn = async () =>
    await axiosInstance.get(queryKey).then((res) => res.data);

  return useQuery({
    queryKey: [queryKey],
    queryFn,
    ...options,
  });
}
