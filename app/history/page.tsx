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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#3D6345]">LOCAL RECORDS</span>
        <h1 className="mt-1 font-serif text-3xl font-bold text-[#1C3221]">ประวัติการตรวจสภาพผิว</h1>
        <p className="mt-1 text-xs sm:text-sm text-ink/70">
          ข้อมูลการตรวจทั้งหมดถูกบันทึกไว้เฉพาะบนเบราว์เซอร์ในอุปกรณ์ของคุณเท่านั้น
        </p>
      </div>

      {scans.length === 0 ? (
        <div className="rounded-xl border border-sand-300 bg-white p-10 text-center space-y-4 shadow-sm">
          <p className="font-serif text-lg text-ink/60">ยังไม่มีประวัติการสแกนผิว</p>
          <div>
            <Link
              href="/scan"
              className="inline-block bg-[#233B27] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-[#182C1B]"
            >
              📷 เริ่มต้นสแกนผิวครั้งแรก
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {scans.map((s) => {
            const findingLabel =
              s.result.acne.length === 0 ? "ไม่พบลักษณะสิว" : `พบสิว ${s.result.acne.length} จุด`;
            return (
              <li key={s.id} className="h-full">
                <Link
                  href={`/result/${s.id}`}
                  className="group flex h-full flex-col justify-between rounded-xl border border-[#E4DDD0] bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#233B27] hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D6345]">
                        ผลการตรวจ
                      </span>
                      <p className="font-serif text-lg font-bold text-[#1C3221] group-hover:text-[#285532]">
                        {SKIN_TYPE_LABEL_TH[s.result.skinType.label]}
                      </p>
                    </div>
                    <span className="rounded bg-[#EAF2EC] px-2 py-0.5 text-xs font-semibold text-[#233B27]">
                      {findingLabel}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-sand-200 pt-3 text-xs text-ink/50">
                    <span>{new Date(s.createdAt).toLocaleDateString("th-TH")}</span>
                    <span className="font-bold text-[#233B27] group-hover:underline">ดูรายงานละเอียด →</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
