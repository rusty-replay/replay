import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../axios';
import { UseMutationCustomOptions } from '../types';

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
