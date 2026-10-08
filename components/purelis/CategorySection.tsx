"use client";

import React from "react";
import { motion } from "framer-motion";
import { CategoryVisual } from "./ProductVisuals";
import { useTreatment } from "@/lib/treatmentContext";
import { MEDICATIONS, MEDS_BY_ACNE_TYPE, MedicationDetail } from "@/lib/medications";
import { ACNE_LABEL_TH, AcneType } from "@/lib/taxonomy";

// 6 ชนิดสิวตามแหล่งอ้างอิง [A]: สิวอุดตัน 2 ชนิด + สิวอักเสบ 4 ชนิด
// ชื่อภาษาไทยดึงจาก lib/taxonomy.ts เพื่อให้ตรงกับทั้งระบบ
interface Category {
  type: AcneType;
  visual: string; // key ที่ส่งให้ CategoryVisual (ซีสต์ใช้ภาพเดียวกับหัวช้าง เหมือนหน้า acne-types)
  en: string;
}

const categories: Category[] = [
  { type: "whitehead", visual: "whitehead", en: "WHITEHEADS" },
  { type: "blackhead", visual: "blackhead", en: "BLACKHEADS" },
  { type: "papule", visual: "papule", en: "PAPULES" },
  { type: "pustule", visual: "pustule", en: "PUSTULES" },
  { type: "nodule", visual: "nodule", en: "NODULES" },
  { type: "cyst", visual: "nodule", en: "CYSTS" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function CategorySection() {
  const { setSelectedMedication, showToast } = useTreatment();

  const handleCategoryClick = (cat: Category) => {
    const label = ACNE_LABEL_TH[cat.type];
    const ids = MEDS_BY_ACNE_TYPE[cat.type];

    // สิวหัวช้าง / ซีสต์: ไม่แนะนำยาทา ให้พบแพทย์ผิวหนัง
    if (ids.length === 0) {
      showToast(`${label}: ควรพบแพทย์ผิวหนัง ไม่แนะนำให้รักษาด้วยตนเอง`);
      return;
    }

    const meds = ids
      .map((id) => MEDICATIONS.find((m) => m.id === id))
      .filter((m): m is MedicationDetail => Boolean(m));
    if (meds.length === 0) return;

    setSelectedMedication(meds[0]);
    showToast(`ตัวยาที่มักใช้กับ${label}: ${meds.map((m) => m.name).join(", ")}`);
  };

  return (
    <section id="acne-types" className="bg-[#FAF8F5] py-16 sm:py-20 lg:py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section Heading with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#34593C]">
            ACNE TYPES &amp; CLASSIFICATION
          </span>
          <h2 className="mt-1.5 font-display text-2xl font-bold uppercase tracking-[0.16em] text-[#16271A] sm:text-3xl md:text-4xl">
            ชนิดของสิว 6 ชนิด
          </h2>
          <p className="mt-2.5 text-xs text-[#3B5441] sm:text-sm max-w-xl mx-auto">
            คลิกที่ชนิดสิวเพื่อดูตัวยาที่ใช้ในการรักษา — สิวหัวช้างและสิวซีสต์ควรพบแพทย์ผิวหนัง
          </p>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-[#2B4E32]/40" />
        </motion.div>

        {/* 6 Category Grid with Stagger Reveal */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.type}
              variants={item}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(cat)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#E4DCD0] bg-[#F4EFE6] transition-all duration-300 hover:border-[#213C27] hover:shadow-xl glass-card-glow"
            >
              {/* Image Area with Zoom effect */}
              <div className="flex h-36 w-full items-center justify-center bg-[#F1EAE0] p-2 transition-transform duration-500 group-hover:scale-105 sm:h-44">
                <CategoryVisual type={cat.visual} />
              </div>

              {/* Bottom Label */}
              <div className="flex flex-col items-center justify-center bg-white py-3.5 px-2 text-center border-t border-[#E8E2D5] transition-colors group-hover:bg-[#FAF8F5]">
                <span className="font-display text-[11px] font-bold tracking-[0.08em] text-[#172C1D] transition-colors group-hover:text-[#2E5536] sm:text-xs">
                  {ACNE_LABEL_TH[cat.type]}
                </span>
                <span className="text-[9px] font-semibold tracking-wider text-ink/40 mt-0.5">
                  {cat.en}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
