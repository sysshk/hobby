// 상태 뱃지 — 색 점 + 라벨

export default function StatusBadge({
  label,
  color,
  dot = true,
}: {
  label: string;
  color: string;
  dot?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ color, backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)` }}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />}
      {label}
    </span>
  );
}
