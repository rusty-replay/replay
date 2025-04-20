'use client';

import { healthCheck } from '@/api/health-check';
import { LoginForm } from '@/components/login-form';
import { Button } from '@workspace/ui/components/button';

export default function SignInPage() {
  const { data, refetch } = healthCheck({ enabled: false });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
        <Button size={'sm'} onClick={() => refetch()}>
          health check
        </Button>
      </div>
    </div>
  );
}
