"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listScans, ScanRecord } from "@/lib/storage/scans";
import { SKIN_TYPE_LABEL_TH } from "@/lib/taxonomy";

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanRecord[]>([]);

  useEffect(() => {
    setScans(listScans());
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-teal-900">ประวัติการสแกน</h1>

      {scans.length === 0 ? (
        <div className="rounded-card border border-sand-300 bg-surface p-6 text-center text-sm text-ink/55">
          ยังไม่มีประวัติการสแกน — <Link href="/scan" className="text-teal-600 underline">เริ่มสแกนครั้งแรก</Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {scans.map((s) => {
            const findingLabel =
              s.result.acne.length === 0 ? "ไม่พบลักษณะสิว" : `พบ ${s.result.acne.length} ตำแหน่ง`;
            return (
              <li key={s.id}>
                <Link
                  href={`/result/${s.id}`}
                  className="flex items-center justify-between rounded-card border border-sand-300 bg-surface p-4 hover:border-teal-400 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">{SKIN_TYPE_LABEL_TH[s.result.skinType.label]}</p>
                    <p className="text-xs text-ink/50">{findingLabel}</p>
                  </div>
                  <span className="text-xs text-ink/45">{new Date(s.createdAt).toLocaleDateString("th-TH")}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
