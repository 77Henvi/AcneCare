"use client";

import React from "react";
import { motion } from "framer-motion";
import { CategoryVisual } from "./ProductVisuals";
import { useTreatment } from "@/lib/treatmentContext";
import { MEDICATIONS } from "@/lib/medications";

const categories = [
  { id: "whitehead", name: "สิวหัวขาว (หัวปิด)", type: "whitehead", medId: "salicylic-acid", en: "WHITEHEADS" },
  { id: "blackhead", name: "สิวหัวดำ (หัวเปิด)", type: "blackhead", medId: "salicylic-acid", en: "BLACKHEADS" },
  { id: "papule", name: "สิวตุ่มแดงอักเสบ", type: "papule", medId: "benzoyl-peroxide", en: "PAPULES" },
  { id: "pustule", name: "สิวตุ่มหนอง", type: "pustule", medId: "benzoyl-peroxide", en: "PUSTULES" },
  { id: "nodule", name: "สิวหัวช้าง / ซีสต์", type: "nodule", medId: "adapalene", en: "NODULES / CYSTS" },
  { id: "oily", name: "ผิวมัน & รูขุมขน", type: "oily", medId: "azelaic-acid", en: "OILY SKIN" },
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

  const handleCategoryClick = (cat: typeof categories[0]) => {
    const med = MEDICATIONS.find((m) => m.id === cat.medId);
    if (med) {
      setSelectedMedication(med);
      showToast(`ตัวยาที่แนะนำสำหรับ ${cat.name}: ${med.name}`);
    }
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
            ACNE TAXONOMY &amp; CLASSIFICATION
          </span>
          <h2 className="mt-1.5 font-display text-2xl font-bold uppercase tracking-[0.16em] text-[#16271A] sm:text-3xl md:text-4xl">
            จำแนกชนิดสิว 6 รูปแบบ
          </h2>
          <p className="mt-2.5 text-xs text-[#3B5441] sm:text-sm max-w-xl mx-auto">
            คลิกที่ชนิดสิว เพื่อดูตัวยาและแนวทางการดูแลรักษาที่ถูกต้องตามหลักการแพทย์
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
              key={cat.id}
              variants={item}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(cat)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#E4DCD0] bg-[#F4EFE6] transition-all duration-300 hover:border-[#213C27] hover:shadow-xl glass-card-glow"
            >
              {/* Image Area with Zoom effect */}
              <div className="flex h-36 w-full items-center justify-center bg-[#F1EAE0] p-2 transition-transform duration-500 group-hover:scale-105 sm:h-44">
                <CategoryVisual type={cat.type} />
              </div>

              {/* Bottom Label */}
              <div className="flex flex-col items-center justify-center bg-white py-3.5 px-2 text-center border-t border-[#E8E2D5] transition-colors group-hover:bg-[#FAF8F5]">
                <span className="font-display text-[11px] font-bold tracking-[0.08em] text-[#172C1D] transition-colors group-hover:text-[#2E5536] sm:text-xs">
                  {cat.name}
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
