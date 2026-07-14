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

- `Batch` — 발효 배치 (batchNumber, controlType, finalYield)
- `Record` — 배치별 시간 시계열 (timeHr, temperature, ph, dissolvedO2, substrate, penicillin)
- `User` / `Account` / `Session` — 인증 (next-auth)

## 발효 배치 데이터 (IndPenSim)

원본 `.mat` → CSV 변환 후 UI에서 업로드하면 Neon DB에 저장됩니다.

```bash
# 1) 패키지 (이미 설치됨)
npm install papaparse recharts @prisma/client
npm install -D @types/papaparse

# 2) 스키마를 DB에 반영
npx prisma db push
#   (로컬 개발환경이 없으면 scripts/neon-migrate-batch.sql 을 Neon Query 창에 붙여넣어 실행)

# 3) 실제 .mat → CSV 변환 (로컬)
pip install scipy numpy pandas
python scripts/mat_to_csv.py IndPenSim.mat batch1.csv --batch 1 --control recipe
```

- CSV 컬럼: `batchNumber, controlType, timeHr, temperature, ph, dissolvedO2, substrate, penicillin`
- 화면: `/mes/batches` 에서 **＋ CSV 업로드** → 목록(수율 내림차순) → 배치 클릭 → 시계열 차트
- 테스트용 샘플: `scripts/sample-indpensim.csv` (배치 2개)

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
