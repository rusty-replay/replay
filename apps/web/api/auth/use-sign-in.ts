import { useMutation } from '@tanstack/react-query';
import { UseMutationCustomOptions } from '../types';
import { SignInRequest, SignInResponse } from './types';
import { axiosInstance } from '../axios';
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
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem(
        'user',
        JSON.stringify({
          userId: data.userId,
          username: data.username,
          email: data.email,
          role: data.role,
        })
      );

      toast.success('로그인 성공', {
        description: `${data.username}님 환영합니다!`,
      });
    },
    ...options,
  });
}
