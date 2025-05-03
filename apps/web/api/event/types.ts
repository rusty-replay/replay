import { AdditionalInfo } from '@workspace/rusty-replay/index';
import { BaseTimeEntity } from '../types';

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
}

export interface EventQuery {
  search: string | null;
  page: number;
  pageSize: number;
  startDate: string | null;
  endDate: string | null;
}
