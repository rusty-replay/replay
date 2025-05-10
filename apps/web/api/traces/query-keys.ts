import { TransactionListQuery } from './types';

export const tracesQueryKeys = {
  getTransactions: (params: TransactionListQuery) => [
    `/api/transactions`,
    params.page,
    params.size,
  ],
};
