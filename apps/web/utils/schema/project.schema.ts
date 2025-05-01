import { z } from 'zod';

export const CreateProjectSchema = z.object({
  name: z
    .string({
      required_error: '프로젝트 이름을 입력하세요',
    })
    .min(1, { message: '프로젝트 이름을 입력하세요' }),
  description: z.string().optional().nullable(),
});

export type CreateProjectSchemaType = z.infer<typeof CreateProjectSchema>;
