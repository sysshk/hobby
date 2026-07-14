import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/auth-config";
import StatusBadge from "@/components/mes/status-badge";
import LineChart from "@/components/mes/line-chart";
import {
  reactors,
  cultureSeries,
  REACTOR_STATUS_LABEL,
  REACTOR_STATUS_COLOR,
} from "@/lib/mock";

export default async function MonitoringPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const running = reactors.filter((r) => r.status === "RUNNING");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">실시간 모니터링</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">가동중 발효조별 배양 파라미터 실시간 현황</p>
        </div>
        <StatusBadge label="LIVE" color="var(--run)" />
      </header>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {running.map((r, idx) => {
          const s = cultureSeries(r.code.charCodeAt(r.code.length - 1) + idx * 7);
          const dox = s.find((x) => x.key === "do")!;
          return (
            <section key={r.code} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">{r.code} · {r.name}</h2>
                  <p className="text-[12px] text-[var(--text-tertiary)]">
                    배치 {r.batchNo} · {r.capacityL.toLocaleString()}L
                  </p>
                </div>
                <StatusBadge label={REACTOR_STATUS_LABEL[r.status]} color={REACTOR_STATUS_COLOR[r.status]} />
              </div>

              <div className="mb-4 grid grid-cols-4 gap-3">
                <Gauge label="온도" value={`${r.temp}`} unit="°C" ok={r.temp >= 24 && r.temp <= 26} />
                <Gauge label="pH" value={r.ph.toFixed(2)} unit="" ok={r.ph >= 6.3 && r.ph <= 6.8} />
                <Gauge label="DO" value={`${r.do}`} unit="%" ok={r.do >= 30} />
                <Gauge label="교반" value={`${r.agitation}`} unit="rpm" ok />
              </div>

              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="mb-1 text-[11px] text-[var(--text-tertiary)]">용존산소(DO) 추이 · %</p>
                <LineChart data={dox.data} color={dox.color} height={120} showAxis={false} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Gauge({ label, value, unit, ok }: { label: string; value: string; unit: string; ok: boolean }) {
  const color = ok ? "var(--ok)" : "var(--warn)";
  return (
    <div className="rounded-xl border border-border bg-surface p-3 text-center">
      <p className="text-[10px] text-[var(--text-tertiary)]">{label}</p>
      <p className="mt-1 text-lg font-bold" style={{ color }}>
        {value}<span className="ml-0.5 text-[11px] font-medium text-[var(--text-tertiary)]">{unit}</span>
      </p>
    </div>
  );
}
