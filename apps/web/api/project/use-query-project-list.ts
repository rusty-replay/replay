import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../axios';
import { UseQueryCustomOptions } from '../types';
import { Project } from './types';

export function useQueryProjectList(
  options?: UseQueryCustomOptions<void, Project[]>
) {
  const queryKey = `/api/projects`;
  const queryFn = async () =>
    await axiosInstance.get(queryKey).then((res) => res.data);

  return useQuery({
    queryKey: [queryKey],
    queryFn,
    ...options,
  });
}
