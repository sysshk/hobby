import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/api/auth/auth-config";
import StatusBadge from "@/components/mes/status-badge";
import LineChart from "@/components/mes/line-chart";
import {
  batches,
  processSteps,
  cultureSeries,
  BATCH_STATUS_LABEL,
  BATCH_STATUS_COLOR,
  STEP_STATUS_LABEL,
} from "@/lib/mock";

const STEP_COLOR: Record<string, string> = {
  DONE: "var(--ok)",
  IN_PROGRESS: "var(--run)",
  PENDING: "var(--idle)",
  SKIPPED: "var(--text-tertiary)",
};

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const batch = batches.find((b) => b.id === id);
  if (!batch) notFound();

  const series = cultureSeries(id.charCodeAt(id.length - 1) + 40);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Breadcrumb + header */}
      <div>
        <Link href="/batches" className="text-[12px] text-[var(--text-tertiary)] hover:text-primary">← 배치 목록</Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{batch.batchNo}</h1>
          <StatusBadge label={BATCH_STATUS_LABEL[batch.status]} color={BATCH_STATUS_COLOR[batch.status]} />
        </div>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {batch.product} · {batch.strain} · {batch.reactor} · 담당 {batch.operator}
        </p>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Info label="현재 공정" value={batch.currentStep} />
        <Info label="배양량" value={`${batch.volumeL.toLocaleString()} L`} />
        <Info label="수율" value={batch.actualYield != null ? `${batch.actualYield}%` : `목표 ${batch.plannedYield}%`} />
        <Info label="역가" value={batch.titer != null ? `${batch.titer.toLocaleString()} U/mL` : "—"} />
      </div>

      {/* Process step timeline */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-5 text-sm font-semibold">공정 단계</h2>
        <div className="flex flex-col gap-0 md:flex-row md:items-start md:gap-0">
          {processSteps.map((step, i) => (
            <div key={step.name} className="flex flex-1 gap-3 md:flex-col md:gap-2">
              <div className="flex flex-col items-center md:w-full md:flex-row">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-bold"
                  style={{ color: STEP_COLOR[step.status], backgroundColor: `color-mix(in srgb, ${STEP_COLOR[step.status]} 16%, transparent)` }}>
                  {step.status === "DONE" ? "✓" : i + 1}
                </span>
                {i < processSteps.length - 1 && (
                  <span className="my-1 h-6 w-px bg-border md:my-0 md:h-px md:w-full" />
                )}
              </div>
              <div className="pb-6 md:pb-0 md:pr-4">
                <p className="text-[13px] font-semibold">{step.name}</p>
                <p className="text-[11px]" style={{ color: STEP_COLOR[step.status] }}>{STEP_STATUS_LABEL[step.status]}</p>
                <p className="mt-0.5 text-[11px] text-[var(--text-tertiary)]">{step.durationH}h · {step.startedAt ?? "미시작"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Culture data charts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">배양 데이터 트렌드</h2>
          <span className="text-[12px] text-[var(--text-tertiary)]">본배양 경과시간 기준 (0–120h)</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {series.map((sr) => {
            const last = sr.data[sr.data.length - 1];
            return (
              <div key={sr.key} className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: sr.color }} />
                    <span className="text-[13px] font-semibold">{sr.label}</span>
                  </div>
                  <span className="text-[13px] font-bold" style={{ color: sr.color }}>
                    {last >= 1000 ? Math.round(last).toLocaleString() : last} {sr.unit}
                  </span>
                </div>
                <LineChart data={sr.data} color={sr.color} unit={sr.unit} height={150} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-[11px] text-[var(--text-tertiary)]">{label}</p>
      <p className="mt-1 text-[15px] font-semibold">{value}</p>
    </div>
  );
}
