import { NextResponse } from "next/server";
import Papa from "papaparse";
import { prisma } from "@/lib/prisma";

// CSV 컬럼: batchNumber, controlType, timeHr, temperature, ph, dissolvedO2, substrate, penicillin
interface Row {
  batchNumber: number;
  controlType: string | number | null;
  timeHr: number;
  temperature: number;
  ph: number;
  dissolvedO2: number;
  substrate: number;
  penicillin: number;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "CSV 파일이 필요합니다. (field name: file)" }, { status: 400 });
    }

    const text = await (file as File).text();
    const parsed = Papa.parse<Row>(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      return NextResponse.json(
        { error: "CSV 파싱 오류", details: parsed.errors.slice(0, 5) },
        { status: 400 }
      );
    }

    const rows = parsed.data.filter(
      (r) => r.batchNumber != null && r.timeHr != null && r.penicillin != null
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: "유효한 데이터 행이 없습니다." }, { status: 400 });
    }

    // batchNumber 기준으로 그룹핑
    const groups = new Map<number, Row[]>();
    for (const r of rows) {
      const n = Number(r.batchNumber);
      if (!groups.has(n)) groups.set(n, []);
      groups.get(n)!.push(r);
    }

    const results: { batchNumber: number; records: number; finalYield: number }[] = [];

    for (const [batchNumber, groupRows] of groups) {
      // 시간순 정렬 후 마지막 penicillin 값 = finalYield
      groupRows.sort((a, b) => Number(a.timeHr) - Number(b.timeHr));
      const finalYield = Number(groupRows[groupRows.length - 1].penicillin);
      const controlType =
        groupRows[0].controlType != null ? String(groupRows[0].controlType) : null;

      // batchNumber 기준 upsert (기존이면 갱신)
      const batch = await prisma.batch.upsert({
        where: { batchNumber },
        create: { batchNumber, controlType, finalYield },
        update: { controlType, finalYield },
      });

      // 기존 record 전부 삭제 후 재삽입
      await prisma.record.deleteMany({ where: { batchId: batch.id } });
      await prisma.record.createMany({
        data: groupRows.map((r) => ({
          batchId: batch.id,
          timeHr: Number(r.timeHr),
          temperature: Number(r.temperature),
          ph: Number(r.ph),
          dissolvedO2: Number(r.dissolvedO2),
          substrate: Number(r.substrate),
          penicillin: Number(r.penicillin),
        })),
      });

      results.push({ batchNumber, records: groupRows.length, finalYield });
    }

    return NextResponse.json({
      message: "업로드 완료",
      batches: results.length,
      totalRecords: rows.length,
      results,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: "업로드 처리 중 오류가 발생했습니다.", detail: message }, { status: 500 });
  }
}
