import { useBooleanState } from '@/hooks/use-boolean-state';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { Label } from '@workspace/ui/components/label';
import { toast } from '@workspace/ui/components/sonner';
import { Plus } from 'lucide-react';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateProjectSchema,
  CreateProjectSchemaType,
} from '@/utils/schema/project.schema';
import { useCreateProject } from '@/api/project/use-create-project';
import { ConfirmationModal } from '@workspace/ui/components/dialogs/confirmation-modal';

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

  useEffect(() => {
    if (createState.isOpen) {
      form.clearErrors();
    }
  }, [createState.isOpen]);

  console.log('form.formState', form.formState.errors);

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
    <>
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

      <ConfirmationModal
        visible={createState.isOpen}
        title="새 프로젝트 생성"
        confirmLabel="저장하기"
        cancelLabel="취소"
        onConfirm={form.handleSubmit(handleCreateProject)}
        onCancel={createState.close}
        loading={isCreating}
        size="md"
        className="sm:max-w-[425px]"
      >
        <div>
          <p className="text-sm text-gray-500 mb-4">
            새 프로젝트 정보를 입력하세요. 완료되면 저장 버튼을 클릭하세요.
          </p>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                프로젝트명
              </Label>
              <div className="col-span-3">
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="프로젝트 이름을 입력하세요"
                        autoFocus
                        aria-invalid={!!form.formState.errors.name}
                        error={form.formState.errors.name?.message}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                설명
              </Label>
              <div className="col-span-3">
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
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </ConfirmationModal>
    </>
  );
}
