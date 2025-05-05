import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import {
  EventReportListResponse,
  EventReportResponse,
  EventStatus,
  EventStatusContext,
} from './types';
import { PaginatedResponse, ResponseError } from '../types';
import { eventKeys } from './keys';
import axiosInstance from '../axios';
import { toast } from '@workspace/ui/components/sonner';

export function useMutationEventStatus({
  projectId,
  eventId,
  options,
}: {
  projectId: number;
  eventId: number;
  options?: UseMutationOptions<
    EventReportListResponse,
    ResponseError,
    EventStatus,
    EventStatusContext
  >;
}) {
  const queryClient = useQueryClient();
  const queryKey = eventKeys.list(projectId);
  const detailQueryKey = `/api/projects/${projectId}/events/${eventId}`;
  const mutationKey = eventKeys.status(projectId, eventId);
  const mutationFn = async (data: EventStatus) =>
    await axiosInstance.put(mutationKey, data).then((res) => res.data);

  return useMutation({
    mutationKey: [mutationKey],
    mutationFn,
    onMutate: async (newStatus) => {
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
                ? { ...event, status: newStatus.status }
                : event
            ),
          };
        }
      );

      queryClient.setQueryData<EventReportResponse>([detailQueryKey], (old) => {
        if (!old) return old;
        return {
          ...old,
          status: newStatus.status,
        };
      });

      return { previousQueries, previousDetailQuery };
    },
    onError: (err, newStatus, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      if (context?.previousDetailQuery) {
        queryClient.setQueryData([detailQueryKey], context.previousDetailQuery);
      }

      console.error(err);
      toast.error('Failed to update status');
    },
    ...options,
  });
}
