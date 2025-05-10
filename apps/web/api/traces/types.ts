export interface TransactionResponse {
  id: number;
  projectId: number;
  traceId: string;
  name: string;
  startTimeStamp: string;
  endTimeStamp: string;
  durationMs: number;
  environment: string;
  tags: string | null;
}

export interface TransactionListQuery {
  page: number;
  size: number;
}
