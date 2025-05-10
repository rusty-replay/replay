import { useQuery } from '@tanstack/react-query';
import { tracesQueryKeys } from './query-keys';
import axiosInstance from '../axios';
import { PaginationResponse, UseQueryCustomOptions } from '../types';
import { TransactionListQuery, TransactionResponse } from './types';

export function useQueryTransactions(
  params: TransactionListQuery = { page: 1, size: 10 },
  options?: UseQueryCustomOptions<void, PaginationResponse<TransactionResponse>>
) {
  const queryKey = tracesQueryKeys.getTransactions(params);

  const queryFn = async () => {
    const response = await axiosInstance.get(queryKey[0] as string, { params });
    return response.data;
  };

  return useQuery({
    queryKey,
    queryFn,
    placeholderData: (keepPreviousData) => keepPreviousData,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}
