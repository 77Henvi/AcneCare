"use client";

import React from "react";
import Link from "next/link";
import { HeroProductTrio } from "./ProductVisuals";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#E3ECE3] via-[#EAF1E9] to-[#DFEADC] px-4 py-12 sm:px-8 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Left Typography Column (7 cols) */}
        <div className="space-y-6 text-left lg:col-span-6 xl:col-span-6 xl:space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-olive-700/20 bg-white/70 px-3.5 py-1 text-xs font-semibold text-olive-900 shadow-sm backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-teal-600 animate-pulse" />
            <span>AI Skin &amp; Acne Analysis System</span>
          </div>

          <h1 className="font-serif text-3xl font-medium uppercase leading-[1.18] tracking-tight text-[#1E2822] sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            <span className="block font-normal">NATURALLY CLEAR.</span>
            <span className="block font-bold tracking-tight text-[#2A4D30]">
              AI SKIN SCANNER.
            </span>
          </h1>

          <p className="max-w-md text-sm leading-relaxed text-[#3B4D40]/90 sm:text-base">
            ตรวจประเมินลักษณะผิวและสิว 7 ชนิดด้วย AI จากภาพถ่าย พร้อมจับคู่ตัวยาและเวชสำอางที่เหมาะสมตามหลักการแพทย์ผิวหนัง
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/scan"
              className="group inline-flex items-center justify-center rounded-none bg-[#233B27] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-md transition-all duration-300 hover:bg-[#182C1B] hover:shadow-lg sm:text-sm"
            >
              <span>📷 เริ่มสแกนผิวหน้า AI</span>
            </Link>

            <a
              href="#medications"
              className="inline-flex items-center justify-center rounded-none border border-[#233B27]/40 bg-white/60 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1F3924] transition-all hover:bg-white hover:border-[#233B27]"
            >
              ดูคลังยารักษาสิว
            </a>
          </div>
        </div>

        {/* Right Skincare Products Staging (6 cols) */}
        <div className="relative flex items-center justify-center lg:col-span-6 xl:col-span-6">
          <HeroProductTrio />
        </div>
      </div>
    </section>
  );
}
