"use client";

import { motion } from "framer-motion";
import { ScanRecord } from "@/lib/storage/scans";
import {
  ACNE_LABEL_TH,
  ACNE_SEVERITY,
  FACE_REGION_LABEL_TH,
  SKIN_TYPE_LABEL_TH,
} from "@/lib/taxonomy";
import Disclaimer from "@/components/Disclaimer";

const severityDot: Record<string, string> = {
  none: "bg-ink/20",
  low: "bg-teal-400",
  moderate: "bg-attention-400",
  refer: "bg-caution-500",
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

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.section variants={item} className="rounded-card border border-sand-300 bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-ink/45">ลักษณะผิวที่ AI ประเมิน</p>
        <div className="mt-1.5 flex items-baseline justify-between">
          <p className="font-display text-2xl text-teal-900">{SKIN_TYPE_LABEL_TH[result.skinType.label]}</p>
          <p className="text-sm text-ink/50">{Math.round(result.skinType.confidence * 100)}% ความมั่นใจ</p>
        </div>
      </motion.section>

      <motion.section variants={item} className="rounded-card border border-sand-300 bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-ink/45">ลักษณะที่ AI ตรวจพบ</p>
        {result.acne.length === 0 ? (
          <p className="mt-2 text-sm text-ink/60">ไม่พบลักษณะสิวที่ชัดเจนในภาพ</p>
        ) : (
          <motion.ul variants={container} initial="hidden" animate="show" className="mt-3 space-y-3">
            {result.acne.map((f, i) => (
              <motion.li
                key={i}
                variants={item}
                className="flex items-center justify-between border-t border-sand-300 pt-3 first:border-t-0 first:pt-0"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 rounded-full ${severityDot[ACNE_SEVERITY[f.type]]}`} aria-hidden />
                  <div>
                    <p className="text-sm font-medium text-ink">{ACNE_LABEL_TH[f.type]}</p>
                    <p className="text-xs text-ink/50">{FACE_REGION_LABEL_TH[f.region]}</p>
                  </div>
                </div>
                <span className="text-xs text-ink/50">{Math.round(f.confidence * 100)}%</span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.section>

      <motion.section variants={item} className="rounded-card border border-sand-300 bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-ink/45">คำแนะนำการดูแลผิวเบื้องต้น</p>
        <motion.ul variants={container} initial="hidden" animate="show" className="mt-2 space-y-2">
          {recommendations.map((r) => (
            <motion.li
              key={r.ruleId}
              variants={item}
              className={`flex items-start gap-2 text-sm ${
                r.mandatory ? "rounded-card bg-caution-50 p-2.5 text-caution-500 font-medium" : "text-ink/75"
              }`}
            >
              <span aria-hidden>{r.mandatory ? "⚠" : "✓"}</span>
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
