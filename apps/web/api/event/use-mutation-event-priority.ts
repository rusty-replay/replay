import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
  QueryKey,
} from '@tanstack/react-query';
import { ResponseError } from '../types';
import {
  EventPriority,
  EventReportListContext,
  EventReportListResponse,
  EventReportResponse,
} from './types';
import axiosInstance from '../axios';
import { eventKeys } from './keys';
import { PaginatedResponse } from '../types';

export function useMutationEventPriority({
  projectId,
  options,
}: {
  projectId: number;
  options?: UseMutationOptions<
    EventReportListResponse[],
    ResponseError,
    EventPriority,
    EventReportListContext
  >;
}) {
  const queryClient = useQueryClient();
  const listQueryKey = eventKeys.list(projectId);
  const mutationFn = (data: EventPriority) =>
    axiosInstance
      .put(eventKeys.priority(projectId), data)
      .then((res) => res.data);

  return useMutation({
    mutationKey: [eventKeys.priority(projectId)],
    mutationFn,
    onMutate: async (newData) => {
      const { eventIds, priority } = newData;

      await queryClient.cancelQueries({ queryKey: [listQueryKey] });

      const previousQueries = queryClient.getQueriesData<
        PaginatedResponse<EventReportListResponse>
      >({
        queryKey: [listQueryKey],
      });

      const previousDetailQueries: Record<
        number,
        EventReportResponse | undefined
      > = {};
      eventIds.forEach((id) => {
        const key = [`/api/projects/${projectId}/events/${id}`];
        previousDetailQueries[id] =
          queryClient.getQueryData<EventReportResponse>(key);
      });

      queryClient.setQueriesData<PaginatedResponse<EventReportListResponse>>(
        { queryKey: [listQueryKey] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            content: old.content.map((evt) =>
              eventIds.includes(evt.id) ? { ...evt, priority } : evt
            ),
          };
        }
      );

      eventIds.forEach((id) => {
        const detailKey = [eventKeys.detail(projectId, id)];
        queryClient.setQueryData<EventReportResponse>(detailKey, (old) => {
          if (!old) return old;
          return { ...old, priority };
        });
      });

      return { previousQueries, previousDetailQueries };
    },
    onError: (err, newData, context) => {
      context?.previousQueries.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      if (context?.previousDetailQueries) {
        Object.entries(context.previousDetailQueries).forEach(([id, data]) => {
          const detailKey = [`/api/projects/${projectId}/events/${id}`];
          queryClient.setQueryData(detailKey, data);
        });
      }
    },
    ...options,
  });
}
