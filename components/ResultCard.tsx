"use client";

import { motion } from "framer-motion";
import { ScanRecord } from "@/lib/storage/scans";
import {
  ACNE_LABEL_TH,
  ACNE_SEVERITY,
  AcneType,
  SKIN_TYPE_LABEL_TH,
} from "@/lib/taxonomy";
import { MEDICATIONS } from "@/lib/medications";
import { useTreatment } from "@/lib/treatmentContext";
import Disclaimer from "@/components/Disclaimer";
import { PillCapsuleIcon, AlertTriangleIcon, ShieldCheckIcon } from "@/components/purelis/Icons";

const severityDot: Record<string, string> = {
  none: "bg-ink/20",
  low: "bg-[#4A7D52]",
  moderate: "bg-amber-500",
  refer: "bg-red-500",
};

// สีกรอบบนภาพ ใช้ระดับความรุนแรงชุดเดียวกับจุดสีในรายการ
const severityBox: Record<string, string> = {
  none: "border-ink/30",
  low: "border-[#4A7D52]",
  moderate: "border-amber-500",
  refer: "border-red-500",
};

const severityTag: Record<string, string> = {
  none: "bg-ink/60",
  low: "bg-[#4A7D52]",
  moderate: "bg-amber-600",
  refer: "bg-red-600",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// "สิวหัวขาว (สิวอุดตันหัวปิด)" -> "สิวหัวขาว" ใช้เป็นป้ายสั้น ๆ บนกรอบ
const shortLabel = (type: AcneType) => ACNE_LABEL_TH[type].split(" (")[0];

interface TypeSummary {
  type: AcneType;
  count: number;
  bestConfidence: number;
}

export default function ResultCard({ scan }: { scan: ScanRecord }) {
  const { result, recommendations } = scan;
  const { setSelectedMedication } = useTreatment();

  // สรุปเป็นรายชนิด: จำนวนกล่อง + คะแนนสูงสุดของชนิดนั้น เรียงชนิดที่พบมากสุดก่อน
  const summaryByType = new Map<AcneType, TypeSummary>();
  for (const finding of result.acne) {
    const current = summaryByType.get(finding.type);
    if (current) {
      current.count += 1;
      current.bestConfidence = Math.max(current.bestConfidence, finding.confidence);
    } else {
      summaryByType.set(finding.type, { type: finding.type, count: 1, bestConfidence: finding.confidence });
    }
  }
  const typeSummaries = [...summaryByType.values()].sort((a, b) => b.count - a.count);

  // ภาพที่เก็บไว้ + กล่อง (รายการเก่าที่บันทึกก่อนมีฟีเจอร์นี้จะไม่มีภาพหรือกล่อง)
  const boxedFindings = result.acne.filter((f) => f.box);
  const showImage = Boolean(scan.image);

  // Find relevant medications based on detected findings
  const detectedTypes = new Set(result.acne.map((a) => a.type));
  // มีสิวระดับ "ควรพบแพทย์" -> ไม่แนะนำตัวยาซื้อเอง ให้สอดคล้องกับกฎ refer_dermatologist ใน rules.ts
  const needsReferral = result.acne.some((a) => ACNE_SEVERITY[a.type] === "refer");
  const matchedMeds = needsReferral ? [] : MEDICATIONS.filter((m) => {
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
      {/* 1. Skin Type */}
      <motion.section variants={item} className="rounded-xl border border-sand-300/80 bg-white p-5 sm:p-6 shadow-sm">
        <span className="font-display text-xs font-bold uppercase tracking-wider text-[#3D6345]">ประเภทผิวที่คุณเลือก</span>
        <p className="mt-2 font-display text-3xl font-bold text-[#1C3A23]">
          {scan.skinType ? SKIN_TYPE_LABEL_TH[scan.skinType] : "ยังไม่ได้ระบุ"}
        </p>
      </motion.section>

      {/* 2. Detected Acne Findings */}
      <motion.section variants={item} className="rounded-xl border border-sand-300/80 bg-white p-5 sm:p-6 shadow-sm">
        <span className="font-display text-xs font-bold uppercase tracking-wider text-[#3D6345]">ลักษณะสิวที่ตรวจพบ</span>

        {showImage && (
          <div className="mt-4 overflow-hidden rounded-lg border border-sand-300/80 bg-ink/5">
            {/* กล่องวางทับเป็น % ของภาพ จึงต้องห่อด้วย inline-block ที่มีขนาดเท่ารูปพอดี */}
            <div className="relative mx-auto w-fit max-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={scan.image} alt="ภาพที่ตรวจพร้อมกรอบสิว" className="block max-h-[28rem] w-auto max-w-full" />
              {boxedFindings.map((f, i) => {
                const severity = ACNE_SEVERITY[f.type];
                return (
                  <div
                    key={i}
                    className={`pointer-events-none absolute border-2 ${severityBox[severity]}`}
                    style={{
                      left: `${f.box.x1 * 100}%`,
                      top: `${f.box.y1 * 100}%`,
                      width: `${(f.box.x2 - f.box.x1) * 100}%`,
                      height: `${(f.box.y2 - f.box.y1) * 100}%`,
                    }}
                  >
                    <span
                      className={`absolute whitespace-nowrap px-1 text-[10px] font-bold leading-4 text-white ${severityTag[severity]} ${
                        // วางป้ายไว้เหนือกรอบ ถ้าชิดขอบบนของภาพให้วางในกรอบแทน และชิดขวาถ้ากรอบอยู่ครึ่งขวาของภาพ ไม่ให้ถูกตัดขอบ
                        f.box.y1 >= 0.06 ? "bottom-full" : "top-0"
                      } ${f.box.x1 > 0.5 ? "right-0" : "left-0"}`}
                    >
                      {shortLabel(f.type)} {Math.round(f.confidence * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {typeSummaries.length === 0 ? (
          <p className="mt-3 text-sm text-ink/70">ไม่พบลักษณะสิวที่ชัดเจนในภาพนี้</p>
        ) : (
          <>
            <p className="mt-4 text-xs text-ink/60">
              พบสิว {typeSummaries.length} ชนิด รวม {result.acne.length} จุด
            </p>
            <motion.ul variants={container} initial="hidden" animate="show" className="mt-3 space-y-3">
              {typeSummaries.map((s) => {
                const severity = ACNE_SEVERITY[s.type];
                return (
                  <motion.li
                    key={s.type}
                    variants={item}
                    className="flex items-center justify-between gap-3 border-t border-sand-200 pt-3 first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${severityDot[severity]}`} aria-hidden />
                      <div>
                        <p className="text-sm font-bold text-[#1A2E20]">{ACNE_LABEL_TH[s.type]}</p>
                        <p className="text-xs text-ink/55">
                          พบ {s.count} จุด · ความมั่นใจสูงสุด {Math.round(s.bestConfidence * 100)}%
                        </p>
                        {severity === "refer" && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-red-700">
                            <AlertTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" />
                            ควรพบแพทย์ผิวหนัง
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="flex-shrink-0 rounded bg-sand-100 px-2 py-0.5 text-xs font-medium text-ink/60">
                      ×{s.count}
                    </span>
                  </motion.li>
                );
              })}
            </motion.ul>
          </>
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
