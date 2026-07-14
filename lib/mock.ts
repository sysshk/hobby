// ─────────────────────────────────────────────
// 배양공정 MES — 더미 배양 데이터 (프레임 단계용)
// 실제 DB 연동 전까지 화면 골격을 채우는 결정적(deterministic) 목업.
// Math.random 미사용 → SSR/CSR 하이드레이션 일관성 보장.
// ─────────────────────────────────────────────

export type BatchStatus = "RUNNING" | "COMPLETED" | "PLANNED" | "ON_HOLD" | "ABORTED";
export type ReactorStatus = "RUNNING" | "IDLE" | "CLEANING" | "MAINTENANCE";
export type StepStatus = "PENDING" | "IN_PROGRESS" | "DONE" | "SKIPPED";

export interface Batch {
  id: string;
  batchNo: string;
  product: string;
  strain: string;
  reactor: string;
  status: BatchStatus;
  progress: number; // 0-100
  currentStep: string;
  plannedYield: number; // %
  actualYield: number | null; // %
  titer: number | null; // U/mL
  volumeL: number;
  startedAt: string;
  operator: string;
}

export interface Reactor {
  code: string;
  name: string;
  capacityL: number;
  status: ReactorStatus;
  batchNo: string | null;
  temp: number; // °C
  ph: number;
  do: number; // %
  agitation: number; // rpm
}

export interface ProcessStep {
  name: string;
  type: string;
  status: StepStatus;
  durationH: number;
  startedAt: string | null;
}

// ── 라벨/색상 매핑 ────────────────────────────

export const BATCH_STATUS_LABEL: Record<BatchStatus, string> = {
  RUNNING: "배양중",
  COMPLETED: "완료",
  PLANNED: "계획",
  ON_HOLD: "보류",
  ABORTED: "폐기",
};

export const BATCH_STATUS_COLOR: Record<BatchStatus, string> = {
  RUNNING: "var(--run)",
  COMPLETED: "var(--ok)",
  PLANNED: "var(--idle)",
  ON_HOLD: "var(--warn)",
  ABORTED: "var(--danger)",
};

export const REACTOR_STATUS_LABEL: Record<ReactorStatus, string> = {
  RUNNING: "가동중",
  IDLE: "대기",
  CLEANING: "세척(CIP)",
  MAINTENANCE: "정비",
};

export const REACTOR_STATUS_COLOR: Record<ReactorStatus, string> = {
  RUNNING: "var(--run)",
  IDLE: "var(--idle)",
  CLEANING: "var(--warn)",
  MAINTENANCE: "var(--danger)",
};

export const STEP_STATUS_LABEL: Record<StepStatus, string> = {
  PENDING: "대기",
  IN_PROGRESS: "진행중",
  DONE: "완료",
  SKIPPED: "생략",
};

// ── 배치 목록 ─────────────────────────────────

export const batches: Batch[] = [
  {
    id: "b1", batchNo: "B-2026-0714-01", product: "배양제품 A", strain: "생산균주 ST-9",
    reactor: "FR-101", status: "RUNNING", progress: 62, currentStep: "본배양 (Fermentation)",
    plannedYield: 85, actualYield: null, titer: 41200, volumeL: 5000,
    startedAt: "2026-07-11 08:20", operator: "김공정",
  },
  {
    id: "b2", batchNo: "B-2026-0713-02", product: "배양제품 B", strain: "생산균주 ST-7",
    reactor: "FR-102", status: "RUNNING", progress: 88, currentStep: "본배양 (Fermentation)",
    plannedYield: 82, actualYield: null, titer: 38500, volumeL: 5000,
    startedAt: "2026-07-10 22:05", operator: "박배양",
  },
  {
    id: "b3", batchNo: "B-2026-0712-01", product: "배양제품 A", strain: "생산균주 ST-9",
    reactor: "FR-103", status: "RUNNING", progress: 34, currentStep: "종균배양 (Seed)",
    plannedYield: 85, actualYield: null, titer: 12800, volumeL: 2000,
    startedAt: "2026-07-13 06:40", operator: "이발효",
  },
  {
    id: "b4", batchNo: "B-2026-0710-03", product: "배양제품 A", strain: "생산균주 ST-9",
    reactor: "FR-101", status: "COMPLETED", progress: 100, currentStep: "정제 완료",
    plannedYield: 85, actualYield: 87.4, titer: 44100, volumeL: 5000,
    startedAt: "2026-07-06 09:00", operator: "김공정",
  },
  {
    id: "b5", batchNo: "B-2026-0709-01", product: "배양제품 B", strain: "생산균주 ST-7",
    reactor: "FR-102", status: "COMPLETED", progress: 100, currentStep: "정제 완료",
    plannedYield: 82, actualYield: 79.1, titer: 36900, volumeL: 5000,
    startedAt: "2026-07-05 14:30", operator: "박배양",
  },
  {
    id: "b6", batchNo: "B-2026-0715-01", product: "배양제품 A", strain: "생산균주 ST-9",
    reactor: "FR-104", status: "PLANNED", progress: 0, currentStep: "배양 대기",
    plannedYield: 85, actualYield: null, titer: null, volumeL: 5000,
    startedAt: "2026-07-15 08:00", operator: "이발효",
  },
  {
    id: "b7", batchNo: "B-2026-0708-02", product: "배양제품 A", strain: "생산균주 ST-9",
    reactor: "FR-103", status: "ON_HOLD", progress: 45, currentStep: "본배양 (보류)",
    plannedYield: 85, actualYield: null, titer: 21000, volumeL: 5000,
    startedAt: "2026-07-08 11:15", operator: "최품질",
  },
];

