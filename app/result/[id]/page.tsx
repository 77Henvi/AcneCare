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
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="font-serif text-base text-ink/60">กำลังโหลดผลการวิเคราะห์…</p>
      </div>
    );
  }

  if (scan === null) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-4">
        <p className="font-serif text-lg text-ink/70">ไม่พบผลการสแกนนี้</p>
        <Link
          href="/scan"
          className="inline-block bg-[#233B27] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
        >
          สแกนใหม่
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12 space-y-6">
      <div className="border-b border-sand-300/80 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#3D6345]">DERMATOLOGY REPORT</span>
        <h1 className="mt-1 font-serif text-3xl font-bold text-[#1C3221]">ผลการวิเคราะห์ผิวและตัวยาแนะนำ</h1>
        <p className="mt-1 text-xs text-ink/50">
          ตรวจเมื่อ: {new Date(scan.createdAt).toLocaleString("th-TH")} · โมเดลเวอร์ชัน {scan.modelVersion}
        </p>
      </div>

      <ResultCard scan={scan} />

      <div className="flex flex-wrap gap-3 pt-4">
        <Link
          href="/scan"
          className="bg-[#233B27] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#182C1B] transition-colors"
        >
          📷 สแกนผิวอีกครั้ง
        </Link>
        <Link
          href="/history"
          className="border border-sand-300 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink/80 hover:border-[#233B27] hover:text-[#233B27] transition-colors"
        >
          ดูประวัติการตรวจ
        </Link>
      </div>
    </div>
  );
}
