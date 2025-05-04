import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
  QueryKey,
} from '@tanstack/react-query';
import { ResponseError } from '../types';
import {
  EventPriority,
  EventReportListResponse,
  EventReportResponse,
} from './types';
import axiosInstance from '../axios';
import { eventKeys } from './keys';
import { PaginatedResponse } from '../types';

interface EventReportListContext {
  previousQueries: [
    QueryKey,
    PaginatedResponse<EventReportListResponse> | undefined,
  ][];
  previousDetailQuery: EventReportResponse | undefined;
}

export function useMutationEventPriority({
  projectId,
  eventId,
  options,
}: {
  projectId: number;
  eventId: number;
  options?: UseMutationOptions<
    EventReportListResponse,
    ResponseError,
    EventPriority,
    EventReportListContext
  >;
}) {
  const queryClient = useQueryClient();
  const mutationKey = eventKeys.priority(projectId, eventId);
  const detailQueryKey = `/api/projects/${projectId}/events/${eventId}`;
  const eventListQueryKey = eventKeys.list(projectId);
  const mutationFn = async (data: EventPriority) =>
    await axiosInstance.put(mutationKey, data).then((res) => res.data);

  return useMutation({
    mutationKey: [mutationKey],
    mutationFn,
    onMutate: async (newPriority) => {
      await queryClient.cancelQueries({
        queryKey: [eventListQueryKey],
      });
      await queryClient.cancelQueries({
        queryKey: [detailQueryKey],
      });

      const previousQueries = queryClient.getQueriesData<
        PaginatedResponse<EventReportListResponse>
      >({
        queryKey: [eventListQueryKey],
      });

      const previousDetailQuery = queryClient.getQueryData<EventReportResponse>(
        [detailQueryKey]
      );

      queryClient.setQueriesData<PaginatedResponse<EventReportListResponse>>(
        {
          queryKey: [eventListQueryKey],
        },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            content: old.content.map((event) =>
              event.id === eventId
                ? { ...event, priority: newPriority.priority }
                : event
            ),
          };
        }
      );

      queryClient.setQueryData<EventReportResponse>([detailQueryKey], (old) => {
        if (!old) return old;
        return {
          ...old,
          priority: newPriority.priority,
        };
      });

      return { previousQueries, previousDetailQuery };
    },
    onError: (err, newPriority, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      if (context?.previousDetailQuery) {
        queryClient.setQueryData([detailQueryKey], context.previousDetailQuery);
      }
    },
    ...options,
  });
}
