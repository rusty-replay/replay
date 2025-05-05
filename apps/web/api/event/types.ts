import { AdditionalInfo } from '@workspace/rusty-replay/index';
import { BaseTimeEntity, PaginatedResponse } from '../types';
import { QueryKey } from '@tanstack/react-query';

export interface EventReportResponse extends BaseTimeEntity {
  id: number;
  message: string;
  stacktrace: string;
  appVersion: string;
  timestamp: string;
  groupHash: string;
  replay: string;
  environment: string;
  browser: string | null;
  os: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  projectId: number;
  issueId: number | null;
  additionalInfo: AdditionalInfo | null;
  priority: EventPriorityType | null;
  assignedTo: number | null;
  status: EventStatusType;
}

export interface EventReportListResponse {
  id: number;
  message: string;
  stacktrace: string;
  appVersion: string;
  timestamp: string;
  groupHash: string;
  issueId: number | null;
  browser: string | null;
  os: string | null;
  hasReplay: boolean;
  priority: EventPriorityType | null;
  assignedTo: number | null;
  status: EventStatusType;
}

export interface EventQuery {
  search: string | null;
  page: number;
  pageSize: number;
  startDate: string | null;
  endDate: string | null;
}

interface EventIds {
  eventIds: number[];
}

export interface EventPriority extends EventIds {
  priority: EventPriorityType;
}

export type EventPriorityType = 'HIGH' | 'MED' | 'LOW';
export type EventStatusType = 'RESOLVED' | 'UNRESOLVED';

export interface EventAssignee extends EventIds {
  assignedTo: number | null;
}

export interface EventStatus extends EventIds {
  status: EventStatusType;
}

export interface EventAssigneeContext {
  previousQueries: [
    QueryKey,
    PaginatedResponse<EventReportListResponse> | undefined,
  ][];
  previousDetailQuery: EventReportResponse | undefined;
}

export interface EventStatusContext {
  previousQueries: [
    QueryKey,
    PaginatedResponse<EventReportListResponse> | undefined,
  ][];
  previousDetailQuery: EventReportResponse | undefined;
}
