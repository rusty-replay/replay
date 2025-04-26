'use client';

import React, { useState } from 'react';
import { useQueryErrorList } from '@/api/error/use-query-error-list';
import { useRouter } from 'next/navigation';
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
  AlertCircle,
  Search,
  Clock,
  ArrowRight,
  Smartphone,
  Globe,
  Calendar,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ErrorReportListResponse } from '@/api/error/types';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export default function ErrorList({
  projectId,
}: {
  projectId: number | undefined;
}) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const { data: errorList, isLoading } = useQueryErrorList({
    projectId: projectId as number,
    options: {
      enabled: !!projectId,
    },
  });

  const filteredErrors: ErrorReportListResponse[] = errorList
    ? errorList
        .filter((error) => {
          const matchesSearch =
            searchTerm === '' ||
            error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            error.appVersion.includes(searchTerm) ||
            error.groupHash.includes(searchTerm);

          const matchesFilter =
            filter === 'all' || (error as any).environment === filter;

          return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        })
    : [];

  const formatTime = (timestamp: string) => {
    return dayjs(timestamp).fromNow();
  };

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
            <div className="relative w-full sm:w-2/3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="에러 메시지, 버전 또는 해시로 검색..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
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
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
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
                {filteredErrors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {errorList?.length === 0
                        ? '아직 기록된 에러가 없습니다.'
                        : '검색 조건에 맞는 에러가 없습니다.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredErrors.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span
                            title={new Date(error.timestamp).toLocaleString()}
                          >
                            {formatTime(error.timestamp)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium line-clamp-1 max-w-xs">
                          {error.message}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Hash: {error.groupHash}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {error.browser ? (
                            <>
                              <Globe size={14} />
                              <span>
                                {error.browser} / {error.os || 'Unknown'}
                              </span>
                            </>
                          ) : (
                            <>
                              <Smartphone size={14} />
                              <span>앱</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{error.appVersion}</Badge>
                      </TableCell>
                      <TableCell>
                        replay
                        {/* {error.replay &&
                        Array.isArray(error.replay) &&
                        error.replay.length > 0 ? (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800"
                          >
                            사용 가능
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground"
                          >
                            없음
                          </Badge>
                        )} */}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
