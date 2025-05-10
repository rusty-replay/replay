import { useQuery } from '@tanstack/react-query';
import { tracesQueryKeys } from './query-keys';
import axiosInstance from '../axios';
import { UseQueryCustomOptions } from '../types';
import { TransactionWithSpanResponse } from './types';

export function useQuerySpans({
  traceId,
  options,
}: {
  traceId: string;
  options?: UseQueryCustomOptions<void, TransactionWithSpanResponse>;
}) {
  const queryKey = tracesQueryKeys.getTransactionSpans(traceId);
  const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);

  return useQuery({
    queryKey: [queryKey],
    queryFn,
    ...options,
  });
}
