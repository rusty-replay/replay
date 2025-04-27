import { useQuery } from '@tanstack/react-query';
import { UseQueryCustomOptions } from '../types';
import { Project } from './types';
import axiosInstance from '../axios';

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
