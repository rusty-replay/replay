import { useQuery } from '@tanstack/react-query';
import { UseQueryCustomOptions } from '../types';
import { EventReportResponse } from './types';
import axiosInstance from '../axios';
import { eventKeys } from './keys';

export function useQueryEventDetail({
  projectId,
  eventId,
  options,
}: {
  projectId: number;
  eventId: number;
  options?: UseQueryCustomOptions<void, EventReportResponse>;
}) {
  const queryKey = eventKeys.detail(projectId, eventId);
  const queryFn = async () =>
    await axiosInstance.get(queryKey).then((res) => res.data);

  return useQuery({
    queryKey: [queryKey],
    queryFn,
    ...options,
  });
}
