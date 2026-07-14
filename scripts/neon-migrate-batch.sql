-- 발효 배치 스키마로 전환 (Neon Query 창용 단일 문장). User 등 인증 테이블은 유지.
DO $do$
BEGIN
  -- 구 더미 도메인 제거 (빈 테이블) + 발효 배치(IndPenSim) 스키마 추가
  -- User/Account/Session/VerificationToken 은 그대로 유지
  
  -- DropTable (old domain)
  DROP TABLE IF EXISTS "QualityCheck" CASCADE;
  DROP TABLE IF EXISTS "Measurement" CASCADE;
  DROP TABLE IF EXISTS "ProcessStep" CASCADE;
  DROP TABLE IF EXISTS "Batch" CASCADE;
  DROP TABLE IF EXISTS "Reactor" CASCADE;
  DROP TABLE IF EXISTS "Product" CASCADE;
  
  -- DropEnum
  DROP TYPE IF EXISTS "ReactorStatus";
  DROP TYPE IF EXISTS "BatchStatus";
  DROP TYPE IF EXISTS "StepType";
  DROP TYPE IF EXISTS "StepStatus";
  DROP TYPE IF EXISTS "MetricType";
  DROP TYPE IF EXISTS "QcResult";
  
  -- CreateTable
  CREATE TABLE "Batch" (
      "id" TEXT NOT NULL,
      "batchNumber" INTEGER NOT NULL,
      "controlType" TEXT,
      "finalYield" DOUBLE PRECISION,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
      CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
  );
  
  -- CreateTable
  CREATE TABLE "Record" (
      "id" TEXT NOT NULL,
      "batchId" TEXT NOT NULL,
      "timeHr" DOUBLE PRECISION NOT NULL,
      "temperature" DOUBLE PRECISION NOT NULL,
      "ph" DOUBLE PRECISION NOT NULL,
      "dissolvedO2" DOUBLE PRECISION NOT NULL,
      "substrate" DOUBLE PRECISION NOT NULL,
      "penicillin" DOUBLE PRECISION NOT NULL,
  
      CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
  );
  
  -- CreateIndex
  CREATE UNIQUE INDEX "Batch_batchNumber_key" ON "Batch"("batchNumber");
  
  -- CreateIndex
  CREATE INDEX "Record_batchId_timeHr_idx" ON "Record"("batchId", "timeHr");
  
  -- AddForeignKey
  ALTER TABLE "Record" ADD CONSTRAINT "Record_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
END
$do$;
