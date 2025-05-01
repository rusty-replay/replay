import { useBooleanState } from '@/hooks/use-boolean-state';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { Label } from '@workspace/ui/components/label';
import { toast } from '@workspace/ui/components/sonner';
import { Plus } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateProjectSchema,
  CreateProjectSchemaType,
} from '@/utils/schema/project.schema';
import { useCreateProject } from '@/api/project/use-create-project';

export function CreateProject() {
  const createState = useBooleanState();
  const { mutateAsync: createProject, isPending: isCreating } =
    useCreateProject();

  const form = useForm<CreateProjectSchemaType>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      name: undefined,
      description: undefined,
    },
  });

  console.log(form.watch());

  const handleCreateProject = async (data: CreateProjectSchemaType) => {
    await createProject(data, {
      onSuccess: () => {
        toast.success('프로젝트가 생성되었습니다!');
        createState.close();
        form.reset();
      },
      onError: (error) => {
        toast.error('프로젝트 생성에 실패했습니다.');
      },
    });
  };

  return (
    <Dialog open={createState.isOpen} onOpenChange={createState.toggle}>
      <Button
        onClick={() => {
          createState.open();
        }}
        size={'sm'}
        className="flex items-center gap-2"
        type="button"
      >
        <Plus size={16} />새 프로젝트
      </Button>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(handleCreateProject)}>
          <DialogHeader>
            <DialogTitle>새 프로젝트 생성</DialogTitle>
            <DialogDescription>
              새 프로젝트 정보를 입력하세요. 완료되면 저장 버튼을 클릭하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                프로젝트명
              </Label>
              <Controller
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="프로젝트 이름을 입력하세요"
                      className="col-span-3"
                    />
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                설명
              </Label>
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => {
                  return (
                    <Textarea
                      id={field.name}
                      {...field}
                      value={field.value ?? undefined}
                      placeholder="프로젝트 설명을 입력하세요"
                      className="col-span-3"
                    />
                  );
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isCreating}>
              저장하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
