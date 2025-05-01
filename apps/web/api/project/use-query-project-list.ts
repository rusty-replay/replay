import { useQuery } from '@tanstack/react-query';
import { UseQueryCustomOptions } from '../types';
import { Project } from './types';
import axiosInstance from '../axios';
import { projectKeys } from './keys';

export function useQueryProjectList(
  options?: UseQueryCustomOptions<void, Project[]>
) {
  const queryKey = projectKeys.list();
  const queryFn = async () =>
    await axiosInstance.get(queryKey).then((res) => res.data);

  return useQuery({
    queryKey: [queryKey],
    queryFn,
    ...options,
  });
}
