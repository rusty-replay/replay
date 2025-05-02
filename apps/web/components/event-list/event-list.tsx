'use client';

import React, { useReducer } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Button } from '@workspace/ui/components/button';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Badge } from '@workspace/ui/components/badge';
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import {
  Search,
  Clock,
  ArrowRight,
  Smartphone,
  Globe,
  Play,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DateRange } from 'react-day-picker';
import { useQueryErrorList } from '@/api/event/use-query-event-list';
import { useRouter } from 'next/navigation';
import { DateRangePicker } from '@workspace/ui/components/calendars/date-range-picker';
import { formatDate, formatDateFromNow } from '@/utils/date';

dayjs.extend(relativeTime);
dayjs.locale('ko');

type State = {
  searchTerm: string;
  filter: string;
  page: number;
  pageSize: number;
  dateRange: DateRange | undefined;
};

type Action =
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_FILTER'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_DATE_RANGE'; payload: DateRange | undefined };

const initialState: State = {
  searchTerm: '',
  filter: 'all',
  page: 1,
  pageSize: 30,
  dateRange: undefined,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload, page: 1 };
    case 'SET_FILTER':
      return { ...state, filter: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload, page: 1 };
    default:
      return state;
  }
}

export default function EventList({
  projectId,
}: {
  projectId: number | undefined;
}) {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  const { data: errorList, isLoading } = useQueryErrorList({
    projectId: projectId as number,
    eventQuery: {
      search: state.searchTerm,
      page: state.page,
      pageSize: state.pageSize,
      startDate: state.dateRange?.from
        ? dayjs(state.dateRange.from).startOf('day').toISOString()
        : null,
      endDate: state.dateRange?.to
        ? dayjs(state.dateRange.to).endOf('day').toISOString()
        : null,
    },
    options: {
      enabled: !!projectId,
    },
  });

  const navigateToDetail = (issueId: number) => {
    router.push(`/project/${projectId}/issues/${issueId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Issue log</CardTitle>
          <CardDescription>
            프로젝트에서 발생한 모든 에러를 확인할 수 있습니다.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative w-full sm:w-1/3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="에러 메시지, 버전 또는 해시로 검색..."
                className="pl-8"
                value={state.searchTerm}
                onChange={(e) =>
                  dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })
                }
              />
            </div>

            <Select
              value={state.filter}
              onValueChange={(val) =>
                dispatch({ type: 'SET_FILTER', payload: val })
              }
            >
              <SelectTrigger className="w-full sm:w-1/3">
                <SelectValue placeholder="환경 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 환경</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>

            <div className="w-full sm:w-1/3">
              <DateRangePicker
                dateRange={state.dateRange}
                onDateRangeChange={(range) =>
                  dispatch({ type: 'SET_DATE_RANGE', payload: range })
                }
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>시간</TableHead>
                    <TableHead>에러</TableHead>
                    <TableHead>기기</TableHead>
                    <TableHead>버전</TableHead>
                    <TableHead>리플레이</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errorList?.content.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        검색 조건에 맞는 에러가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    errorList?.content.map((error) => (
                      <TableRow key={error.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <div
                              title={error.timestamp}
                              className="flex items-center gap-3"
                            >
                              <span>{formatDateFromNow(error.timestamp)}</span>
                              <span>{formatDate(error.timestamp)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium line-clamp-1 max-w-xs">
                            {error.message}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Hash: {error.groupHash}
                          </div>
                        </TableCell>
                        <TableCell>
                          {error.browser ? (
                            <div className="flex items-center gap-2">
                              <Globe size={14} />
                              <span>
                                {error.browser} / {error.os || 'Unknown'}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Smartphone size={14} />
                              <span>앱</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{error.appVersion}</Badge>
                        </TableCell>
                        <TableCell>
                          {error.hasReplay ? (
                            <Badge variant="outline">
                              <Play />
                            </Badge>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigateToDetail(error.id)}
                          >
                            상세보기
                            <ArrowRight size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-muted-foreground">
                  전체 {errorList?.filteredElements ?? 0}건
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={state.page === 1}
                    onClick={() =>
                      dispatch({ type: 'SET_PAGE', payload: state.page - 1 })
                    }
                  >
                    이전
                  </Button>
                  <span className="text-sm">
                    {state.page} / {errorList?.totalPages ?? 1}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!errorList?.hasNext}
                    onClick={() =>
                      dispatch({ type: 'SET_PAGE', payload: state.page + 1 })
                    }
                  >
                    다음
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
