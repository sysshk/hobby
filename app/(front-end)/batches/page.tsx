import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/api/auth/auth-config";
import StatusBadge from "@/components/mes/status-badge";
import { batches, BATCH_STATUS_LABEL, BATCH_STATUS_COLOR, BatchStatus } from "@/lib/mock";

const FILTERS: { key: BatchStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "RUNNING", label: "배양중" },
  { key: "COMPLETED", label: "완료" },
  { key: "PLANNED", label: "계획" },
  { key: "ON_HOLD", label: "보류" },
];

export default async function BatchesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">배치 관리</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">배양 배치/로트 목록 및 공정 진행 현황</p>
        </div>
        <button className="rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-[#05221E] transition-colors hover:bg-primary-dark">
          + 신규 배치
        </button>
      </header>

      {/* Filter chips (프레임: 표시용) */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f, i) => (
          <span
            key={f.key}
            className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium ${
              i === 0
                ? "border-primary/40 bg-primary/12 text-primary"
                : "border-border text-[var(--text-secondary)]"
            }`}
          >
            {f.label}
          </span>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-[13px]">
            <thead className="border-b border-border text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">
              <tr>
                <Th>배치번호</Th><Th>제품 / 균주</Th><Th>발효조</Th><Th>상태</Th>
                <Th>현재 공정</Th><Th>진행률</Th><Th>수율</Th><Th>시작</Th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-card-hover">
                  <td className="px-5 py-3.5">
                    <Link href={`/batches/${b.id}`} className="font-semibold text-primary hover:underline">{b.batchNo}</Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium">{b.product}</p>
                    <p className="text-[11px] text-[var(--text-tertiary)]">{b.strain}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[var(--text-secondary)]">{b.reactor}</td>
                  <td className="px-5 py-3.5"><StatusBadge label={BATCH_STATUS_LABEL[b.status]} color={BATCH_STATUS_COLOR[b.status]} /></td>
                  <td className="px-5 py-3.5 text-[var(--text-secondary)]">{b.currentStep}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${b.progress}%`, backgroundColor: BATCH_STATUS_COLOR[b.status] }} />
                      </div>
                      <span className="text-[12px] text-[var(--text-tertiary)]">{b.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {b.actualYield != null ? (
                      <span className="font-semibold text-ok">{b.actualYield}%</span>
                    ) : (
                      <span className="text-[var(--text-tertiary)]">목표 {b.plannedYield}%</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-[var(--text-tertiary)]">{b.startedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 font-medium">{children}</th>;
}
