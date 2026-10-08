"use client";

import React from "react";
import { motion } from "framer-motion";
import { MedicationCardVisual } from "./ProductVisuals";
import { useTreatment } from "@/lib/treatmentContext";
import { MEDICATIONS } from "@/lib/medications";
import { HeartIcon, PillCapsuleIcon } from "./Icons";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function NewArrivalsSection() {
  const { setSelectedMedication, toggleSaveTreatment, isSaved, showToast } = useTreatment();

  return (
    <section id="medications" className="bg-[#FAF8F5] pb-20 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E4DCD0] pb-5 gap-3"
        >
          <div>
            <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#34593C]">
              COMMON TOPICAL ACTIVE INGREDIENTS
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-[0.14em] text-[#16271A] sm:text-3xl">
              ตัวยาที่พบบ่อยในการรักษาสิว
            </h2>
          </div>
          <button
            onClick={() => showToast("กำลังแสดงข้อมูลตัวยา 4 รายการ 4 กลุ่มหลัก")}
            className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#24422A] underline decoration-[#24422A]/40 underline-offset-4 transition-colors hover:text-[#142618]"
          >
            <span>ดูตัวยาทั้งหมด 4 รายการ</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </motion.div>

        {/* 4 Medication Cards Grid with Stagger */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {MEDICATIONS.map((m) => {
            const favorited = isSaved(m.id);

            return (
              <motion.div
                key={m.id}
                variants={item}
                whileHover={{ y: -6 }}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#E4DCD0] bg-white transition-all duration-300 hover:border-[#213C27] hover:shadow-xl glass-card-glow"
              >
                {/* Visual Area with Wishlist Heart */}
                <div className="relative overflow-hidden bg-[#F4F0E8] transition-colors group-hover:bg-[#EDE7DC]">
                  <MedicationCardVisual id={m.id} />

                  {/* Badge */}
                  <div className="absolute left-3.5 top-3.5 rounded-full bg-[#1A3320] px-3 py-1 text-[10px] font-bold tracking-wider text-white shadow-md">
                    {m.strength}
                  </div>

                  {/* Bookmark Heart Button */}
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveTreatment(m.id);
                    }}
                    aria-label="Save treatment"
                    className="absolute right-3.5 top-3.5 rounded-full bg-white/90 p-2 text-ink/70 shadow-sm backdrop-blur-sm transition-all hover:bg-white"
                  >
                    <HeartIcon
                      className={`h-4 w-4 transition-colors ${
                        favorited ? "text-[#C83244]" : "text-ink/60"
                      }`}
                      filled={favorited}
                    />
                  </motion.button>
                </div>

                {/* Medication Info */}
                <div className="flex flex-1 flex-col justify-between p-5 text-center">
                  <div>
                    <span className="font-display text-[11px] font-bold text-[#34593C] uppercase tracking-wider">
                      {m.category}
                    </span>
                    <h3 className="mt-1 font-display font-bold text-[#16271A] transition-colors group-hover:text-olive-700 text-sm sm:text-base">
                      {m.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#445E49] line-clamp-2 font-sans leading-relaxed">
                      {m.acneTypes.join(", ")}
                    </p>
                  </div>

                  {/* Details Button */}
                  <div className="mt-5 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMedication(m)}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-none bg-[#213C27] py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-sm transition-all duration-200 hover:bg-[#15281A]"
                    >
                      <PillCapsuleIcon className="h-3.5 w-3.5 text-[#A7D9B0]" />
                      <span>ดูวิธีใช้และข้อควรระวัง</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
