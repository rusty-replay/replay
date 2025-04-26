'use client';

import React, { useEffect } from 'react';
import { useGetProjectParams } from './hooks/use-get-project-params';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Separator } from '@workspace/ui/components/separator';
import {
  ArrowLeft,
  Calendar,
  Edit,
  Trash2,
  RefreshCw,
  KeyRound,
  Shield,
} from 'lucide-react';
import { Project } from '@/api/project/types';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import ProjectList from './project-list';
import { useRouter } from 'next/navigation';

dayjs.locale('ko');

export default function ProjectDetail() {
  const router = useRouter();
  const { projectId } = useGetProjectParams();
  const { data: projectList, isLoading } = useQueryProjectList();
  const [currentProject, setCurrentProject] = React.useState<Project | null>(
    null
  );

  useEffect(() => {
    if (projectList && projectId) {
      const project = projectList.find((p) => p.id === Number(projectId));
      setCurrentProject(project || null);
    }
  }, [projectList, projectId]);

  if (!projectId) {
    return <ProjectList />;
  }

  const formatDate = (dateString: string) => {
    try {
      return dayjs(dateString).format('YYYY년 MM월 DD일 HH:mm:ss');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.push('/project');
          }}
        >
          <ArrowLeft size={16} className="mr-2" />
          프로젝트 목록
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.push(`/project/${projectId}/issues`);
          }}
        >
          <Shield size={16} className="mr-2" />
          모든 이슈
        </Button>

        {!isLoading && !currentProject && (
          <Badge variant="destructive">존재하지 않는 프로젝트입니다</Badge>
        )}
      </div>

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      ) : currentProject ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {currentProject.name}
                  </CardTitle>
                  <CardDescription>
                    프로젝트 ID: {currentProject.id}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Edit size={14} />
                    편집
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    삭제
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">설명</h3>
                  <p className="text-muted-foreground">
                    {currentProject.description || '설명이 없습니다.'}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1 text-muted-foreground">
                      API 키
                    </h3>
                    <div className="flex items-center gap-2">
                      <KeyRound size={16} />
                      <Badge variant="outline" className="font-mono">
                        {currentProject.api_key}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1 text-muted-foreground">
                      생성일
                    </h3>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {formatDate(currentProject.created_at)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1 text-muted-foreground">
                      마지막 수정일
                    </h3>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {formatDate(currentProject.updated_at)}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => {
                    router.refresh();
                  }}
                >
                  <RefreshCw size={14} />
                  새로고침
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>프로젝트 설정</CardTitle>
                <CardDescription>프로젝트 설정을 관리합니다</CardDescription>
              </CardHeader>
              <CardContent>
                <p>프로젝트 설정 컨텐츠가 여기에 표시됩니다.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API 설정</CardTitle>
                <CardDescription>
                  API 키 및 관련 설정을 관리합니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>API 설정 컨텐츠가 여기에 표시됩니다.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-lg font-medium">프로젝트를 찾을 수 없습니다</p>
            <p className="text-muted-foreground mt-2">
              요청하신 ID: {projectId}에 해당하는 프로젝트가 존재하지 않습니다.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
