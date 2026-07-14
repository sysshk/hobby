# MES — 공정관리 시스템

발효/공정을 실행·모니터링하기 위한 **MES(Manufacturing Execution System)** 프레임입니다.
현재 단계는 **틀/프레임 + 더미 배양데이터**로 구성되어 있으며, 실제 DB 연동 로직은 이후 단계에서 붙입니다.

## 주요 화면

- **대시보드** (`/mes/dashboard`) — 진행중 배치, 금일 수율, 가동중 발효조, 알람 요약 + 최근 배치 현황
- **배치 관리** (`/mes/batches`) — 배치/로트 목록, 공정 진행 상태
- **배치 상세** (`/mes/batches/[id]`) — 공정 단계 타임라인 + 배양 데이터(pH·DO·온도·교반·글루코스·생균수) 트렌드 차트
- **실시간 모니터링** (`/mes/monitoring`) — 발효조별 실시간 배양 파라미터 모니터링
- **로그인/회원가입** (`/mes/login`, `/mes/join`)

## 도메인 모델 (Prisma)

- `Product` — 생산 제품 (예: 배양제품 A)
- `Reactor` — 발효조/배양기 설비
- `Batch` — 배치/로트 (제품·발효조·상태·수율)
- `ProcessStep` — 공정 단계 (종균배양 → 본배양 → 회수 → 정제)
- `Measurement` — 배양 시계열 측정값 (pH, DO, 온도, 교반속도, 글루코스, 생균수 등)
- `QualityCheck` — 품질 검사 결과
- `User` / `Account` / `Session` — 인증 (next-auth)

## 기술 스택

Next.js 16 · React 19 · TypeScript · Prisma 7 (PostgreSQL / Neon) · next-auth · Tailwind CSS 4

## 개발

```bash
npm install
npm run dev
```

`http://localhost:3000/mes` 로 접속합니다. (`basePath: /mes`)

## 환경변수

```
DATABASE_URL=postgresql://...   # Neon Postgres
AUTH_SECRET=...                 # openssl rand -base64 32
```
