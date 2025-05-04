import { useQuery } from '@tanstack/react-query';
import { PaginatedResponse, UseQueryCustomOptions } from '../types';
import { EventQuery, EventReportListResponse } from './types';
import axiosInstance from '../axios';
import { eventKeys } from './keys';

export function useQueryErrorList({
  projectId,
  eventQuery,
  options,
}: {
  projectId: number;
  eventQuery: EventQuery;
  options?: UseQueryCustomOptions<
    void,
    PaginatedResponse<EventReportListResponse>
  >;
}) {
  const queryParams = new URLSearchParams();

  if (eventQuery.search) queryParams.append('search', eventQuery.search);
  if (eventQuery.page) queryParams.append('page', String(eventQuery.page));
  if (eventQuery.pageSize)
    queryParams.append('pageSize', String(eventQuery.pageSize));
  if (eventQuery.startDate)
    queryParams.append('startDate', eventQuery.startDate);
  if (eventQuery.endDate) queryParams.append('endDate', eventQuery.endDate);

  // const fullUrl = `/api/projects/${projectId}/events${queryString ? `?${queryString}` : ''}`;
  const fullUrl = eventKeys.list(projectId, queryParams);

  const queryKey = [eventKeys.list(projectId), eventQuery];

  const queryFn = async () =>
    axiosInstance.get(fullUrl).then((res) => res.data);

  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}
