# 🦀 rusty-replay

웹 클라이언트에서 발생한 오류를 수집하고, 직전 사용자 활동을 리플레이 형태로 함께 전송하는 경량 오류 추적 도구입니다.

`rrweb` 기반의 사용자 행동 리플레이 기능과 `axios` 에러 자동 전송까지 지원합니다.

## 📦 설치

```bash
npm install rusty-replay
```

---

## ⚙️ 초기화

Next.js에서 `rusty-replay`는 일반적으로 `app/providers.tsx` 또는 `layout.tsx`에서 초기화합니다.

```ts
import { init } from 'rusty-replay';

init({
  endpoint: 'https://your-api.com/batch-events',
  apiKey: 'YOUR_PUBLIC_API_KEY',
  flushIntervalMs: 10000, // 버퍼가 찰 때까지 최대 대기 시간 (ms)
  maxBufferSize: 2000000, // 전송 전 최대 버퍼 사이즈 (bytes)
  beforeErrorSec: 10, // 에러 발생 전 몇 초간의 이벤트를 리플레이로 남길지
});
```

---

## 🧠 글로벌 에러 자동 캡처

```
ts
복사편집
import { setupGlobalErrorHandler } from 'rusty-replay';

setupGlobalErrorHandler();

```

- `window.onerror`
- `window.onunhandledrejection`
  을 자동 감지하여 오류를 서버로 전송합니다.

---

## 🔧 Axios 에러 자동 전송

```ts
import axios from 'axios';
import { captureException, AdditionalInfo } from 'rusty-replay';

axios.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error)) {
      const additionalInfo: Partial<AdditionalInfo> = {
        pageUrl: window.location.href,
        request: {
          url: error.config?.url ?? '',
          method: error.config?.method ?? '',
          headers: error.config?.headers ?? {},
        },
        response: {
          status: error.response?.status ?? 0,
          statusText: error.response?.statusText ?? '',
          data: {
            message: error.response?.data?.message ?? '',
            errorCode: error.response?.data?.errorCode ?? '',
          },
        },
      };

      captureException(
        error instanceof Error ? error : new Error('API 요청 실패'),
        additionalInfo
      );
    }

    return Promise.reject(error);
  }
);
```

---

## 🖥️ React Error Boundary 통합

```tsx
import { ErrorBoundary } from 'react-error-boundary';
import { captureException } from 'rusty-replay';

<ErrorBoundaryFallbackComponent={() => <div>오류가 발생했습니다.</div>}
  onError={(error, info) => {
    captureException(error);
  }}
>
  <App />
</ErrorBoundary>

```

---

## 🔁 리플레이 재생 (rrweb-player)

```tsx
import { decompressFromBase64 } from 'rusty-replay';
import 'rrweb-player/dist/style.css';

const events = decompressFromBase64(error.replay);

new Player({
  target: document.getElementById('player')!,
  props: {
    events,
    width: 1000,
    height: 600,
    autoPlay: false,
    showController: true,
    skipInactive: true,
  },
});
```

---

## 📋 서버로 전송되는 데이터 Payload

```ts
{
  message: 'Uncaught TypeError: ...',
  stacktrace: 'TypeError: ...',
  replay: 'compressedBase64Data',
  environment: 'production',
  browser: 'Chrome 123.0',
  os: 'macOS 14',
  userAgent: '...',
  appVersion: '1.0.0',
  apiKey: 'YOUR_API_KEY',
  additionalInfo: {
    request: {...},
    response: {...},
    pageUrl: 'https://your.site/path'
  },
  userId: 123
}

```

---

## 📎 API 참고

### `init(options: InitOptions)`

옵션 설명:

| 옵션              | 타입   | 설명                                   |
| ----------------- | ------ | -------------------------------------- |
| `endpoint`        | string | 에러 수집 서버의 엔드포인트            |
| `apiKey`          | string | 프로젝트 식별용 API Key                |
| `flushIntervalMs` | number | 에러 전송 간격 (기본: 10초)            |
| `maxBufferSize`   | number | 최대 전송 버퍼 크기                    |
| `beforeErrorSec`  | number | 리플레이 수집 구간 (기본: 10초 전까지) |
