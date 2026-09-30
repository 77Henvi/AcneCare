"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PromoFlatlayVisual } from "./ProductVisuals";
import { CameraScanIcon, PillCapsuleIcon, LeafIcon, ShieldCheckIcon } from "./Icons";

export default function PromoBanner() {
  return (
    <section id="offers" className="bg-[#FAF8F5] pb-16 sm:pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-[#DFD7CB] bg-gradient-to-r from-[#EBF2EA] via-[#F2EDE2] to-[#E3EDE1] p-6 sm:p-10 lg:p-14 shadow-md"
        >
          {/* Subtle light shimmer background */}
          <div className="absolute inset-0 bg-radial from-white/30 to-transparent pointer-events-none" />

          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10 relative z-10">
            {/* Left Content Column */}
            <div className="space-y-5 lg:col-span-6 xl:col-span-7">
              <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#34593C] sm:text-sm">
                AI DERMATOLOGY &amp; ACTIVE INGREDIENTS
              </span>

              <h2 className="font-display text-3xl font-bold tracking-tight text-[#16271A] sm:text-4xl md:text-5xl leading-[1.18]">
                จับคู่ตัวยารักษาสิวตรงจุด <br className="hidden sm:inline" />
                ปลอดภัย อิงหลักการแพทย์
              </h2>

              <p className="text-xs sm:text-sm leading-relaxed text-[#354D3B] max-w-lg font-sans">
                ระบบ AI วิเคราะห์ความรุนแรงของสิว พร้อมให้คำแนะนำตัวยาทาภายนอก (Topical Treatments) 
                ลำดับขั้นตอนการทา และข้อห้ามใช้ที่สตรีมีครรภ์ควรระวัง
              </p>

              <div className="pt-2">
                <Link href="/scan">
                  <motion.span
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-none bg-[#213C27] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-md transition-all duration-300 hover:bg-[#142618] hover:shadow-xl sm:text-sm cursor-pointer"
                  >
                    <CameraScanIcon className="h-4 w-4 text-[#A7D9B0]" />
                    <span>สแกนผิวหน้าเพื่อรับคำแนะนำยา</span>
                  </motion.span>
                </Link>
              </div>

              {/* 3 Medical Safety Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-4 text-xs font-semibold text-[#253F2B] sm:gap-6">
                <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-sand-300/60 shadow-xs">
                  <PillCapsuleIcon className="h-4 w-4 text-teal-700" />
                  <span>Verified Actives</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-sand-300/60 shadow-xs">
                  <LeafIcon className="h-4 w-4 text-teal-700" />
                  <span>Barrier-Safe Regimen</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-sand-300/60 shadow-xs">
                  <ShieldCheckIcon className="h-4 w-4 text-teal-700" />
                  <span>Medical Guardrails</span>
                </span>
              </div>
            </div>

            {/* Right Flat-Lay Visual with Floating Animation */}
            <div className="flex items-center justify-center lg:col-span-6 xl:col-span-5 animate-float-delayed">
              <PromoFlatlayVisual />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
