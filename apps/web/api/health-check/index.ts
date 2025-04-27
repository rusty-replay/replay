import { useQuery } from '@tanstack/react-query';
import { UseMutationCustomOptions } from '../types';
import axiosInstance from '../axios';

export function healthCheck({
  enabled = false,
  options,
}: {
  enabled: boolean;
  options?: UseMutationCustomOptions<string, void>;
}) {
  const queryKey = '/health-check';

  return useQuery({
    queryKey: [queryKey],
    queryFn: async () =>
      await axiosInstance.get(queryKey).then((res) => res.data),
    enabled,
    ...options,
  });
}
