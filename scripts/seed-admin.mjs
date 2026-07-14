// 테스트 관리자 계정 시드 스크립트
// 실행: node scripts/seed-admin.mjs   (DATABASE_URL 필요, .env 자동 로드)
//
// 로그인 정보: admin@admin.com / 대서우1234
// - 앱은 email 컬럼을 로그인 ID로 사용한다 (이메일 형식 필요).
// - 이미 있으면 비밀번호/이름을 갱신(upsert)한다.
//
// 주의: 이 환경(웹/원격)은 네트워크 egress 정책으로 Neon DB에 도달할 수 없어
//       DB가 열려 있는 로컬 PC 또는 CI에서 실행해야 한다.

import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

const EMAIL = "admin@admin.com";
const PASSWORD = "대서우1234";
const NAME = "관리자";
const ROLE = "admin";

if (!process.env.DATABASE_URL) {
  console.error("✖ DATABASE_URL 환경변수가 없습니다. .env를 확인하세요.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const hash = await bcrypt.hash(PASSWORD, 10);
const id = randomUUID();

try {
  await sql`
    INSERT INTO "User" ("id", "email", "name", "password", "role", "updatedAt")
    VALUES (${id}, ${EMAIL}, ${NAME}, ${hash}, ${ROLE}, now())
    ON CONFLICT ("email")
    DO UPDATE SET
      "password"  = EXCLUDED."password",
      "name"      = EXCLUDED."name",
      "role"      = EXCLUDED."role",
      "updatedAt" = now()
  `;
  console.log(`✔ 관리자 계정 준비 완료 → 로그인: ${EMAIL} / ${PASSWORD}`);
} catch (e) {
  console.error("✖ 계정 생성 실패:", e.message);
  if (/relation .*User.* does not exist/i.test(e.message)) {
    console.error("  → 먼저 스키마를 적용하세요: npx prisma db push --force-reset --accept-data-loss");
  }
  process.exit(1);
}
