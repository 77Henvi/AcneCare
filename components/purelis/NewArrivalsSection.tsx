"use client";

import React from "react";
import { MedicationCardVisual } from "./ProductVisuals";
import { useTreatment } from "@/lib/treatmentContext";
import { MEDICATIONS } from "@/lib/medications";

export default function NewArrivalsSection() {
  const { setSelectedMedication, toggleSaveTreatment, isSaved, showToast } = useTreatment();

  return (
    <section id="medications" className="bg-[#FAF8F5] pb-16 sm:pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-sand-300/60 pb-4 gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#365A3D]">
              EVIDENCE-BASED ACTIVE INGREDIENTS
            </p>
            <h2 className="font-serif text-2xl font-bold uppercase tracking-[0.15em] text-[#1E3022] sm:text-3xl">
              ตัวยารักษาสิวที่ AI แนะนำ
            </h2>
          </div>
          <button
            onClick={() => showToast("กำลังแสดงตัวยามาตรฐานทางการแพทย์ 4 กลุ่มหลัก")}
            className="group flex items-center gap-1 text-xs font-bold uppercase tracking-[0.16em] text-[#2C4A31] underline decoration-[#2C4A31]/40 underline-offset-4 transition-colors hover:text-[#182C1B]"
          >
            ดูตัวยาทั้งหมด 4 กลุ่ม
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        </div>

        {/* 4 Medication Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MEDICATIONS.map((m) => {
            const favorited = isSaved(m.id);

            return (
              <div
                key={m.id}
                className="group flex flex-col overflow-hidden rounded-lg border border-[#E7E1D4] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Visual Area with Wishlist Heart */}
                <div className="relative overflow-hidden bg-[#F4F1EA]">
                  <MedicationCardVisual id={m.id} />

                  {/* Badge */}
                  <div className="absolute left-3 top-3 rounded-full bg-[#1C3A23] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    {m.strength}
                  </div>

                  {/* Bookmark Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveTreatment(m.id);
                    }}
                    aria-label="Save treatment"
                    className="absolute right-3 top-3 rounded-full bg-white/85 p-2 text-ink/70 shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
                  >
                    <svg
                      className={`h-4 w-4 ${
                        favorited ? "fill-[#C83244] text-[#C83244]" : "fill-none stroke-current"
                      }`}
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Medication Info */}
                <div className="flex flex-1 flex-col justify-between p-5 text-center">
                  <div>
                    <span className="text-[11px] font-semibold text-[#3C6442]">
                      {m.category}
                    </span>
                    <h3 className="mt-1 font-bold text-[#1B291F] transition-colors group-hover:text-olive-700 text-sm sm:text-base">
                      {m.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#48634E] line-clamp-2">
                      {m.acneTypes.join(", ")}
                    </p>
                  </div>

                  {/* Details Button */}
                  <div className="mt-4 pt-2">
                    <button
                      onClick={() => setSelectedMedication(m)}
                      className="w-full rounded-none bg-[#233B27] py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-sm transition-all duration-200 hover:bg-[#182C1B] active:scale-[0.98]"
                    >
                      ดูวิธีใช้ &amp; ข้อควรระวัง
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
