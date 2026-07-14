import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/api/auth/auth-config";
import { prisma } from "@/lib/prisma";
import BatchCharts, { ChartPoint } from "@/components/mes/batch-charts";

export const dynamic = "force-dynamic";

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ batchNumber: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { batchNumber } = await params;
  const num = parseInt(batchNumber, 10);
  if (Number.isNaN(num)) notFound();

  const batch = await prisma.batch.findUnique({
    where: { batchNumber: num },
    include: { records: { orderBy: { timeHr: "asc" } } },
  });
  if (!batch) notFound();

  const data: ChartPoint[] = batch.records.map((r) => ({
    timeHr: r.timeHr,
    temperature: r.temperature,
    ph: r.ph,
    dissolvedO2: r.dissolvedO2,
    penicillin: r.penicillin,
    substrate: r.substrate,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <Link href="/batches" className="text-[12px] text-[var(--text-tertiary)] hover:text-primary">
          ← 배치 목록
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Batch #{batch.batchNumber}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          제어방식 {batch.controlType ?? "—"} · 레코드 {batch.records.length.toLocaleString()}행
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Info label="최종 수율 (penicillin)" value={batch.finalYield != null ? batch.finalYield.toFixed(3) : "—"} />
        <Info label="측정 시간 범위" value={data.length ? `0 – ${Math.round(data[data.length - 1].timeHr)} h` : "—"} />
        <Info label="레코드 수" value={batch.records.length.toLocaleString()} />
        <Info label="제어방식" value={batch.controlType ?? "—"} />
      </div>

      {data.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card px-5 py-16 text-center text-sm text-[var(--text-tertiary)]">
          이 배치에 레코드가 없습니다.
        </div>
      ) : (
        <BatchCharts data={data} />
      )}
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
