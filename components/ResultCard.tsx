"use client";

import { motion } from "framer-motion";
import { ScanRecord } from "@/lib/storage/scans";
import {
  ACNE_LABEL_TH,
  ACNE_SEVERITY,
  FACE_REGION_LABEL_TH,
  SKIN_TYPE_LABEL_TH,
} from "@/lib/taxonomy";
import { MEDICATIONS, MEDS_BY_ACNE_TYPE, TREATMENT_NOTES } from "@/lib/medications";
import { useTreatment } from "@/lib/treatmentContext";
import Disclaimer from "@/components/Disclaimer";
import { PillCapsuleIcon, AlertTriangleIcon, SparklesIcon, ShieldCheckIcon } from "@/components/purelis/Icons";

const severityDot: Record<string, string> = {
  none: "bg-ink/20",
  low: "bg-[#4A7D52]",
  moderate: "bg-amber-500",
  refer: "bg-red-500",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function ResultCard({ scan }: { scan: ScanRecord }) {
  const { result, recommendations } = scan;
  const { setSelectedMedication } = useTreatment();

  // Find relevant medications based on detected findings
  const detectedTypes = new Set(result.acne.map((a) => a.type));
  const matchedMeds = MEDICATIONS.filter((m) => {
    if (detectedTypes.has("papule") || detectedTypes.has("pustule")) {
      if (m.id === "benzoyl-peroxide" || m.id === "azelaic-acid") return true;
    }
    if (detectedTypes.has("whitehead") || detectedTypes.has("blackhead")) {
      if (m.id === "salicylic-acid" || m.id === "adapalene") return true;
    }
    return false;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* 1. Skin Type Assessment */}
      <motion.section variants={item} className="rounded-xl border border-sand-300/80 bg-white p-5 sm:p-6 shadow-sm">
        <span className="font-display text-xs font-bold uppercase tracking-wider text-[#3D6345]">ลักษณะผิวที่ AI ประเมิน</span>
        <div className="mt-2 flex items-baseline justify-between">
          <p className="font-display text-3xl font-bold text-[#1C3A23]">{SKIN_TYPE_LABEL_TH[result.skinType.label]}</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF2EC] px-3 py-1 text-xs font-semibold text-[#233B27]">
            <SparklesIcon className="h-3 w-3 text-teal-700" />
            <span>{Math.round(result.skinType.confidence * 100)}% Confidence</span>
          </span>
        </div>
      </motion.section>

      {/* 2. Detected Acne Findings */}
      <motion.section variants={item} className="rounded-xl border border-sand-300/80 bg-white p-5 sm:p-6 shadow-sm">
        <span className="font-display text-xs font-bold uppercase tracking-wider text-[#3D6345]">ลักษณะสิวที่ตรวจพบ</span>
        {result.acne.length === 0 ? (
          <p className="mt-3 text-sm text-ink/70">ไม่พบลักษณะสิวที่ชัดเจนในภาพ — สภาพผิวดูปกติ</p>
        ) : (
          <motion.ul variants={container} initial="hidden" animate="show" className="mt-4 space-y-3">
            {result.acne.map((f, i) => (
              <motion.li
                key={i}
                variants={item}
                className="flex items-center justify-between border-t border-sand-200 pt-3 first:border-t-0 first:pt-0"
              >
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${severityDot[ACNE_SEVERITY[f.type]]}`} aria-hidden />
                  <div>
                    <p className="text-sm font-bold text-[#1A2E20]">{ACNE_LABEL_TH[f.type]}</p>
                    <p className="text-xs text-ink/55">บริเวณ: {FACE_REGION_LABEL_TH[f.region]}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-ink/60 bg-sand-100 px-2 py-0.5 rounded">
                  {Math.round(f.confidence * 100)}%
                </span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.section>

      {/* 3. Matched Dermatological Medications */}
      {matchedMeds.length > 0 && (
        <motion.section variants={item} className="rounded-xl border border-[#233B27]/20 bg-gradient-to-br from-[#EAF2EC] to-[#F4F1EA] p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <PillCapsuleIcon className="h-4.5 w-4.5 text-[#1F3C26]" />
            <span className="font-display text-xs font-bold uppercase tracking-wider text-[#1F3C26]">
              ตัวยาที่มักใช้กับสิวลักษณะนี้
            </span>
          </div>
          <p className="mt-1 text-xs text-[#3E5844]">
            คลิกที่ตัวยาเพื่อดูวิธีใช้ ข้อควรระวัง และแหล่งอ้างอิง
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {matchedMeds.map((med) => (
              <motion.div
                key={med.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMedication(med)}
                className="cursor-pointer rounded-lg border border-sand-300/80 bg-white p-4 shadow-xs transition-all hover:border-[#233B27] hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <span className="rounded bg-[#EAF2EC] px-2 py-0.5 text-[10px] font-bold text-[#233B27]">
                    {med.strength}
                  </span>
                  <span className="text-xs text-[#233B27] font-bold">ดูวิธีใช้ →</span>
                </div>
                <h4 className="mt-2 font-display text-sm font-bold text-[#182C1B]">{med.name}</h4>
                <p className="text-[11px] text-[#44614A] line-clamp-1">{med.category}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 4. Routine Care Recommendations */}
      <motion.section variants={item} className="rounded-xl border border-sand-300/80 bg-white p-5 sm:p-6 shadow-sm">
        <span className="font-display text-xs font-bold uppercase tracking-wider text-[#3D6345]">คำแนะนำการดูแลผิวเบื้องต้น</span>
        <motion.ul variants={container} initial="hidden" animate="show" className="mt-3 space-y-2.5">
          {recommendations.map((r) => (
            <motion.li
              key={r.ruleId}
              variants={item}
              className={`flex items-start gap-2.5 text-xs sm:text-sm p-3 rounded-lg ${
                r.mandatory
                  ? "bg-red-50 border border-red-200 text-red-700 font-semibold"
                  : "bg-[#FAF8F5] border border-sand-200 text-[#253D2A]"
              }`}
            >
              {r.mandatory ? (
                <AlertTriangleIcon className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              ) : (
                <ShieldCheckIcon className="h-4 w-4 text-[#233B27] flex-shrink-0 mt-0.5" />
              )}
              <span>{r.text}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>

      <motion.div variants={item}>
        <Disclaimer />
      </motion.div>
    </motion.div>
  );
}
