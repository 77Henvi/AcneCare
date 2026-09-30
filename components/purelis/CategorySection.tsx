"use client";

import React from "react";
import { CategoryVisual } from "./ProductVisuals";
import { useTreatment } from "@/lib/treatmentContext";
import { MEDICATIONS } from "@/lib/medications";

const categories = [
  { id: "whitehead", name: "สิวหัวขาว (หัวปิด)", type: "whitehead", medId: "salicylic-acid" },
  { id: "blackhead", name: "สิวหัวดำ (หัวเปิด)", type: "blackhead", medId: "salicylic-acid" },
  { id: "papule", name: "สิวตุ่มแดงอักเสบ", type: "papule", medId: "benzoyl-peroxide" },
  { id: "pustule", name: "สิวตุ่มหนอง", type: "pustule", medId: "benzoyl-peroxide" },
  { id: "nodule", name: "สิวหัวช้าง / ซีสต์", type: "nodule", medId: "adapalene" },
  { id: "oily", name: "ผิวมัน & รูขุมขน", type: "oily", medId: "azelaic-acid" },
];

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
    <section id="acne-types" className="bg-[#FAF8F5] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#365A3D]">
            ACNE TAXONOMY &amp; CLASSIFICATION
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold uppercase tracking-[0.16em] text-[#1E3022] sm:text-3xl md:text-4xl">
            จำแนกชนิดสิว 6 รูปแบบ
          </h2>
          <p className="mt-2 text-xs text-[#3E5A44] sm:text-sm">
            คลิกที่ชนิดสิว เพื่อดูตัวยาและแนวทางการดูแลรักษาที่ถูกต้องตามหลักการแพทย์
          </p>
          <div className="mx-auto mt-3 h-0.5 w-12 bg-[#365A3D]/40" />
        </div>

        {/* 6 Category Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-[#E8E2D5] bg-[#F2EFE9] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
            >
              {/* Image Area */}
              <div className="flex h-36 w-full items-center justify-center bg-[#F2ECE1] p-2 transition-colors group-hover:bg-[#EAE4D7] sm:h-44">
                <CategoryVisual type={cat.type} />
              </div>

              {/* Bottom White Label */}
              <div className="flex items-center justify-center bg-white py-3 px-2 text-center border-t border-[#E8E2D5]">
                <span className="text-[11px] font-bold tracking-[0.05em] text-[#1C3322] transition-colors group-hover:text-[#38623E] sm:text-xs">
                  {cat.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
