import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/auth-config";
import StatusBadge from "@/components/mes/status-badge";
import { reactors, REACTOR_STATUS_LABEL, REACTOR_STATUS_COLOR } from "@/lib/mock";

export default async function EquipmentPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">설비 / 발효조</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">발효조 설비 목록 및 가동 상태</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reactors.map((r) => (
          <div key={r.code} className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/12 text-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="3" width="12" height="18" rx="4"/><path d="M6 14c3 2 9 2 12 0"/></svg>
                </span>
                <div>
                  <p className="text-[14px] font-bold">{r.code}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">{r.name}</p>
                </div>
              </div>
              <StatusBadge label={REACTOR_STATUS_LABEL[r.status]} color={REACTOR_STATUS_COLOR[r.status]} />
            </div>

            <div className="mb-3 flex items-center justify-between text-[12px]">
              <span className="text-[var(--text-tertiary)]">용량</span>
              <span className="font-semibold">{r.capacityL.toLocaleString()} L</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[var(--text-tertiary)]">진행 배치</span>
              <span className="font-semibold">{r.batchNo ?? "—"}</span>
            </div>

            {r.status === "RUNNING" && (
              <div className="mt-4 grid grid-cols-4 gap-2 border-t border-border pt-4 text-center">
                <Mini label="온도" value={`${r.temp}°`} />
                <Mini label="pH" value={r.ph.toFixed(2)} />
                <Mini label="DO" value={`${r.do}%`} />
                <Mini label="교반" value={`${r.agitation}`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-[var(--text-tertiary)]">{label}</p>
      <p className="text-[13px] font-semibold">{value}</p>
    </div>
  );
}
