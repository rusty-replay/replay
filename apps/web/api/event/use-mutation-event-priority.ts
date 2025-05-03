import { useMutation } from '@tanstack/react-query';
import { UseMutationCustomOptions } from '../types';
import { EventPriority, EventReportResponse } from './types';
import axiosInstance from '../axios';
import { eventKeys } from './keys';

export function useMutationEventPriority({
  projectId,
  eventId,
  options,
}: {
  projectId: number;
  eventId: number;
  options?: UseMutationCustomOptions<EventReportResponse, EventPriority>;
}) {
  const mutationKey = eventKeys.priority(projectId, eventId);
  const mutationFn = async (data: EventPriority) =>
    await axiosInstance
      .put(mutationKey, data)
      .then((res) => res.data as EventReportResponse);

  return useMutation({
    mutationKey: [mutationKey],
    mutationFn,
    onSuccess: (data) => {},
    ...options,
  });
}
