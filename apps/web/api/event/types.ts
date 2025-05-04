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
}

export interface EventQuery {
  search: string | null;
  page: number;
  pageSize: number;
  startDate: string | null;
  endDate: string | null;
}

export interface EventPriority {
  priority: EventPriorityType;
}

export type EventPriorityType = 'HIGH' | 'MED' | 'LOW';

export interface EventAssignee {
  assignedTo: number | null;
}

export interface EventAssigneeContext {
  previousQueries: [
    QueryKey,
    PaginatedResponse<EventReportListResponse> | undefined,
  ][];
}
