```tsx
// layout.tsx or RootLayout.tsx
useEffect(() => {
  init({
    endpoint: 'http://localhost:8080/batch-errors', // endpoint
    apiKey: 'proj_c08cd1b02c9449c9a0d41f084ee92db9', // project id
    flushIntervalMs: 5000, // 5초마다 한번씩 전송
    maxBufferSize: 200, // 큐에 최대 200건까지
    beforeErrorSec: 30, // 에러 전 30초 리플레이 이벤트 포함
  });
}, []);

<button
  onClick={() => {
    captureException(new Error('의도적으로 발생시킨 수동 에러'), {
      additionalInfo: {
        context: '수동 에러 리포팅 테스트',
        button: '수동 에러 버튼',
      },
    });
  }}
  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
>
  수동 에러 발생 및 리포트
</button>;
```
