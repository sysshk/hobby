// 대시보드 KPI 카드
import { ReactNode } from "react";

export default function StatCard({
  label,
  value,
  unit,
  hint,
  accent = "var(--primary)",
  icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  accent?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border-strong">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[12px] font-medium text-[var(--text-secondary)]">{label}</span>
        {icon && (
          <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ color: accent, backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)` }}>
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">{value}</span>
        {unit && <span className="text-sm font-medium text-[var(--text-tertiary)]">{unit}</span>}
      </div>
      {hint && <p className="mt-2 text-[12px] text-[var(--text-tertiary)]">{hint}</p>}
    </div>
  );
}
