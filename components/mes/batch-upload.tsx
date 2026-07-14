"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function BatchUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/mes/api/batches/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ ok: false, text: data.error || "업로드 실패" });
      } else {
        setMsg({ ok: true, text: `배치 ${data.batches}개 · 레코드 ${data.totalRecords}행 저장됨` });
        router.refresh();
      }
    } catch {
      setMsg({ ok: false, text: "네트워크 오류" });
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleUpload(f);
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-[#05221E] transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {loading ? "업로드 중…" : "＋ CSV 업로드"}
      </button>
      {msg && (
        <span className={`text-[12px] font-medium ${msg.ok ? "text-ok" : "text-danger"}`}>{msg.text}</span>
      )}
      <span className="text-[11px] text-[var(--text-tertiary)]">
        컬럼: batchNumber, controlType, timeHr, temperature, ph, dissolvedO2, substrate, penicillin
      </span>
    </div>
  );
}
