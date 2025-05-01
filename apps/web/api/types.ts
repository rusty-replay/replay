import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ERROR_CODE } from './error-code';

type ResponseError = AxiosError<{
  errorCode: keyof typeof ERROR_CODE;
  message: string;
}>;

type UseMutationCustomOptions<TData = unknown, TVariables = unknown> = Omit<
  UseMutationOptions<TData, ResponseError, TVariables, unknown>,
  'mutationFn'
>;
type UseQueryCustomOptions<TQueryFnData = unknown, TData = TQueryFnData> = Omit<
  UseQueryOptions<TQueryFnData, ResponseError, TData, QueryKey>,
  'queryKey'
>;

interface BaseTimeEntity {
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  content: T[];
  page: number;
  pageSize: number;
  totalElements: number;
  filteredElements: number;
  totalPages: number;
  hasNext: boolean;
}

export type {
  ResponseError,
  UseMutationCustomOptions,
  UseQueryCustomOptions,
  BaseTimeEntity,
  PaginatedResponse,
};
