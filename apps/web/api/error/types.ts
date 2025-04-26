import { AdditionalInfo } from 'rusty-replay';

export interface ErrorReportResponse {
  id: number;
  message: string;
  stacktrace: string;
  appVersion: string;
  timestamp: string;
  groupHash: string;
  replay: any;
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

export interface ErrorReportListResponse {
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
