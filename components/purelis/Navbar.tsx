"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTreatment } from "@/lib/treatmentContext";
import { MEDICATIONS } from "@/lib/medications";
import { CameraScanIcon, HeartIcon, SparklesIcon } from "./Icons";

export default function Navbar() {
  const { savedTreatments, setSelectedMedication, showToast } = useTreatment();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const match = MEDICATIONS.find(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.acneTypes.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (match) {
      setSelectedMedication(match);
      showToast(`พบข้อมูลตัวยา: ${match.name}`);
      setSearchOpen(false);
    } else {
      showToast(`ไม่พบข้อมูลสำหรับ "${searchQuery}" ลองค้นหา: Benzoyl, BHA, Adapalene, Azelaic`);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E2D5]/80 bg-white/95 shadow-[0_4px_20px_rgba(27,33,30,0.03)] backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8 lg:py-3.5">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-ink hover:bg-sand-100 lg:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Brand Logo: ACNECARE AI DERMATOLOGY */}
        <Link href="/" className="group flex flex-col items-center">
          <span className="font-display text-2xl font-bold tracking-[0.25em] text-[#142618] sm:text-3xl transition-colors group-hover:text-olive-700">
            ACNECARE
          </span>
          <span className="text-[9px] font-bold tracking-[0.45em] text-[#34583B] sm:text-[10px]">
            AI DERMATOLOGY
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[0.14em] text-[#28382B] lg:flex">
          <Link href="/" className="text-olive-800 font-bold border-b-2 border-olive-800 pb-0.5">
            หน้าแรก
          </Link>
          <Link
            href="/scan"
            className="transition-colors hover:text-olive-600 flex items-center gap-1.5 text-olive-700 font-bold"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
            </span>
            <span>สแกนผิว AI</span>
          </Link>
          <div className="group relative">
            <a href="#medications" className="flex items-center gap-1 transition-colors hover:text-olive-600">
              คลังยารักษาสิว
              <svg className="h-3 w-3 opacity-60 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <div className="invisible absolute -left-4 top-full mt-2 w-56 rounded-xl border border-sand-300/80 bg-white p-2.5 shadow-2xl opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
              {MEDICATIONS.map((med) => (
                <button
                  key={med.id}
                  onClick={() => setSelectedMedication(med)}
                  className="block w-full text-left rounded-lg px-3 py-2 text-xs font-medium text-ink hover:bg-[#F2F7F3] hover:text-olive-700 transition-colors"
                >
                  {med.name}
                </button>
              ))}
            </div>
          </div>
          <a href="#acne-types" className="transition-colors hover:text-olive-600">
            ชนิดสิว 6 แบบ
          </a>
          <Link href="/history" className="transition-colors hover:text-olive-600">
            ประวัติการตรวจ
          </Link>
          <Link href="/about" className="transition-colors hover:text-olive-600">
            เกี่ยวกับระบบ
          </Link>
        </nav>

        {/* Right Actions: Search, Saved Treatments, Start Scan CTA */}
        <div className="flex items-center gap-3 sm:gap-4 text-[#28382B]">
          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-full hover:bg-sand-100 transition-colors"
            aria-label="Search medication"
            title="ค้นหาตัวยาและแนวทางรักษา"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.button>

          {/* Saved Treatments Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              if (savedTreatments.length > 0) {
                const first = MEDICATIONS.find((m) => m.id === savedTreatments[0]);
                if (first) setSelectedMedication(first);
              } else {
                showToast("ยังไม่มีตัวยาที่บันทึกไว้ ลองกดหัวใจที่ตัวยาด้านล่าง");
              }
            }}
            className="relative flex items-center gap-1.5 rounded-full border border-sand-300 bg-[#FAF8F5] px-3.5 py-1.5 text-xs font-semibold text-[#1F3A24] hover:bg-white transition-all shadow-xs"
            title="ตัวยาที่คุณบันทึกไว้"
          >
            <HeartIcon className="h-3.5 w-3.5 text-[#C83244]" filled={savedTreatments.length > 0} />
            <span className="hidden sm:inline">ยาที่บันทึก</span>
            <span className="rounded-full bg-[#E2ECE2] px-1.5 text-[10px] font-bold text-[#233B27]">
              {savedTreatments.length}
            </span>
          </motion.button>

          {/* Main CTA: Scan Skin */}
          <Link href="/scan">
            <motion.span
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 rounded-none bg-[#213C27] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#16291A] cursor-pointer"
            >
              <CameraScanIcon className="h-3.5 w-3.5" />
              <span>สแกนผิว AI</span>
            </motion.span>
          </Link>
        </div>
      </div>

      {/* Expandable Search Input with Animation */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-sand-300/60 bg-[#FAF8F5] px-4 py-3"
          >
            <form onSubmit={handleSearch} className="mx-auto flex max-w-xl items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาตัวยา เช่น Benzoyl Peroxide, BHA, Adapalene หรือชนิดสิว..."
                className="w-full rounded-full border border-sand-300 bg-white px-4 py-2 text-xs focus:border-olive-600 focus:outline-none sm:text-sm shadow-xs"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-full bg-[#233B27] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1A301F] transition-colors"
              >
                ค้นหา
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-sand-300/60 bg-white px-6 py-5 text-sm font-semibold tracking-wider text-ink lg:hidden"
          >
            <div className="flex flex-col space-y-3">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-1 text-olive-700">หน้าแรก</Link>
              <Link href="/scan" onClick={() => setMobileMenuOpen(false)} className="py-1 font-bold text-[#233B27] flex items-center gap-1.5">
                <CameraScanIcon className="h-4 w-4" />
                <span>สแกนผิวด้วย AI</span>
              </Link>
              <a href="#medications" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-olive-700">คลังยารักษาสิว</a>
              <a href="#acne-types" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-olive-700">ชนิดสิว 6 รูปแบบ</a>
              <Link href="/history" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-olive-700">ประวัติการตรวจ</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-olive-700">เกี่ยวกับระบบ</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
