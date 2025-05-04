import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { eventKeys } from './keys';
import { PaginatedResponse, ResponseError } from '../types';
import {
  EventAssignee,
  EventAssigneeContext,
  EventReportListResponse,
} from './types';
import axiosInstance from '../axios';
import { toast } from '@workspace/ui/components/sonner';

export default function useMutationEventAssignee({
  projectId,
  eventId,
  options,
}: {
  projectId: number;
  eventId: number;
  options?: UseMutationOptions<
    EventReportListResponse,
    ResponseError,
    EventAssignee,
    EventAssigneeContext
  >;
}) {
  const queryClient = useQueryClient();
  const queryKey = eventKeys.list(projectId);
  const mutationKey = eventKeys.assignee(projectId, eventId);
  const mutationFn = async (data: EventAssignee) =>
    await axiosInstance.put(mutationKey, data).then((res) => res.data);

  return useMutation({
    mutationKey: [mutationKey],
    mutationFn,
    onSuccess: () => {
      toast.success('Assignee updated successfully');
    },

    onMutate: async (newAssignee) => {
      await queryClient.cancelQueries({
        queryKey: [queryKey],
      });

      const previousQueries = queryClient.getQueriesData<
        PaginatedResponse<EventReportListResponse>
      >({
        queryKey: [queryKey],
      });

      queryClient.setQueriesData<PaginatedResponse<EventReportListResponse>>(
        {
          queryKey: [queryKey],
        },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            content: old.content.map((event) =>
              event.id === eventId
                ? { ...event, assignedTo: newAssignee.assignedTo }
                : event
            ),
          };
        }
      );

      return { previousQueries };
    },
    onError: (err, newAssignee, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error(err);
      toast.error('Failed to update assignee');
    },

    // onSettled: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: [`/api/projects/${projectId}/events`],
    //   });
    // },
    ...options,
  });
}
