"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTreatment } from "@/lib/treatmentContext";

export default function Footer() {
  const { showToast } = useTreatment();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      showToast("ลงทะเบียนรับบทความความรู้การดูแลสิวเรียบร้อยแล้ว 🌿");
      setEmail("");
    } else {
      showToast("กรุณากรอกอีเมลให้ถูกต้อง");
    }
  };

  return (
    <footer id="contact" className="border-t border-sand-300/80 bg-[#FAF8F5]">
      {/* Upper Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8 lg:gap-12">
          {/* Col 1: Medical Standards / Trust Badges (4 cols) */}
          <div className="space-y-6 md:col-span-4">
            {/* Medical Reference */}
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center text-[#233B27]">
                <svg className="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#182C1B]">
                  SIRIRAJ ACNE TAXONOMY
                </h4>
                <p className="mt-0.5 text-xs text-[#3E5843]">อิงอนุกรมวิธานสิว ภาควิชาตจวิทยา ศิริราช</p>
              </div>
            </div>

            {/* Privacy */}
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center text-[#233B27]">
                <svg className="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#182C1B]">
                  100% CLIENT-SIDE PRIVACY
                </h4>
                <p className="mt-0.5 text-xs text-[#3E5843]">ภาพถ่ายใบหน้าไม่ถูกส่งขึ้นเซิร์ฟเวอร์</p>
              </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center text-[#233B27]">
                <svg className="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#182C1B]">
                  MEDICAL SAFETY GUARDRAIL
                </h4>
                <p className="mt-0.5 text-xs text-[#3E5843]">ไม่ใช่เครื่องมือวินิจฉัยโรคทางการแพทย์</p>
              </div>
            </div>
          </div>

          {/* Col 2: Newsletter Subscription (4 cols) */}
          <div className="space-y-4 md:col-span-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-[0.16em] text-[#182C1B]">
              SUBSCRIBE TO DERMATOLOGY TIPS
            </h4>
            <p className="text-xs leading-relaxed text-[#3B5441]">
              รับบทความความรู้เรื่องสิว ตัวยา การดูแลผิว และคำแนะนำจากแพทย์ผิวหนังเป็นประจำ
            </p>

            <form onSubmit={handleSubscribe} className="flex max-w-sm flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="กรอกอีเมลของคุณ"
                className="w-full border border-sand-300 bg-white px-3.5 py-2.5 text-xs text-ink placeholder:text-ink/40 focus:border-[#233B27] focus:outline-none"
                required
              />
              <button
                type="submit"
                className="whitespace-nowrap bg-[#233B27] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#182C1B]"
              >
                {subscribed ? "เรียบร้อย ✓" : "ติดตาม"}
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2 text-[#233B27]">
              <button onClick={() => showToast("AcneCare Facebook")} aria-label="Facebook" className="hover:opacity-75">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </button>
              <button onClick={() => showToast("AcneCare Instagram")} aria-label="Instagram" className="hover:opacity-75">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>
              <button onClick={() => showToast("AcneCare YouTube")} aria-label="YouTube" className="hover:opacity-75">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Col 3: About AcneCare (4 cols) */}
          <div id="about" className="space-y-3.5 md:col-span-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-[0.16em] text-[#182C1B]">
              ABOUT ACNECARE
            </h4>
            <p className="text-xs leading-relaxed text-[#3B5441]">
              AcneCare เป็นระบบ AI ช่วยประเมินลักษณะผิวและชนิดสิวจากภาพถ่ายใบหน้าเบื้องต้น
              พร้อมจับคู่ตัวยาและเวชสำอางตามหลักการแพทย์เพื่อการดูแลผิวที่ปลอดภัยและถูกวิธี
            </p>
            <div>
              <Link
                href="/about"
                className="text-xs font-bold uppercase tracking-wider text-[#233B27] underline decoration-[#233B27]/40 underline-offset-4 hover:text-[#182C1B]"
              >
                อ่านคู่มือความปลอดภัยและการแพทย์ →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Dark Copyright Bar */}
      <div className="bg-[#1F3A24] py-4 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-[11px] font-medium tracking-wide sm:flex-row sm:px-8 sm:text-xs">
          <p className="text-white/80">© 2025 AcneCare AI Dermatology. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/70">
            <Link href="/about" className="hover:text-white">Medical Disclaimer</Link>
            <span>|</span>
            <Link href="/about" className="hover:text-white">Privacy Policy</Link>
            <span>|</span>
            <Link href="/about" className="hover:text-white">Siriraj Reference</Link>
            <span>|</span>
            <Link href="/about" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
