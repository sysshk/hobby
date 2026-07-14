"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export interface ChartPoint {
  timeHr: number;
  temperature: number;
  ph: number;
  dissolvedO2: number;
  penicillin: number;
  substrate: number;
}

// 변수마다 스케일이 크게 달라 한 축에 겹치면 안 보이므로 변수별 개별 차트로 분리.
const SERIES: { key: keyof ChartPoint; label: string; color: string; unit?: string }[] = [
  { key: "penicillin", label: "Penicillin (수율)", color: "#A78BFA", unit: "g/L" },
  { key: "temperature", label: "Temperature", color: "#F87171" },
  { key: "ph", label: "pH", color: "#34D399" },
  { key: "dissolvedO2", label: "Dissolved O₂", color: "#38BDF8" },
];

export default function BatchCharts({ data }: { data: ChartPoint[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {SERIES.map((s) => (
        <div key={s.key} className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[13px] font-semibold">{s.label}</span>
            {s.unit && <span className="text-[11px] text-[var(--text-tertiary)]">({s.unit})</span>}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 6, right: 12, bottom: 4, left: -8 }}>
              <CartesianGrid strokeDasharray="3 4" stroke="var(--border)" />
              <XAxis
                dataKey="timeHr"
                type="number"
                domain={["dataMin", "dataMax"]}
                tick={{ fontSize: 10, fill: "var(--text-tertiary)" }}
                stroke="var(--border-strong)"
                tickFormatter={(v: number) => `${Math.round(v)}`}
                label={{ value: "time (h)", position: "insideBottomRight", offset: -2, fontSize: 10, fill: "var(--text-tertiary)" }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--text-tertiary)" }}
                stroke="var(--border-strong)"
                width={44}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                labelFormatter={(v) => `t = ${Number(v).toFixed(2)} h`}
                formatter={(val) => [Number(val).toFixed(3), s.label]}
              />
              <Line
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
