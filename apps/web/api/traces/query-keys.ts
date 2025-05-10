import { TransactionListQuery } from './types';

export const tracesQueryKeys = {
  getTransactions: (params: TransactionListQuery) => [
    `/api/transactions`,
    params.page,
    params.size,
  ],
  getTransactionSpans: (transactionId: string) =>
    `/api/transactions/${transactionId}/spans`,
};
