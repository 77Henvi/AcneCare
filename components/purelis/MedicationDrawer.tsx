"use client";

import React from "react";
import Link from "next/link";
import { useTreatment } from "@/lib/treatmentContext";

export default function MedicationDrawer() {
  const { selectedMedication, setSelectedMedication, toggleSaveTreatment, isSaved } = useTreatment();

  if (!selectedMedication) return null;

  const m = selectedMedication;
  const favorited = isSaved(m.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={() => setSelectedMedication(null)} />

      {/* Slide-over panel */}
      <div className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand-300/70 p-5 bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold uppercase tracking-wider text-[#1C3221]">
              ข้อมูลตัวยาทางการแพทย์
            </span>
            <span className="rounded-full bg-[#E5EDE6] px-2.5 py-0.5 text-[10px] font-bold text-[#233B27]">
              {m.prescriptionType}
            </span>
          </div>
          <button
            onClick={() => setSelectedMedication(null)}
            className="p-1 text-ink/60 hover:text-ink"
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
          <div className="space-y-1 border-b border-sand-300/60 pb-4">
            <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">
              {m.category}
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#182C1B]">
              {m.name}
            </h3>
            <p className="text-xs font-semibold text-ink/60">{m.genericName}</p>
          </div>

          {/* Description */}
          <div className="rounded-lg bg-[#F4F1EA] p-4 text-xs leading-relaxed text-[#2C4431]">
            <p className="font-semibold text-ink mb-1">คำอธิบายตัวยา:</p>
            {m.description}
          </div>

          {/* Mechanism of Action */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#182C1B] mb-2 flex items-center gap-1.5">
              <span>🔬</span> กลไกการออกฤทธิ์
            </h4>
            <p className="text-xs leading-relaxed text-ink/75 bg-white border border-sand-300/70 rounded-lg p-3.5">
              {m.mechanism}
            </p>
          </div>

          {/* Acne Types Treated */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#182C1B] mb-2 flex items-center gap-1.5">
              <span>🎯</span> เหมาะสำหรับสิวชนิด
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#182C1B] mb-2 flex items-center gap-1.5">
              <span>📋</span> วิธีใช้และลำดับขั้นตอน
            </h4>
            <ul className="space-y-2 text-xs text-ink/80">
              {m.howToUse.map((step, i) => (
                <li key={i} className="flex items-start gap-2 bg-[#FAF8F5] p-2.5 rounded border border-sand-300/50">
                  <span className="font-bold text-[#233B27]">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cautions & Warnings */}
          <div className="rounded-lg border border-amber-300 bg-amber-50/70 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
              <span>⚠️</span> ข้อควรระวังทางการแพทย์
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-950">
              {m.cautions.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-700 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pairings */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#182C1B] mb-2 flex items-center gap-1.5">
              <span>✨</span> จับคู่ใช้ร่วมกันได้ดี
            </h4>
            <div className="flex flex-wrap gap-2">
              {m.pairedWith.map((pair) => (
                <span
                  key={pair}
                  className="rounded bg-[#EAF2EC] px-2.5 py-1 text-xs font-semibold text-[#233B27]"
                >
                  + {pair}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-sand-300/80 p-5 bg-[#FAF8F5] flex gap-3">
          <button
            onClick={() => toggleSaveTreatment(m.id)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border transition-colors ${
              favorited
                ? "bg-[#C83244] text-white border-[#C83244]"
                : "border-[#233B27] text-[#233B27] hover:bg-white"
            }`}
          >
            {favorited ? "❤️ บันทึกไว้แล้ว (คลิกเพื่อยกเลิก)" : "🤍 บันทึกตัวยานี้"}
          </button>
          <Link
            href="/scan"
            onClick={() => setSelectedMedication(null)}
            className="flex-1 bg-[#233B27] py-3 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-[#182C1B] transition-colors"
          >
            📷 สแกนผิวของคุณ
          </Link>
        </div>
      </div>
    </div>
  );
}
