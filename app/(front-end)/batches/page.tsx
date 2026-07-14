import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/api/auth/auth-config";
import { prisma } from "@/lib/prisma";
import BatchUpload from "@/components/mes/batch-upload";

export const dynamic = "force-dynamic";

export default async function BatchesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const batches = await prisma.batch.findMany({
    orderBy: [{ finalYield: "desc" }],
    include: { _count: { select: { records: true } } },
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">발효 배치</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          IndPenSim 발효 배치 데이터 · 최종 수율(penicillin) 내림차순
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        <BatchUpload />
      </section>

      <section className="rounded-2xl border border-border bg-card">
        {batches.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-[var(--text-tertiary)]">
            아직 배치가 없습니다. 위에서 CSV를 업로드하세요.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead className="border-b border-border text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">
                <tr>
                  <Th>배치번호</Th>
                  <Th>제어방식</Th>
                  <Th>레코드 수</Th>
                  <Th>최종 수율 (penicillin)</Th>
                  <Th>등록일</Th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-card-hover">
                    <td className="px-5 py-3.5">
                      <Link href={`/batches/${b.batchNumber}`} className="font-semibold text-primary hover:underline">
                        Batch #{b.batchNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-[var(--text-secondary)]">{b.controlType ?? "—"}</td>
                    <td className="px-5 py-3.5 text-[var(--text-secondary)]">{b._count.records.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-ok">
                        {b.finalYield != null ? b.finalYield.toFixed(3) : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-[var(--text-tertiary)]">
                      {b.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 font-medium">{children}</th>;
}
