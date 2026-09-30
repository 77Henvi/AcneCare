"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTreatment } from "@/lib/treatmentContext";
import { MEDICATIONS } from "@/lib/medications";

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
    <header className="sticky top-0 z-40 border-b border-sand-300/40 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-8 lg:py-4">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-ink hover:text-olive-700 lg:hidden"
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
          <span className="font-serif text-2xl font-bold tracking-[0.25em] text-[#16271A] sm:text-3xl">
            ACNECARE
          </span>
          <span className="text-[9px] font-semibold tracking-[0.45em] text-[#34583B] sm:text-[10px]">
            AI DERMATOLOGY
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[0.15em] text-[#28382B] lg:flex">
          <Link href="/" className="text-olive-800 font-bold border-b-2 border-olive-800 pb-0.5">
            หน้าแรก
          </Link>
          <Link href="/scan" className="transition-colors hover:text-olive-600 flex items-center gap-1 text-olive-700 font-bold">
            <span className="h-2 w-2 rounded-full bg-teal-600 animate-pulse"></span>
            สแกนผิว AI
          </Link>
          <div className="group relative">
            <a href="#medications" className="flex items-center gap-1 transition-colors hover:text-olive-600">
              คลังยารักษาสิว
              <svg className="h-3 w-3 opacity-60 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <div className="invisible absolute -left-4 top-full mt-2 w-56 rounded-lg border border-sand-300/60 bg-white p-2.5 shadow-xl opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              {MEDICATIONS.map((med) => (
                <button
                  key={med.id}
                  onClick={() => setSelectedMedication(med)}
                  className="block w-full text-left rounded px-3 py-2 text-xs font-medium text-ink hover:bg-[#F2F7F3] hover:text-olive-700"
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
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-1.5 rounded-full hover:bg-sand-100 transition-colors"
            aria-label="Search medication"
            title="ค้นหาตัวยาและแนวทางรักษา"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Saved Treatments Pill */}
          <button
            onClick={() => {
              if (savedTreatments.length > 0) {
                const first = MEDICATIONS.find((m) => m.id === savedTreatments[0]);
                if (first) setSelectedMedication(first);
              } else {
                showToast("ยังไม่มีตัวยาที่บันทึกไว้ ลองกดหัวใจที่ตัวยาด้านล่าง!");
              }
            }}
            className="relative flex items-center gap-1.5 rounded-full border border-sand-300 px-3 py-1.5 text-xs font-semibold text-[#1F3A24] hover:bg-sand-100 transition-colors"
            title="ตัวยาที่คุณบันทึกไว้"
          >
            <span>❤️</span>
            <span className="hidden sm:inline">ยาที่บันทึก</span>
            <span className="rounded-full bg-[#E5ECE5] px-1.5 text-[11px] font-bold">
              {savedTreatments.length}
            </span>
          </button>

          {/* Main CTA: Scan Skin */}
          <Link
            href="/scan"
            className="inline-flex items-center gap-1.5 rounded-none bg-[#233B27] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#182C1B]"
          >
            <span>📷 สแกนผิว AI</span>
          </Link>
        </div>
      </div>

      {/* Expandable Search Input */}
      {searchOpen && (
        <div className="border-t border-sand-300/60 bg-[#FAF8F5] px-4 py-3">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-xl items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาตัวยา เช่น Benzoyl Peroxide, BHA, Adapalene หรือชนิดสิว..."
              className="w-full rounded-full border border-sand-300 bg-white px-4 py-2 text-xs focus:border-olive-600 focus:outline-none sm:text-sm"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-full bg-[#233B27] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1A301F]"
            >
              ค้นหา
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-sand-300/60 bg-white px-6 py-5 text-sm font-semibold tracking-wider text-ink lg:hidden">
          <div className="flex flex-col space-y-3">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-1 text-olive-700">หน้าแรก</Link>
            <Link href="/scan" onClick={() => setMobileMenuOpen(false)} className="py-1 font-bold text-[#233B27]">📷 สแกนผิวด้วย AI</Link>
            <a href="#medications" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-olive-700">คลังยารักษาสิว</a>
            <a href="#acne-types" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-olive-700">ชนิดสิว 6 รูปแบบ</a>
            <Link href="/history" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-olive-700">ประวัติการตรวจ</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-olive-700">เกี่ยวกับระบบ</Link>
          </div>
        </div>
      )}
    </header>
  );
}
