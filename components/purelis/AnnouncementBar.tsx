"use client";

import React from "react";
import Link from "next/link";
import { useTreatment } from "@/lib/treatmentContext";

export default function AnnouncementBar() {
  const { showToast } = useTreatment();

  return (
    <div className="bg-[#1F3A24] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-[11px] font-medium tracking-wide sm:px-8 sm:text-xs">
        {/* Left / Center Message */}
        <div className="flex w-full items-center justify-center sm:w-auto sm:justify-start">
          <Link
            href="/scan"
            className="group inline-flex items-center gap-1.5 transition-opacity hover:opacity-95"
          >
            <span>AI Skin &amp; Acne Analysis v2.0</span>
            <span className="hidden opacity-60 sm:inline">|</span>
            <span className="hidden sm:inline">ตรวจประเมินผิวและจับคู่ยารักษาสิวมาตรฐานการแพทย์ฟรี</span>
            <span className="rounded bg-white/15 px-2 py-0.5 font-bold text-[#A7D9B0] group-hover:bg-white/25">
              เริ่มสแกนเลย 🌿
            </span>
          </Link>
        </div>

        {/* Right Info Badges */}
        <div className="hidden items-center gap-4 text-white/80 sm:flex">
          <button
            onClick={() => showToast("การประมวลผลเกิดขึ้นบนเครื่องของคุณ (Client-Side) ปลอดภัย 100%")}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>🔒 ไม่เก็บภาพใบหน้า</span>
          </button>
          <span>|</span>
          <Link href="/about" className="hover:text-white transition-colors">
            คู่มือทางการแพทย์
          </Link>
        </div>
      </div>
    </div>
  );
}
