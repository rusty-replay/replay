import { useQuery } from '@tanstack/react-query';
import { projectKeys } from './keys';
import { UseQueryCustomOptions } from '../types';
import { ProjectMemberResponse } from './types';
import axiosInstance from '../axios';

export function useQueryProjectUsers({
  projectId,
  options,
}: {
  projectId: number;
  options?: UseQueryCustomOptions<void, ProjectMemberResponse[]>;
}) {
  const queryKey = projectKeys.userList(projectId);
  const queryFn = async () =>
    await axiosInstance.get(queryKey).then((res) => res.data);

  return useQuery({
    queryKey: [queryKey],
    queryFn,
    ...options,
  });
}
