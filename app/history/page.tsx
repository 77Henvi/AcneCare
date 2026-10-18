"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { clearScans, deleteScan, listScans, ScanRecord } from "@/lib/storage/scans";
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

// รายการที่กำลังรอการยืนยันการลบ: ที่เลือกไว้ / ทั้งหมด
type PendingDelete = { kind: "selected" } | { kind: "all" } | null;

function TrashIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );
}

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [pending, setPending] = useState<PendingDelete>(null);
  const [notice, setNotice] = useState<string | null>(null);
  // โหมดเลือกหลายรายการเพื่อลบ
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setScans(listScans());
  }, []);

  // ไม่มีรายการเหลือแล้ว -> ออกจากโหมดเลือก
  useEffect(() => {
    if (scans.length === 0 && selectMode) {
      setSelectMode(false);
      setSelected([]);
    }
  }, [scans.length, selectMode]);

  // Esc: ปิดหน้าต่างยืนยัน ถ้าไม่มีหน้าต่างก็ออกจากโหมดเลือก
  useEffect(() => {
    if (!pending && !selectMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (pending) setPending(null);
      else exitSelectMode();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, selectMode]);

  // ข้อความแจ้งผลการลบ หายเองหลัง 3 วินาที
  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(t);
  }, [notice]);

  function exitSelectMode() {
    setSelectMode(false);
    setSelected([]);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const allSelected = scans.length > 0 && selected.length === scans.length;

  function toggleSelectAll() {
    setSelected(allSelected ? [] : scans.map((s) => s.id));
  }

  function confirmDelete() {
    if (!pending) return;
    if (pending.kind === "all") {
      clearScans();
      setNotice("ลบประวัติทั้งหมดแล้ว");
    } else {
      const count = selected.length;
      for (const id of selected) deleteScan(id);
      setNotice(`ลบผลการตรวจ ${count} รายการแล้ว`);
    }
    setScans(listScans());
    setSelected([]);
    setSelectMode(false);
    setPending(null);
  }

  let dialogTitle = "";
  let dialogDesc = "";
  if (pending?.kind === "all") {
    dialogTitle = `ลบประวัติทั้งหมด ${scans.length} รายการ?`;
    dialogDesc = "ข้อมูลทั้งหมดจะถูกลบออกจากเบราว์เซอร์ของคุณ และไม่สามารถกู้คืนได้";
  } else if (pending?.kind === "selected") {
    dialogTitle = `ลบ ${selected.length} รายการที่เลือก?`;
    dialogDesc = "รายการที่เลือกจะถูกลบออกจากเบราว์เซอร์ของคุณ และไม่สามารถกู้คืนได้";
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-3xl px-4 py-8 sm:py-12 space-y-6"
    >
      <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-display text-xs font-bold uppercase tracking-wider text-[#3D6345]">LOCAL RECORDS</span>
          <h1 className="mt-1 font-display text-3xl font-bold text-[#1C3221]">ประวัติการตรวจสิว</h1>
          <p className="mt-1 text-xs sm:text-sm text-ink/70">
            ข้อมูลทั้งหมดบันทึกเฉพาะบนเบราว์เซอร์ของคุณ และลบได้ทุกเมื่อ
          </p>
        </div>
        {scans.length > 0 && !selectMode && (
          <button
            type="button"
            onClick={() => setSelectMode(true)}
            className="self-start inline-flex items-center gap-1.5 border border-sand-300 bg-white px-4 py-2 text-xs font-bold text-ink/80 transition-colors hover:border-[#233B27] hover:text-[#233B27] sm:self-auto"
          >
            <span>เลือกเพื่อลบ</span>
          </button>
        )}
      </motion.div>

      {selectMode && (
        <p className="text-xs sm:text-sm text-ink/70">แตะที่การ์ดเพื่อเลือกรายการที่ต้องการลบ แล้วกด “ลบที่เลือก” ด้านล่าง</p>
      )}

      {notice && (
        <p role="status" className="rounded-lg bg-[#EAF2EC] px-4 py-2.5 text-xs font-semibold text-[#233B27]">
          {notice}
        </p>
      )}

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
            const dateLabel = new Date(s.createdAt).toLocaleDateString("th-TH");
            const isSelected = selected.includes(s.id);

            // ส่วนหัวของการ์ด ใช้ร่วมกันทั้งโหมดปกติและโหมดเลือก
            const summary = (
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-display text-[10px] font-bold uppercase tracking-wider text-[#3D6345]">
                    ผลการตรวจ
                  </span>
                  <p className="font-display text-lg font-bold text-[#1C3221] group-hover:text-[#285532] transition-colors">
                    {s.skinType ? SKIN_TYPE_LABEL_TH[s.skinType] : "ยังไม่ได้ระบุ"}
                  </p>
                </div>
                <span className="rounded-full bg-[#EAF2EC] px-2.5 py-1 text-xs font-semibold text-[#233B27] flex items-center gap-1">
                  <SparklesIcon className="h-3 w-3 text-teal-700" />
                  <span>{findingLabel}</span>
                </span>
              </div>
            );

            return (
              <motion.li key={s.id} variants={item} className="h-full">
                {selectMode ? (
                  // โหมดเลือก: ทั้งการ์ดเป็น <label> ของ checkbox คลิกแล้วสลับการเลือก ไม่เปิดหน้ารายงาน
                  <label
                    className={`group flex h-full cursor-pointer flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all ${
                      isSelected
                        ? "border-[#213C27] bg-[#F4F9F5] ring-1 ring-[#213C27]"
                        : "border-[#E4DDD0] bg-white hover:border-[#567A5B]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(s.id)}
                        aria-label={`เลือกผลการตรวจวันที่ ${dateLabel}`}
                        className="mt-1 h-4 w-4 flex-shrink-0 accent-[#213C27]"
                      />
                      <div className="min-w-0 flex-1">{summary}</div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-sand-200 pt-3 text-xs text-ink/50">
                      <span>{dateLabel}</span>
                      <span className="font-semibold text-[#233B27]">{isSelected ? "เลือกแล้ว" : "แตะเพื่อเลือก"}</span>
                    </div>
                  </label>
                ) : (
                  // โหมดปกติ: คลิกที่การ์ดเพื่อเปิดรายงาน (การลบทำผ่าน "เลือกเพื่อลบ" เท่านั้น)
                  <div className="group flex h-full flex-col justify-between rounded-2xl border border-[#E4DDD0] bg-white shadow-xs transition-all hover:-translate-y-1 hover:border-[#213C27] hover:shadow-lg">
                    <Link href={`/result/${s.id}`} className="block p-5 pb-0">
                      {summary}
                    </Link>
                    <div className="mx-5 mb-5 mt-4 flex items-center justify-between border-t border-sand-200 pt-3 text-xs text-ink/50">
                      <span>{dateLabel}</span>
                      <Link href={`/result/${s.id}`} className="font-bold text-[#233B27] hover:underline">
                        ดูรายงานละเอียด →
                      </Link>
                    </div>
                  </div>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      )}

      {/* ล้างประวัติทั้งหมด: อยู่ท้ายหน้า แยกจากปุ่มที่ใช้บ่อย เพื่อลดโอกาสกดพลาด */}
      {scans.length > 0 && !selectMode && (
        <motion.div
          variants={item}
          className="flex flex-col gap-3 border-t border-sand-300 pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-xs text-ink/60">ต้องการลบประวัติทั้งหมดในอุปกรณ์นี้? การกระทำนี้ย้อนกลับไม่ได้</p>
          <button
            type="button"
            onClick={() => setPending({ kind: "all" })}
            className="inline-flex items-center gap-1.5 self-start border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-700 transition-colors hover:border-red-400 hover:bg-red-50 sm:self-auto"
          >
            <TrashIcon className="h-4 w-4" />
            <span>ล้างประวัติทั้งหมด</span>
          </button>
        </motion.div>
      )}

      {/* แถบจัดการรายการที่เลือก (โหมดเลือก) */}
      {selectMode && scans.length > 0 && (
        <div className="sticky bottom-4 z-30 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sand-300 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
          <span className="text-xs sm:text-sm font-semibold text-[#1C3221]">
            เลือกแล้ว {selected.length} จาก {scans.length} รายการ
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="border border-sand-300 bg-white px-4 py-2 text-xs font-bold text-ink/80 transition-colors hover:border-[#233B27] hover:text-[#233B27]"
            >
              {allSelected ? "ยกเลิกเลือกทั้งหมด" : "เลือกทั้งหมด"}
            </button>
            <button
              type="button"
              onClick={exitSelectMode}
              className="border border-sand-300 bg-white px-4 py-2 text-xs font-bold text-ink/80 transition-colors hover:border-[#233B27] hover:text-[#233B27]"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              disabled={selected.length === 0}
              onClick={() => setPending({ kind: "selected" })}
              className="inline-flex items-center gap-1.5 bg-red-700 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-ink/30"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              <span>ลบที่เลือก ({selected.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* หน้าต่างยืนยันการลบ */}
      <AnimatePresence>
        {pending && (
          <motion.div
            key="confirm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPending(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              aria-describedby="confirm-desc"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-xl"
            >
              <h2 id="confirm-title" className="font-display text-lg font-bold text-[#1C3221]">
                {dialogTitle}
              </h2>
              <p id="confirm-desc" className="text-sm leading-relaxed text-ink/70">
                {dialogDesc}
              </p>
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  autoFocus
                  onClick={() => setPending(null)}
                  className="border border-sand-300 bg-white px-5 py-2.5 text-xs font-bold text-ink/80 transition-colors hover:border-[#233B27] hover:text-[#233B27]"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="bg-red-700 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-800"
                >
                  {pending.kind === "all" ? "ลบทั้งหมด" : "ลบ"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