// ── 발효조(설비) 현황 ─────────────────────────

export const reactors: Reactor[] = [
  { code: "FR-101", name: "1호 발효조", capacityL: 5000, status: "RUNNING", batchNo: "B-2026-0714-01", temp: 25.2, ph: 6.48, do: 41, agitation: 320 },
  { code: "FR-102", name: "2호 발효조", capacityL: 5000, status: "RUNNING", batchNo: "B-2026-0713-02", temp: 25.0, ph: 6.52, do: 38, agitation: 340 },
  { code: "FR-103", name: "3호 발효조", capacityL: 2000, status: "RUNNING", batchNo: "B-2026-0712-01", temp: 26.1, ph: 6.61, do: 55, agitation: 280 },
  { code: "FR-104", name: "4호 발효조", capacityL: 5000, status: "CLEANING", batchNo: null, temp: 62.0, ph: 7.10, do: 0, agitation: 0 },
  { code: "FR-105", name: "5호 발효조", capacityL: 10000, status: "IDLE", batchNo: null, temp: 22.0, ph: 7.00, do: 0, agitation: 0 },
  { code: "FR-106", name: "6호 발효조", capacityL: 10000, status: "MAINTENANCE", batchNo: null, temp: 21.5, ph: 7.00, do: 0, agitation: 0 },
];

// ── 공정 단계(배치 상세용) ────────────────────

export const processSteps: ProcessStep[] = [
  { name: "종균배양", type: "SEED", status: "DONE", durationH: 24, startedAt: "2026-07-11 08:20" },
  { name: "본배양", type: "FERMENTATION", status: "IN_PROGRESS", durationH: 120, startedAt: "2026-07-12 08:20" },
  { name: "회수", type: "HARVEST", status: "PENDING", durationH: 8, startedAt: null },
  { name: "정제", type: "PURIFICATION", status: "PENDING", durationH: 16, startedAt: null },
  { name: "품질검사", type: "QC", status: "PENDING", durationH: 12, startedAt: null },
];

// ── 배양 시계열 생성기 (결정적) ───────────────

function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646; // 0..1
  };
}

export interface Series {
  key: string;
  label: string;
  unit: string;
  color: string;
  data: number[]; // per-hour values
  hours: number[];
}

// 발효 프로파일: 0~120h, 시간당 1포인트
export function cultureSeries(seed = 42, hours = 120): Series[] {
  const rnd = seeded(seed);
  const t = Array.from({ length: hours + 1 }, (_, i) => i);
  const jitter = (amp: number) => (rnd() - 0.5) * amp;

  // 생균수: 로지스틱 성장 (~35 g/L 포화)
  const biomass = t.map((h) => {
    const v = 35 / (1 + Math.exp(-(h - 40) / 12));
    return round(v + jitter(0.6), 2);
  });
  // 글루코스: 유가식(fed-batch), 소비되며 공급 파동
  const glucose = t.map((h) => {
    const base = 40 - 40 * (1 - Math.exp(-h / 45));
    const feed = 6 * Math.max(0, Math.sin(h / 9));
    return round(Math.max(1, base + feed + jitter(1.2)), 2);
  });
  // 역가: 성장 후 생산기에 상승
  const titer = t.map((h) => {
    const v = 46000 / (1 + Math.exp(-(h - 60) / 15));
    return round(v + jitter(400), 0);
  });
  // pH: 6.5 근처 제어
  const ph = t.map(() => round(6.5 + jitter(0.14), 2));
  // DO(용존산소): 성장기 급감 후 회복
  const dox = t.map((h) => {
    const dip = 60 - 35 * Math.exp(-Math.pow((h - 42) / 22, 2));
    return round(clamp(dip + jitter(3), 10, 95), 1);
  });
  // 온도: 25°C 제어
  const temp = t.map(() => round(25 + jitter(0.4), 2));
  // 교반: 성장기 상승
  const agit = t.map((h) => round(280 + 80 / (1 + Math.exp(-(h - 40) / 15)) + jitter(6), 0));

  return [
    { key: "biomass", label: "생균수 (Biomass)", unit: "g/L", color: "#2DD4BF", data: biomass, hours: t },
    { key: "titer", label: "역가 (Titer)", unit: "U/mL", color: "#A78BFA", data: titer, hours: t },
    { key: "glucose", label: "글루코스", unit: "g/L", color: "#FBBF24", data: glucose, hours: t },
    { key: "do", label: "용존산소 (DO)", unit: "%", color: "#38BDF8", data: dox, hours: t },
    { key: "ph", label: "pH", unit: "", color: "#34D399", data: ph, hours: t },
    { key: "temp", label: "온도", unit: "°C", color: "#F87171", data: temp, hours: t },
    { key: "agitation", label: "교반속도", unit: "rpm", color: "#94A3B8", data: agit, hours: t },
  ];
}

function round(v: number, d: number) {
  const p = Math.pow(10, d);
  return Math.round(v * p) / p;
}
function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

// ── 대시보드 요약 지표 ────────────────────────

export function dashboardStats() {
  const running = batches.filter((b) => b.status === "RUNNING").length;
  const completed = batches.filter((b) => b.status === "COMPLETED");
  const avgYield =
    completed.reduce((s, b) => s + (b.actualYield ?? 0), 0) / (completed.length || 1);
  const activeReactors = reactors.filter((r) => r.status === "RUNNING").length;
  const alarms = 2; // 더미: 활성 알람 수
  return {
    running,
    avgYield: round(avgYield, 1),
    activeReactors,
    totalReactors: reactors.length,
    alarms,
  };
}
