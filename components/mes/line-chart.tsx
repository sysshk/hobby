// 순수 SVG 라인차트 — hooks 없음, 서버/클라이언트 어디서든 렌더 가능.
// 외부 차트 라이브러리 의존 없이 배양 시계열을 표시한다.

interface LineChartProps {
  data: number[];
  color?: string;
  unit?: string;
  height?: number;
  showAxis?: boolean;
  xLabel?: string;
}

export default function LineChart({
  data,
  color = "#2DD4BF",
  unit = "",
  height = 180,
  showAxis = true,
  xLabel,
}: LineChartProps) {
  const width = 640;
  const padL = showAxis ? 44 : 6;
  const padR = 12;
  const padT = 12;
  const padB = showAxis ? 26 : 6;

  if (!data.length) {
    return <div style={{ height }} className="grid place-items-center text-tertiary text-sm">데이터 없음</div>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;

  const x = (i: number) => padL + (i / (data.length - 1 || 1)) * innerW;
  const y = (v: number) => padT + innerH - ((v - min) / span) * innerH;

  const linePts = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const areaPts = `${padL},${padT + innerH} ${linePts} ${x(data.length - 1)},${padT + innerH}`;
  const gid = `g-${color.replace(/[^a-z0-9]/gi, "")}`;

  const lastIdx = data.length - 1;
  const fmt = (v: number) => (Math.abs(v) >= 1000 ? Math.round(v).toLocaleString() : v.toFixed(1));

  // y grid lines (min, mid, max)
  const yTicks = [max, (max + min) / 2, min];
  // x ticks (0h .. last)
  const xTickIdx = [0, Math.floor(lastIdx / 2), lastIdx];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {showAxis &&
        yTicks.map((v, i) => (
          <g key={i}>
            <line
              x1={padL}
              x2={width - padR}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <text x={padL - 8} y={y(v) + 3} textAnchor="end" fontSize="10" fill="var(--text-tertiary)">
              {fmt(v)}
            </text>
          </g>
        ))}

      <polygon points={areaPts} fill={`url(#${gid})`} />
      <polyline points={linePts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {/* last point marker */}
      <circle cx={x(lastIdx)} cy={y(data[lastIdx])} r="3.5" fill={color} />
      <circle cx={x(lastIdx)} cy={y(data[lastIdx])} r="7" fill={color} fillOpacity="0.18" />

      {showAxis &&
        xTickIdx.map((i) => (
          <text key={i} x={x(i)} y={height - 8} textAnchor="middle" fontSize="10" fill="var(--text-tertiary)">
            {i}h
          </text>
        ))}
      {showAxis && unit && (
        <text x={padL} y={padT - 2} fontSize="10" fill="var(--text-tertiary)">
          {unit}
        </text>
      )}
      {xLabel && (
        <text x={width - padR} y={height - 8} textAnchor="end" fontSize="10" fill="var(--text-tertiary)">
          {xLabel}
        </text>
      )}
    </svg>
  );
}
