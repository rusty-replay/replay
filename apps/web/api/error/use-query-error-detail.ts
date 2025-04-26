import { useQuery } from '@tanstack/react-query';
import { UseQueryCustomOptions } from '../types';
import { ErrorReportResponse } from './types';
import { axiosInstance } from '../axios';

export default function useQueryErrorDetail({
  projectId,
  issueId,
  options,
}: {
  projectId: number;
  issueId: number;
  options?: UseQueryCustomOptions<void, ErrorReportResponse>;
}) {
  const queryKey = `/api/projects/${projectId}/errors/${issueId}`;
  const queryFn = async () =>
    await axiosInstance.get(queryKey).then((res) => res.data);

  return useQuery({
    queryKey: [queryKey],
    queryFn,
    ...options,
  });
}
