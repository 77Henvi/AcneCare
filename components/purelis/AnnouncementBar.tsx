"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTreatment } from "@/lib/treatmentContext";
import { LeafIcon, ShieldCheckIcon, SparklesIcon, FileTextIcon } from "./Icons";

export default function AnnouncementBar() {
  const { showToast } = useTreatment();

  return (
    <div className="bg-[#182F1D] text-white border-b border-white/10 relative overflow-hidden">
      {/* Subtle ambient light shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />

      <div className="flex w-full items-center justify-between px-4 py-2 text-[11px] font-medium tracking-wide sm:px-8 lg:px-12 sm:text-xs">
        {/* Left / Center Message with Icon */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex w-full items-center justify-center sm:w-auto sm:justify-start"
        >
          <div className="inline-flex items-center gap-2">
            <span className="flex items-center justify-center h-4 w-4 rounded-full bg-white/15 text-[#A7D9B0]">
              <LeafIcon className="h-2.5 w-2.5" />
            </span>
            <span className="font-display font-semibold tracking-wider text-[#A7D9B0]">AI Skin &amp; Acne Analysis</span>
            <span className="hidden opacity-40 sm:inline">|</span>
<<<<<<< HEAD
            <span className="hidden sm:inline text-white/90">ตรวจประเมินผิวและแนะนำตัวยารักษาสิวจากข้อมูลทางการแพทย์เบื้องต้น</span>
=======
            <span className="hidden sm:inline text-white/90">ตรวจประเมินผิวและจับคู่ยารักษาสิวมาตรฐานการแพทย์</span>
>>>>>>> origin/frontend
          </div>
        </motion.div>

        {/* Right Info Badges */}
        <div className="hidden items-center gap-4 text-white/80 sm:flex">
          <button
            onClick={() => showToast("การประมวลผลเกิดขึ้นบนเครื่องของคุณ (Client-Side) ภาพไม่ถูกส่งขึ้นเซิร์ฟเวอร์")}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ShieldCheckIcon className="h-3.5 w-3.5 text-[#A7D9B0]" />
            <span>ไม่เก็บภาพใบหน้า</span>
          </button>
          <span className="opacity-30">|</span>
          <Link href="/about" className="flex items-center gap-1 hover:text-white transition-colors">
            <FileTextIcon className="h-3 w-3 text-white/70" />
            <span>ข้อมูลและข้อจำกัดของระบบ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
