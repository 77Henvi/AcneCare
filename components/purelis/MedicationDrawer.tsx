"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTreatment } from "@/lib/treatmentContext";
import {
  MicroscopeIcon,
  TargetCrosshairIcon,
  FileTextIcon,
  AlertTriangleIcon,
  SparklesIcon,
  CameraScanIcon,
} from "./Icons";

export default function MedicationDrawer() {
  const { selectedMedication, setSelectedMedication } = useTreatment();

  if (!selectedMedication) return null;

  const m = selectedMedication;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop Fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/45 backdrop-blur-xs"
          onClick={() => setSelectedMedication(null)}
        />

        {/* Slide-over panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E8E2D5] p-5 bg-[#FAF8F5]">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-base font-bold uppercase tracking-wider text-[#16271A]">
                ข้อมูลตัวยา
              </span>
              <span className="rounded-full bg-[#E5EDE6] px-2.5 py-0.5 text-[10px] font-bold text-[#233B27]">
                {m.prescriptionType}
              </span>
            </div>
            <button
              onClick={() => setSelectedMedication(null)}
              className="p-1.5 rounded-full text-ink/60 hover:bg-sand-200 hover:text-ink transition-colors"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Main Title & Category */}
            <div className="space-y-1 border-b border-[#E8E2D5] pb-4">
              <span className="font-display text-xs font-bold text-[#34593C] tracking-wider uppercase">
                {m.category}
              </span>
              <h3 className="font-display text-2xl font-bold text-[#16271A]">
                {m.name}
              </h3>
              <p className="text-xs font-semibold text-ink/60">{m.genericName}</p>
            </div>

            {/* Description */}
            <div className="rounded-xl bg-[#F4EFE6] p-4 text-xs leading-relaxed text-[#2A4130] border border-[#E6DEC8]">
              <p className="font-display font-bold text-[#16271A] mb-1">คำอธิบายตัวยา:</p>
              {m.description}
            </div>

            {/* Mechanism of Action */}
            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#16271A] mb-2 flex items-center gap-1.5">
                <MicroscopeIcon className="h-4 w-4 text-[#2E5536]" />
                <span>กลไกการออกฤทธิ์</span>
              </h4>
              <p className="text-xs leading-relaxed text-ink/75 bg-white border border-sand-300/70 rounded-xl p-3.5 shadow-xs">
                {m.mechanism}
              </p>
            </div>

            {/* Acne Types Treated */}
            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#16271A] mb-2 flex items-center gap-1.5">
                <TargetCrosshairIcon className="h-4 w-4 text-[#2E5536]" />
                <span>เหมาะสำหรับสิวชนิด</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {m.acneTypes.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-teal-600/30 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>

            {/* How To Use */}
            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#16271A] mb-2 flex items-center gap-1.5">
                <FileTextIcon className="h-4 w-4 text-[#2E5536]" />
                <span>วิธีใช้และลำดับขั้นตอน</span>
              </h4>
              <ul className="space-y-2 text-xs text-ink/80">
                {m.howToUse.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 bg-[#FAF8F5] p-3 rounded-lg border border-sand-300/50">
                    <span className="font-bold text-[#233B27]">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cautions & Warnings */}
            <div className="rounded-xl border border-amber-300 bg-amber-50/75 p-4.5">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                <AlertTriangleIcon className="h-4 w-4 text-amber-700" />
                <span>ข้อควรระวัง</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-950">
                {m.cautions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pairings */}
            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#16271A] mb-2 flex items-center gap-1.5">
                <SparklesIcon className="h-4 w-4 text-[#2E5536]" />
                <span>ใช้ร่วมกับ</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {m.pairedWith.map((pair) => (
                  <span
                    key={pair}
                    className="rounded-lg bg-[#EAF2EC] px-3 py-1.5 text-xs font-semibold text-[#233B27] border border-teal-600/20"
                  >
                    + {pair}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[#E8E2D5] p-5 bg-[#FAF8F5]">
            <Link
              href="/scan"
              onClick={() => setSelectedMedication(null)}
              className="block w-full"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#213C27] py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-[#142618] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <CameraScanIcon className="h-4 w-4 text-[#A7D9B0]" />
                <span>สแกนผิวของคุณเพื่อดูยาที่เหมาะสม</span>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
