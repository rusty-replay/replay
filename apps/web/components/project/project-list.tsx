'use client';

import React from 'react';
import { useQueryProjectList } from '@/api/project/use-query-project-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Skeleton } from '@workspace/ui/components/skeleton';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { PlusCircle, RefreshCw, ArrowRight, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDateFromNow } from '@/utils/date';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export default function ProjectList() {
  const router = useRouter();
  const { data: projectList, isLoading, refetch } = useQueryProjectList();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">프로젝트 목록</CardTitle>
          <CardDescription>
            전체 {projectList?.length || 0}개의 프로젝트가 있습니다
          </CardDescription>
        </div>
        <Button size={'sm'} className="flex items-center gap-2">
          <PlusCircle size={16} />새 프로젝트
        </Button>
      </CardHeader>
      <CardContent>
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
                <TableHead className="w-16">ID</TableHead>
                <TableHead>프로젝트명</TableHead>
                <TableHead>API 키</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>생성일</TableHead>
                <TableHead>수정일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectList?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.id}</TableCell>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {project.apiKey}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {project.description || '설명 없음'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {formatDateFromNow(project.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {formatDateFromNow(project.updatedAt)}
                    </div>
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        router.push(`/project/${project.id}`);
                      }}
                    >
                      상세보기
                      <ArrowRight size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!projectList || projectList.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    프로젝트가 없습니다. 새 프로젝트를 생성해보세요.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => refetch()}
        >
          <RefreshCw size={14} />
          새로고침
        </Button>
      </CardFooter>
    </Card>
  );
}
