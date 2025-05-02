# rusty replay

**rusty replay**는 Sentry와 같은 제한된 세션 리플레이를 해결하기 위해 개발된 오류 추적 및 세션 리플레이 솔루션입니다. 무제한 세션 캡처와 데이터 소유권을 가진 채 비용을 크게 절감할 수 있습니다.

## 주요 기능

### 오류 추적

- 자동 전역 오류 처리 (`window.onerror`, `unhandledrejection`)
- 스택 트레이스 캡처 및 소스 매핑
- 브라우저 및 환경 정보 수집

### 세션 리플레이

- 오류 발생 전 최대 10초 동안의 사용자 활동 기록
- DOM 스냅샷 및 상호작용 캡처
- 시간별 이벤트 추적

### 대시보드

- 다중 프로젝트 관리
- 이슈 및 이벤트 목록
- 인터랙티브 세션 리플레이 뷰어
- 스택 트레이스 분석

## 대시보드 화면

### 프로젝트 상세보기

<img width="500" alt="r-1" src="https://github.com/user-attachments/assets/459f4fd2-d074-4fd1-9a09-fe52ca05813f" />

- 프로젝트의 모든 오류 이벤트를 종합적으로 볼 수 있는 대시보드

### 프로젝트 이벤트 타임라인

<img width="500" alt="r-2" src="https://github.com/user-attachments/assets/98437a01-ebe0-4235-bae3-e9a8b67373d1" />

- 프로젝트에서 캡처된 모든 이벤트를 시간순으로 확인

### 이벤트 목록

<img width="500" alt="r-3" src="https://github.com/user-attachments/assets/cc86a2ff-73b2-4a80-841c-d1b7952a35bf" />

- 모든 이벤트를 한눈에 확인

### 이벤트 상세보기

<img width="500" alt="r-4" src="https://github.com/user-attachments/assets/6cd280f1-f62e-4c4a-9eaa-36d63d805e68" />

- 이벤트 발생 시간, API 정보, 스택 트레이스 등 자세한 정보를 확인

### 스택 트레이스 분석

<img width="500" alt="r-5" src="https://github.com/user-attachments/assets/63252d6f-a0fb-499b-9513-c614f58792d8" />

- 오류가 발생한 정확한 위치와 원인을 파악

### 세션 리플레이

<img width="500" alt="r-7" src="https://github.com/user-attachments/assets/7fb90cae-1b12-48a9-88e4-7e45cb707091" />

- 오류 발생 전 사용자 활동을 재생하여 문제 상황 파악

## 기술 스택

- **프론트엔드 SDK**: TypeScript, rrweb
- **프론트엔드 대시보드**: Next.js v15
- **백엔드**: Rust, Actix-Web
- **데이터베이스**: MySQL, SeaORM


### 🔄 flow chart
<img width="500" alt="r-4" src="https://github.com/user-attachments/assets/652bebb0-2a5f-48c7-b9d5-bfe0221c7acc" />

```
rusty-replay/
├── apps
│   └── web          # Dashboard (Next.js + rrweb)
├── packages
│   ├── rusty-replay # SDK (TypeScript + rrweb)
│   └── ui           # Shared UI components
```

## 🦀 Backend Repository

🔗 **GitHub 저장소**: [rusty-replay/replay-be](https://github.com/rusty-replay/replay-be)

## 🕹️ SDK Repository

📦 NPM 패키지: [`npm i rusty-replay`](https://www.npmjs.com/package/rusty-replay)
📖 [SDK 사용법 바로가기](https://github.com/rusty-replay/replay/tree/main/packages/rusty-replay#readme)
