import { useMutation } from '@tanstack/react-query';
import { UseMutationCustomOptions } from '../types';
import { SignInRequest, SignInResponse } from './types';
import axiosInstance from '../axios';
import { toast } from '@workspace/ui/components/sonner';

export function useSignIn(
  options?: UseMutationCustomOptions<SignInResponse, SignInRequest>
) {
  const mutationKey = '/auth/login';
  const mutationFn = async (data: SignInRequest) =>
    await axiosInstance.post(mutationKey, data).then((res) => res.data);

  return useMutation({
    mutationKey: [mutationKey],
    mutationFn,
    onSuccess: (data) => {
      toast.success('로그인 성공', {
        description: `${data.username}님 환영합니다!`,
      });
    },
    ...options,
  });
}
