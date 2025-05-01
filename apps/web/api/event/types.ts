import { AdditionalInfo } from '@workspace/rusty-replay/index';

export interface EventReportResponse {
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
  createdAt: string;
  updatedAt: string;
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
}

export interface EventQuery {
  search: string | null;
  page: number;
  pageSize: number;
  startDate: string | null;
  endDate: string | null;
}
