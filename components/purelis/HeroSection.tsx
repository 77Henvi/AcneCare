"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeroProductTrio } from "./ProductVisuals";
import { CameraScanIcon, PillCapsuleIcon, SparklesIcon, ShieldCheckIcon } from "./Icons";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E2EBE2] via-[#EAF1EA] to-[#DFEADC] px-4 py-12 sm:px-8 sm:py-16 lg:py-20">
      {/* Background soft botanical aura */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-teal-200/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-200/25 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Left Typography Column (6 cols) */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6 text-left lg:col-span-6 xl:col-span-6 xl:space-y-7 z-10"
        >
          {/* Badge */}
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-olive-700/25 bg-white/80 px-4 py-1.5 text-xs font-semibold text-olive-900 shadow-xs backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
            </span>
            <span className="font-display tracking-wider">AI SKIN &amp; ACNE ANALYSIS SYSTEM</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={item}
            className="font-display text-3xl font-medium uppercase leading-[1.15] tracking-tight text-[#17251C] sm:text-4xl md:text-5xl lg:text-[3.25rem]"
          >
            <span className="block font-semibold">NATURALLY CLEAR.</span>
            <span className="block font-bold tracking-tight text-[#254B2C]">
              AI SKIN SCANNER.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="max-w-lg text-sm leading-relaxed text-[#2C4132] sm:text-base font-sans"
          >
            ตรวจประเมินลักษณะผิวและสิว 6 ชนิดด้วยระบบ AI จากภาพถ่าย พร้อมแนะนำตัวยาและเวชสำอางที่เหมาะสมสำหรับการรักษาสิวเบื้องต้น
          </motion.p>

          {/* Action Buttons with Spring Hover */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/scan">
              <motion.span
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 rounded-none bg-[#213C27] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-all duration-300 hover:bg-[#15281A] hover:shadow-xl sm:text-sm cursor-pointer"
              >
                <CameraScanIcon className="h-4 w-4 text-[#A7D9B0] group-hover:rotate-12 transition-transform" />
                <span>เริ่มสแกนผิวหน้า AI</span>
              </motion.span>
            </Link>

            <a href="#medications">
              <motion.span
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-none border border-[#213C27]/40 bg-white/80 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1D3622] shadow-xs backdrop-blur-sm transition-all hover:bg-white hover:border-[#213C27] cursor-pointer"
              >
                <PillCapsuleIcon className="h-4 w-4 text-[#2E5536]" />
                <span>ดูข้อมูลตัวยารักษาสิว</span>
              </motion.span>
            </a>
          </motion.div>

          {/* Micro trust pills */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#35523C] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-teal-700" />
              <span>ปลอดภัย 100% (Client-Side)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <SparklesIcon className="h-3.5 w-3.5 text-teal-700" />
              <span>ประเมินผลใน 3 วินาที</span>
            </span>
          </motion.div>
        </motion.div>

        {/* Right Skincare Products Staging (6 cols) with Floating Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative flex items-center justify-center lg:col-span-6 xl:col-span-6 animate-float-slow"
        >
          <HeroProductTrio />
        </motion.div>
      </div>
    </section>
  );
}
