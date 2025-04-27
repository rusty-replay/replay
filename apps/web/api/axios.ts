import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { RefreshTokenResponse } from './auth/types';
import { ResponseError } from './types';
import { toast } from '@workspace/ui/components/sonner';
import { captureException } from 'rusty-replay';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

// 현재 경로가 인증 페이지인지 확인하는 함수
const isAuthPage = () => {
  if (typeof window === 'undefined') return false;

  const path = window.location.pathname;
  return path === '/login' || path === '/signup' || path === '/find-password';
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: ResponseError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;
    console.log('error>>>>>>>>>>>', error);

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const errorCode = error.response?.data?.errorCode;
    console.log('errorCode>>>', errorCode);

    // 인증 관련 에러 처리
    if (
      [
        'InvalidAuthToken',
        'InvalidRefreshToken',
        'ExpiredRefreshToken',
        'ExpiredAuthToken',
        'NeedAuthToken',
      ].includes(errorCode!)
    ) {
      // 인증 페이지(로그인, 회원가입 등)에서는 리다이렉션 및 토큰 갱신 시도를 하지 않음
      if (isAuthPage()) {
        return Promise.reject(error);
      }

      // Refresh 토큰 만료/없음 처리
      if (
        errorCode === 'ExpiredRefreshToken' ||
        errorCode === 'InvalidRefreshToken'
      ) {
        toast.error('세션이 만료되었습니다. 다시 로그인해 주세요.');

        if (!window.location.pathname.includes('/sign-in')) {
          window.location.href = '/sign-in';
        }

        return new Promise(() => {});
      }

      // Access 토큰 만료 처리
      if (
        (errorCode === 'InvalidAuthToken' ||
          errorCode === 'ExpiredAuthToken' ||
          errorCode === 'NeedAuthToken') &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            subscribeTokenRefresh(() => {
              resolve(axiosInstance(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await axiosInstance.post(
            '/auth/refresh',
            {},
            { withCredentials: true }
          );

          isRefreshing = false;
          onRefreshed('');
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;

          if (!isAuthPage()) {
            window.location.href = '/login';
          }

          return new Promise(() => {});
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
