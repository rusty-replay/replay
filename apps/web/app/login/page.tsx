import { healthCheck } from '@/api/health-check';
import { Button } from '@workspace/ui/components/button';
import { LoginForm } from '@workspace/ui/components/login-form';

export default function Page() {
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
