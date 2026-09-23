"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getScan, ScanRecord } from "@/lib/storage/scans";
import ResultCard from "@/components/ResultCard";

export default function ResultPage({ params }: { params: { id: string } }) {
  const [scan, setScan] = useState<ScanRecord | null | undefined>(undefined);

  useEffect(() => {
    setScan(getScan(params.id) ?? null);
  }, [params.id]);

  if (scan === undefined) {
    return <p className="text-sm text-ink/50">กำลังโหลด…</p>;
  }

  if (scan === null) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-ink/60">ไม่พบผลการสแกนนี้</p>
        <Link href="/scan" className="text-sm text-teal-600 underline">
          สแกนใหม่
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-teal-900">ผลการวิเคราะห์ผิว</h1>
        <p className="mt-1 text-xs text-ink/45">
          {new Date(scan.createdAt).toLocaleString("th-TH")} · โมเดลเวอร์ชัน {scan.modelVersion}
        </p>
      </div>
      <ResultCard scan={scan} />
      <div className="flex gap-3">
        <Link
          href="/scan"
          className="rounded-card bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-900 transition-colors"
        >
          สแกนอีกครั้ง
        </Link>
        <Link
          href="/history"
          className="rounded-card border border-sand-300 px-4 py-2.5 text-sm font-medium text-ink/80 hover:border-teal-400 transition-colors"
        >
          ดูประวัติ
        </Link>
      </div>
    </div>
  );
}
