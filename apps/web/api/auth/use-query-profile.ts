import { useQuery } from '@tanstack/react-query';
import { authKeys } from './keys';
import axiosInstance from '../axios';
import { UseQueryCustomOptions } from '../types';
import { UserResponse } from './types';

export function useQueryProfile(
  options?: UseQueryCustomOptions<void, UserResponse>
) {
  const queryKey = authKeys.profile();
  const queryFn = async () =>
    await axiosInstance.get(queryKey).then((res) => res.data);

  return useQuery({
    queryKey: [queryKey],
    queryFn,
    ...options,
  });
}
