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
  EventReportResponse,
} from './types';
import axiosInstance from '../axios';
import { toast } from '@workspace/ui/components/sonner';

export function useMutationEventAssignee({
  projectId,
  eventId,
  options,
}: {
  projectId: number;
  eventId: number;
  options?: UseMutationOptions<
    EventReportListResponse[],
    ResponseError,
    EventAssignee,
    EventAssigneeContext
  >;
}) {
  const queryClient = useQueryClient();
  const queryKey = eventKeys.list(projectId);
  const detailQueryKey = `/api/projects/${projectId}/events/${eventId}`;
  const mutationKey = eventKeys.assignee(projectId);
  const mutationFn = async (data: EventAssignee) =>
    await axiosInstance.put(mutationKey, data).then((res) => res.data);

  return useMutation({
    mutationKey: [mutationKey],
    mutationFn,
    onMutate: async (newAssignee) => {
      await queryClient.cancelQueries({
        queryKey: [queryKey],
      });
      await queryClient.cancelQueries({
        queryKey: [detailQueryKey],
      });

      const previousQueries = queryClient.getQueriesData<
        PaginatedResponse<EventReportListResponse>
      >({
        queryKey: [queryKey],
      });

      const previousDetailQuery = queryClient.getQueryData<EventReportResponse>(
        [detailQueryKey]
      );

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

      queryClient.setQueryData<EventReportResponse>([detailQueryKey], (old) => {
        if (!old) return old;
        return {
          ...old,
          assignedTo: newAssignee.assignedTo,
        };
      });

      return { previousQueries, previousDetailQuery };
    },
    onError: (err, newAssignee, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      if (context?.previousDetailQuery) {
        queryClient.setQueryData([detailQueryKey], context.previousDetailQuery);
      }

      console.error(err);
      toast.error('Failed to update assignee');
    },
    ...options,
  });
}
