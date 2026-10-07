"use client";

import React from "react";
import { motion } from "framer-motion";
import { StethoscopeIcon, TargetCrosshairIcon, ShieldCheckIcon, PillCapsuleIcon } from "./Icons";

const trustItems = [
  {
    icon: <StethoscopeIcon className="h-5 w-5 text-[#213C27]" />,
    title: "อิงหลักการแพทย์ผิวหนัง",
    subtitle: "ภาควิชาตจวิทยา ศิริราช",
  },
  {
    icon: <TargetCrosshairIcon className="h-5 w-5 text-[#213C27]" />,
    title: "จำแนกสิว 6 รูปแบบ",
    subtitle: "ตรวจจับตามตำแหน่ง 5 โซน",
  },
  {
    icon: <ShieldCheckIcon className="h-5 w-5 text-[#213C27]" />,
    title: "ประมวลผลบนเครื่อง (Client-Side)",
    subtitle: "ไม่ส่งภาพขึ้นเซิร์ฟเวอร์ ปลอดภัย 100%",
  },
  {
    icon: <PillCapsuleIcon className="h-5 w-5 text-[#213C27]" />,
    title: "จับคู่ตัวยามาตรฐานการแพทย์",
    subtitle: "BP, BHA, Adapalene, Azelaic",
  },
];

export default function TrustBar() {
  return (
    <div className="border-b border-[#E8E2D5] bg-white py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-8 md:grid-cols-4 md:gap-6">
        {trustItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -3 }}
            className="group flex items-center gap-3.5 p-2 rounded-xl transition-colors hover:bg-[#FAF8F5]"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF2EC] transition-all duration-300 group-hover:bg-[#213C27] group-hover:text-white shadow-xs">
              <span className="transition-colors group-hover:brightness-200">
                {item.icon}
              </span>
            </div>
            <div>
              <h3 className="font-display text-xs font-bold text-[#172C1C] sm:text-sm tracking-wide">
                {item.title}
              </h3>
              <p className="mt-0.5 text-[11px] text-[#445E49] sm:text-xs">
                {item.subtitle}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
