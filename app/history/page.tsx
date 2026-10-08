"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { listScans, ScanRecord } from "@/lib/storage/scans";
import { SKIN_TYPE_LABEL_TH } from "@/lib/taxonomy";
import { CameraScanIcon, SparklesIcon } from "@/components/purelis/Icons";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanRecord[]>([]);

  useEffect(() => {
    setScans(listScans());
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-3xl px-4 py-8 sm:py-12 space-y-6"
    >
      <motion.div variants={item}>
        <span className="font-display text-xs font-bold uppercase tracking-wider text-[#3D6345]">LOCAL RECORDS</span>
        <h1 className="mt-1 font-display text-3xl font-bold text-[#1C3221]">ประวัติการตรวจสภาพผิว</h1>
        <p className="mt-1 text-xs sm:text-sm text-ink/70">
          ข้อมูลการตรวจทั้งหมดถูกบันทึกไว้เฉพาะบนเบราว์เซอร์ในอุปกรณ์ของคุณเท่านั้น
        </p>
      </motion.div>

      {scans.length === 0 ? (
        <motion.div variants={item} className="rounded-2xl border border-sand-300 bg-white p-10 text-center space-y-4 shadow-sm">
          <p className="font-display text-lg text-ink/60">ยังไม่มีประวัติการสแกนผิว</p>
          <div>
            <Link href="/scan">
              <motion.span
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 bg-[#213C27] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-[#142618] transition-colors cursor-pointer"
              >
                <CameraScanIcon className="h-4 w-4 text-[#A7D9B0]" />
                <span>เริ่มต้นสแกนผิวครั้งแรก</span>
              </motion.span>
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.ul variants={container} className="grid gap-4 sm:grid-cols-2">
          {scans.map((s) => {
            const findingLabel =
              s.result.acne.length === 0 ? "ไม่พบลักษณะสิว" : `พบสิว ${s.result.acne.length} จุด`;
            return (
              <motion.li key={s.id} variants={item} className="h-full">
                <Link
                  href={`/result/${s.id}`}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-[#E4DDD0] bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-[#213C27] hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-display text-[10px] font-bold uppercase tracking-wider text-[#3D6345]">
                        ผลการตรวจ
                      </span>
                      <p className="font-display text-lg font-bold text-[#1C3221] group-hover:text-[#285532] transition-colors">
                        {s.result.skinType
                          ? typeof s.result.skinType === "string"
                            ? SKIN_TYPE_LABEL_TH[s.result.skinType as keyof typeof SKIN_TYPE_LABEL_TH]
                            : SKIN_TYPE_LABEL_TH[s.result.skinType.label]
                          : "ยังไม่ได้ระบุ"}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#EAF2EC] px-2.5 py-1 text-xs font-semibold text-[#233B27] flex items-center gap-1">
                      <SparklesIcon className="h-3 w-3 text-teal-700" />
                      <span>{findingLabel}</span>
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-sand-200 pt-3 text-xs text-ink/50">
                    <span>{new Date(s.createdAt).toLocaleDateString("th-TH")}</span>
                    <span className="font-bold text-[#233B27] group-hover:underline">ดูรายงานละเอียด →</span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </motion.div>
  );
}
