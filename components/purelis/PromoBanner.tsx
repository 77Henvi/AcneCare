"use client";

import React from "react";
import Link from "next/link";
import { PromoFlatlayVisual } from "./ProductVisuals";

export default function PromoBanner() {
  return (
    <section id="offers" className="bg-[#FAF8F5] pb-14 sm:pb-16 lg:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-[#E0DACE] bg-gradient-to-r from-[#EBF2EA] via-[#F2EDE2] to-[#E3EDE1] p-6 sm:p-10 lg:p-14 shadow-sm">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Content Column */}
            <div className="space-y-5 lg:col-span-6 xl:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3E6345] sm:text-sm">
                AI DERMATOLOGY &amp; ACTIVE INGREDIENTS
              </p>

              <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1C2F20] sm:text-4xl md:text-5xl">
                จับคู่ตัวยารักษาสิวตรงจุด <br className="hidden sm:inline" />
                ปลอดภัย อิงหลักการแพทย์
              </h2>

              <p className="text-xs leading-relaxed text-[#39533F] sm:text-sm max-w-lg">
                ระบบ AI วิเคราะห์ความรุนแรงของสิว พร้อมให้คำแนะนำตัวยาทาภายนอก (Topical Treatments) 
                ลำดับขั้นตอนการทา และข้อห้ามใช้ที่สตรีมีครรภ์ควรระวัง
              </p>

              <div className="pt-1">
                <Link
                  href="/scan"
                  className="inline-block rounded-none bg-[#233B27] px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow transition-all duration-300 hover:bg-[#182C1B] hover:shadow-md sm:text-sm"
                >
                  📷 สแกนผิวหน้าเพื่อรับคำแนะนำยา
                </Link>
              </div>

              {/* 3 Medical Safety Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-4 text-xs font-semibold text-[#2C4831] sm:gap-6">
                <span className="flex items-center gap-1.5">
                  <span className="text-base">💊</span> Verified Actives
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-base">🌿</span> Barrier-Safe Regimen
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-base">👨‍⚕️</span> Medical Guardrails
                </span>
              </div>
            </div>

            {/* Right Flat-Lay Visual */}
            <div className="flex items-center justify-center lg:col-span-6 xl:col-span-5">
              <PromoFlatlayVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
