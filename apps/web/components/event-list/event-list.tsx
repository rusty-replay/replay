'use client';

import React, { useReducer, useState } from 'react';
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
import { Checkbox } from '@workspace/ui/components/checkbox';
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
import { Search, Clock, Smartphone, Globe, Play } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DateRange } from 'react-day-picker';
import { useQueryErrorList } from '@/api/event/use-query-event-list';
import { useMutationEventPriority } from '@/api/event/use-mutation-event-priority';
import { useMutationEventStatus } from '@/api/event/use-mutation-event-status';
import { useRouter } from 'next/navigation';
import { DateRangePicker } from '@workspace/ui/components/calendars/date-range-picker';
import { formatDate, formatDateFromNow } from '@/utils/date';
import { PriorityDropdown } from '../ui/priority-dropdown';
import { AssigneeDropdown } from '../ui/assignee-dropdown';
import { useQueryProjectUsers } from '@/api/project/use-query-project-users';
import { EventPriorityType, EventStatusType } from '@/api/event/types';
import { EventStatusDropdown } from '../ui/event-status-dropdown';

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

export default function EventList({ projectId }: { projectId?: number }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [batchPriority, setBatchPriority] = useState<EventPriorityType>();
  const [batchStatus, setBatchStatus] = useState<EventStatusType>();

  const { data: userList } = useQueryProjectUsers({ projectId: projectId! });

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
    options: { enabled: !!projectId },
  });

  const { mutateAsync: mutatePriority, isPending: isMutatingPriority } =
    useMutationEventPriority({ projectId: projectId! });
  const { mutateAsync: mutateStatus, isPending: isMutatingStatus } =
    useMutationEventStatus({ projectId: projectId! });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleAll = (checked: boolean) => {
    if (checked && errorList) {
      setSelectedIds(new Set(errorList.content.map((e) => e.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const applyBatchPriority = async () => {
    if (batchPriority && selectedIds.size > 0) {
      await mutatePriority(
        { eventIds: Array.from(selectedIds), priority: batchPriority },
        { onSuccess: () => setSelectedIds(new Set()) }
      );
    }
  };
  const applyBatchStatus = async () => {
    if (batchStatus && selectedIds.size > 0) {
      await mutateStatus(
        { eventIds: Array.from(selectedIds), status: batchStatus },
        { onSuccess: () => setSelectedIds(new Set()) }
      );
    }
  };

  const navigateToDetail = (issueId: number) => {
    console.log('issueId>>>', issueId);

    router.push(`/project/${projectId}/issues/${issueId}`);
  };

  return (
    <div className="space-y-6">
      {/* 검색 / 필터 바 */}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Issue log</CardTitle>
          <CardDescription>
            프로젝트에서 발생한 모든 에러를 확인할 수 있습니다.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <>
              {/* 배치 액션 바 */}
              {selectedIds.size > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <Select
                    value={batchPriority}
                    onValueChange={(v) =>
                      setBatchPriority(v as EventPriorityType)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIGH">HIGH</SelectItem>
                      <SelectItem value="MED">MED</SelectItem>
                      <SelectItem value="LOW">LOW</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={applyBatchPriority}
                    disabled={!batchPriority || isMutatingPriority}
                  >
                    Apply Priority
                  </Button>
                  <Select
                    value={batchStatus}
                    onValueChange={(v) => setBatchStatus(v as EventStatusType)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNRESOLVED">UNRESOLVED</SelectItem>
                      <SelectItem value="RESOLVED">RESOLVED</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={applyBatchStatus}
                    disabled={!batchStatus || isMutatingStatus}
                  >
                    Apply Status
                  </Button>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox
                        checked={
                          errorList
                            ? selectedIds.size === errorList.content.length
                            : false
                        }
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>시간</TableHead>
                    <TableHead>기기</TableHead>
                    <TableHead>리플레이</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errorList?.content.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        검색 조건에 맞는 에러가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    errorList?.content.map((error) => (
                      <TableRow key={error.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(error.id)}
                            onCheckedChange={() => toggleSelect(error.id)}
                          />
                        </TableCell>
                        <TableCell
                          className="cursor-pointer"
                          onClick={() => navigateToDetail(error.id)}
                        >
                          <div className="font-medium line-clamp-1 max-w-xs">
                            {error.message}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Hash: {error.groupHash}
                          </div>
                        </TableCell>
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
                          {error.hasReplay && (
                            <Badge variant="outline">
                              <Play />
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <PriorityDropdown
                            priority={error.priority}
                            projectId={projectId!}
                            eventId={error.id}
                          />
                        </TableCell>
                        <TableCell>
                          {/* {error.status} */}
                          <EventStatusDropdown
                            projectId={projectId!}
                            eventId={error.id}
                            status={error.status}
                          />
                        </TableCell>
                        <TableCell>
                          <AssigneeDropdown
                            projectId={projectId!}
                            eventId={error.id}
                            userList={userList}
                            currentAssigneeId={error.assignedTo}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
