"use client";

import { motion } from "framer-motion";
import { ScanRecord } from "@/lib/storage/scans";
import {
  ACNE_LABEL_TH,
  ACNE_SEVERITY,
  FACE_REGION_LABEL_TH,
  SKIN_TYPE_LABEL_TH,
} from "@/lib/taxonomy";
import { MEDICATIONS } from "@/lib/medications";
import { useTreatment } from "@/lib/treatmentContext";
import Disclaimer from "@/components/Disclaimer";

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
        <p className="text-xs font-bold uppercase tracking-wider text-[#3D6345]">ลักษณะผิวที่ AI ประเมิน</p>
        <div className="mt-2 flex items-baseline justify-between">
          <p className="font-serif text-3xl font-bold text-[#1C3A23]">{SKIN_TYPE_LABEL_TH[result.skinType.label]}</p>
          <span className="rounded-full bg-[#EAF2EC] px-3 py-1 text-xs font-semibold text-[#233B27]">
            {Math.round(result.skinType.confidence * 100)}% Confidence
          </span>
        </div>
      </motion.section>

      {/* 2. Detected Acne Findings */}
      <motion.section variants={item} className="rounded-xl border border-sand-300/80 bg-white p-5 sm:p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-[#3D6345]">ลักษณะสิวที่ตรวจพบ</p>
        {result.acne.length === 0 ? (
          <p className="mt-3 text-sm text-ink/70">ไม่พบลักษณะสิวที่ชัดเจนในภาพ — สภาพผิวแลดูปกติ</p>
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
            <span className="text-base">💊</span>
            <p className="text-xs font-bold uppercase tracking-wider text-[#1F3C26]">
              ตัวยารักษาที่เหมาะกับสิวของคุณ
            </p>
          </div>
          <p className="mt-1 text-xs text-[#3E5844]">
            คลิกที่ตัวยาเพื่อดูวิธีใช้ ลำดับการทา และข้อควรระวัง
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {matchedMeds.map((med) => (
              <div
                key={med.id}
                onClick={() => setSelectedMedication(med)}
                className="cursor-pointer rounded-lg border border-sand-300/80 bg-white p-3.5 shadow-xs transition-all hover:border-[#233B27] hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <span className="rounded bg-[#EAF2EC] px-2 py-0.5 text-[10px] font-bold text-[#233B27]">
                    {med.strength}
                  </span>
                  <span className="text-xs text-[#233B27] font-bold">ดูวิธีใช้ →</span>
                </div>
                <h4 className="mt-2 text-sm font-bold text-[#182C1B]">{med.name}</h4>
                <p className="text-[11px] text-[#44614A] line-clamp-1">{med.category}</p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 4. Routine Care Recommendations */}
      <motion.section variants={item} className="rounded-xl border border-sand-300/80 bg-white p-5 sm:p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-[#3D6345]">คำแนะนำการดูแลผิวเบื้องต้น</p>
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
              <span aria-hidden className="font-bold">{r.mandatory ? "⚠" : "✓"}</span>
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
