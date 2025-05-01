import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../axios';
import { ProjectCreateRequest, ProjectResponse } from './types';
import { toast } from '@workspace/ui/components/sonner';
import { UseMutationCustomOptions } from '../types';
import { projectKeys } from './keys';

export function useCreateProject(
  options?: UseMutationCustomOptions<ProjectResponse, ProjectCreateRequest>
) {
  const queryClient = useQueryClient();

  const mutationKey = `/api/projects`;
  const mutationFn = async (data: ProjectCreateRequest) =>
    await axiosInstance.post(mutationKey, data).then((res) => res.data);

  return useMutation({
    mutationKey: [mutationKey],
    mutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [projectKeys.list()],
      });
    },
    onError: (error) => {
      console.error(error);
    },
    ...options,
  });
}
