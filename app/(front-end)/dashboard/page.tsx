import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/api/auth/auth-config";
import StatCard from "@/components/mes/stat-card";
import StatusBadge from "@/components/mes/status-badge";
import LineChart from "@/components/mes/line-chart";
import {
  batches,
  reactors,
  dashboardStats,
  cultureSeries,
  BATCH_STATUS_LABEL,
  BATCH_STATUS_COLOR,
  REACTOR_STATUS_LABEL,
  REACTOR_STATUS_COLOR,
} from "@/lib/mock";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const s = dashboardStats();
  const titer = cultureSeries(42).find((x) => x.key === "titer")!;
  const running = batches.filter((b) => b.status === "RUNNING");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">페니실린 배양 공정 실시간 현황 요약</p>
      </header>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="배양중 배치" value={s.running} unit="건" accent="var(--run)" hint="현재 진행중인 발효 배치"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h4l3 8 4-16 3 8h4"/></svg>} />
        <StatCard label="평균 수율" value={s.avgYield} unit="%" accent="var(--ok)" hint="완료 배치 기준"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v6M15 7h6"/></svg>} />
        <StatCard label="가동 발효조" value={`${s.activeReactors}/${s.totalReactors}`} accent="var(--primary)" hint="RUNNING 상태 설비"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="3" width="12" height="18" rx="4"/></svg>} />
        <StatCard label="활성 알람" value={s.alarms} unit="건" accent="var(--warn)" hint="확인 필요 이벤트"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Titer trend */}
        <section className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">역가(Titer) 추이 · B-2026-0714-01</h2>
              <p className="text-[12px] text-[var(--text-tertiary)]">본배양 경과 시간별 페니실린 역가 (U/mL)</p>
            </div>
            <StatusBadge label="LIVE" color="var(--run)" />
          </div>
          <LineChart data={titer.data} color={titer.color} unit={titer.unit} height={220} />
        </section>

        {/* Running reactors */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">가동중 발효조</h2>
          <div className="space-y-3">
            {reactors
              .filter((r) => r.status === "RUNNING")
              .map((r) => (
                <div key={r.code} className="rounded-xl border border-border bg-surface p-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13px] font-semibold">{r.code} · {r.name}</span>
                    <StatusBadge label={REACTOR_STATUS_LABEL[r.status]} color={REACTOR_STATUS_COLOR[r.status]} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <Metric label="온도" value={`${r.temp}°`} />
                    <Metric label="pH" value={r.ph.toFixed(2)} />
                    <Metric label="DO" value={`${r.do}%`} />
                    <Metric label="교반" value={r.agitation} />
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>

      {/* Recent batches */}
      <section className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-semibold">최근 배치</h2>
          <Link href="/batches" className="text-[12px] font-medium text-primary hover:underline">전체 보기 →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead className="border-y border-border text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">
              <tr>
                <Th>배치번호</Th><Th>제품</Th><Th>발효조</Th><Th>상태</Th><Th>진행</Th><Th>담당</Th>
              </tr>
            </thead>
            <tbody>
              {batches.slice(0, 5).map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-card-hover">
                  <td className="px-5 py-3">
                    <Link href={`/batches/${b.id}`} className="font-semibold text-primary hover:underline">{b.batchNo}</Link>
                  </td>
                  <td className="px-5 py-3">{b.product}</td>
                  <td className="px-5 py-3 text-[var(--text-secondary)]">{b.reactor}</td>
                  <td className="px-5 py-3"><StatusBadge label={BATCH_STATUS_LABEL[b.status]} color={BATCH_STATUS_COLOR[b.status]} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${b.progress}%`, backgroundColor: BATCH_STATUS_COLOR[b.status] }} />
                      </div>
                      <span className="text-[12px] text-[var(--text-tertiary)]">{b.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[var(--text-secondary)]">{b.operator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-[10px] text-[var(--text-tertiary)]">{label}</p>
      <p className="text-[13px] font-semibold">{value}</p>
    </div>
  );
}
function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-2.5 font-medium">{children}</th>;
}
