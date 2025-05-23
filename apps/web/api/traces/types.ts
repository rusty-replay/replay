import { BaseTimeEntity } from '../types';

export interface TransactionResponse extends Pick<BaseTimeEntity, 'createdAt'> {
  id: number;
  projectId: number;
  traceId: string;
  name: string;
  startTimestamp: string;
  endTimestamp: string;
  durationMs: number;
  environment: string;
  tags: string | null;
}

export interface SpansResponse {
  id: number;
  transactionId: number;
  spanId: string;
  parentSpanId: string | null;
  name: string;
  startTimestamp: string;
  endTimestamp: string;
  durationMs: number;
  httpMethod: string | null;
  httpUrl: string | null;
  httpStatusCode: number | null;
  httpStatusText: string | null;
  httpResponseContentLength: number | null;
  httpHost: string | null;
  httpScheme: string | null;
  httpUserAgent: string | null;
}

export interface TransactionListQuery {
  page: number;
  size: number;
}

export interface TransactionWithSpanResponse {
  transaction: TransactionResponse;
  spans: SpansResponse[];
}
