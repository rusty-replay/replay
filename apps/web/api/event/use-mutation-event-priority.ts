import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
  QueryKey,
} from '@tanstack/react-query';
import { ResponseError } from '../types';
import { EventPriority, EventReportListResponse } from './types';
import axiosInstance from '../axios';
import { eventKeys } from './keys';
import { PaginatedResponse } from '../types';

interface EventReportListContext {
  previousQueries: [
    QueryKey,
    PaginatedResponse<EventReportListResponse> | undefined,
  ][];
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
  const mutationFn = async (data: EventPriority) =>
    await axiosInstance.put(mutationKey, data).then((res) => res.data);

  return useMutation({
    mutationKey: [mutationKey],
    mutationFn,
    onMutate: async (newPriority) => {
      await queryClient.cancelQueries({
        queryKey: [`/api/projects/${projectId}/events`],
      });

      const previousQueries = queryClient.getQueriesData<
        PaginatedResponse<EventReportListResponse>
      >({
        queryKey: [`/api/projects/${projectId}/events`],
      });

      queryClient.setQueriesData<PaginatedResponse<EventReportListResponse>>(
        {
          queryKey: [`/api/projects/${projectId}/events`],
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

      return { previousQueries };
    },
    onError: (err, newPriority, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: [`/api/projects/${projectId}/events`],
    //   });
    // },
    ...options,
  });
}
