import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { ResponseError } from '../types';
import {
  EventReportListContext,
  EventReportListResponse,
  EventReportResponse,
  EventStatus,
} from './types';
import axiosInstance from '../axios';
import { eventKeys } from './keys';
import { PaginatedResponse } from '../types';

export function useMutationEventStatus({
  projectId,
  options,
}: {
  projectId: number;
  options?: UseMutationOptions<
    EventReportListResponse[],
    ResponseError,
    EventStatus,
    EventReportListContext
  >;
}) {
  const queryClient = useQueryClient();
  const listQueryKey = eventKeys.list(projectId);
  const mutationFn = (data: EventStatus) =>
    axiosInstance
      .put(eventKeys.status(projectId), data)
      .then((res) => res.data);

  return useMutation({
    mutationKey: [eventKeys.status(projectId)],
    mutationFn,
    onMutate: async (newData) => {
      const { eventIds, status } = newData;

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
              eventIds.includes(evt.id) ? { ...evt, status } : evt
            ),
          };
        }
      );

      eventIds.forEach((id) => {
        const detailKey = [eventKeys.detail(projectId, id)];
        queryClient.setQueryData<EventReportResponse>(detailKey, (old) => {
          if (!old) return old;
          return { ...old, status };
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

// import {
//   useMutation,
//   UseMutationOptions,
//   useQueryClient,
// } from '@tanstack/react-query';
// import {
//   EventReportListResponse,
//   EventReportResponse,
//   EventStatus,
//   EventStatusContext,
// } from './types';
// import { PaginatedResponse, ResponseError } from '../types';
// import { eventKeys } from './keys';
// import axiosInstance from '../axios';
// import { toast } from '@workspace/ui/components/sonner';

// export function useMutationEventStatus({
//   projectId,
//   options,
// }: {
//   projectId: number;
//   options?: UseMutationOptions<
//     EventReportListResponse[],
//     ResponseError,
//     EventStatus,
//     EventStatusContext
//   >;
// }) {
//   const queryClient = useQueryClient();
//   const queryKey = eventKeys.list(projectId);
//   // const detailQueryKey = `/api/projects/${projectId}/events/${eventId}`;
//   const mutationKey = eventKeys.status(projectId);
//   const mutationFn =  (data: EventStatus) =>
//      axiosInstance.put(mutationKey, data).then((res) => res.data);

//   return useMutation({
//     mutationKey: [mutationKey],
//     mutationFn,
//     onMutate: async (newStatus) => {
//       await queryClient.cancelQueries({
//         queryKey: [queryKey],
//       });
//       await queryClient.cancelQueries({
//         queryKey: [detailQueryKey],
//       });

//       const previousQueries = queryClient.getQueriesData<
//         PaginatedResponse<EventReportListResponse>
//       >({
//         queryKey: [queryKey],
//       });

//       const previousDetailQuery = queryClient.getQueryData<EventReportResponse>(
//         [detailQueryKey]
//       );

//       queryClient.setQueriesData<PaginatedResponse<EventReportListResponse>>(
//         {
//           queryKey: [queryKey],
//         },
//         (old) => {
//           if (!old) return old;

//           return {
//             ...old,
//             content: old.content.map((event) =>
//               event.id === eventId
//                 ? { ...event, status: newStatus.status }
//                 : event
//             ),
//           };
//         }
//       );

//       queryClient.setQueryData<EventReportResponse>([detailQueryKey], (old) => {
//         if (!old) return old;
//         return {
//           ...old,
//           status: newStatus.status,
//         };
//       });

//       return { previousQueries, previousDetailQuery };
//     },
//     onError: (err, newStatus, context) => {
//       if (context?.previousQueries) {
//         context.previousQueries.forEach(([queryKey, data]) => {
//           queryClient.setQueryData(queryKey, data);
//         });
//       }

//       if (context?.previousDetailQuery) {
//         queryClient.setQueryData([detailQueryKey], context.previousDetailQuery);
//       }

//       console.error(err);
//       toast.error('Failed to update status');
//     },
//     ...options,
//   });
// }
