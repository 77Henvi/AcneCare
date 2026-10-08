"use client";

import React from "react";

// ── Shared Realistic Botanical Leaves ──────────────────────────────
export function BotanicalLeaves({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`pointer-events-none fill-none ${className}`}>
      <path
        d="M20 180 C50 140, 90 90, 160 30"
        stroke="#4A754E"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M70 125 C50 110, 45 85, 65 75 C85 85, 80 110, 70 125 Z"
        fill="url(#leaf-grad-1)"
      />
      <path
        d="M105 95 C120 75, 145 75, 145 95 C130 110, 110 105, 105 95 Z"
        fill="url(#leaf-grad-2)"
      />
      <path
        d="M135 60 C130 35, 155 25, 170 40 C165 60, 145 65, 135 60 Z"
        fill="url(#leaf-grad-1)"
      />
      <path
        d="M40 155 C20 145, 15 125, 35 120 C50 130, 48 148, 40 155 Z"
        fill="url(#leaf-grad-2)"
      />
      <circle cx="110" cy="130" r="5" fill="#FFF9ED" />
      <circle cx="110" cy="130" r="2" fill="#E6A838" />

      <defs>
        <linearGradient id="leaf-grad-1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7DAE80" />
          <stop offset="100%" stopColor="#3B633F" />
        </linearGradient>
        <linearGradient id="leaf-grad-2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#92C195" />
          <stop offset="100%" stopColor="#48724C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Hero 3-Product Trio on Stone Podium (AI Skin & Medicine Edition) ─
export function HeroProductTrio() {
  return (
    <div className="relative mx-auto flex h-[340px] w-full max-w-[480px] items-end justify-center sm:h-[400px] lg:h-[440px]">
      {/* Botanical leaves behind */}
      <BotanicalLeaves className="absolute -left-6 top-8 h-40 w-40 -rotate-12 opacity-90 sm:h-56 sm:w-56" />
      <BotanicalLeaves className="absolute -right-8 top-12 h-44 w-44 scale-x-[-1] rotate-12 opacity-85 sm:h-60 sm:w-60" />

      {/* Stone / Marble Podium Base */}
      <div className="absolute bottom-0 h-16 w-full max-w-[440px] rounded-[50%] bg-gradient-to-r from-[#D7D0C3] via-[#EDE8DE] to-[#CBC4B6] shadow-[0_20px_35px_-10px_rgba(40,60,45,0.25)] border-t border-white/60">
        <div className="absolute inset-x-8 top-2 h-8 rounded-[50%] bg-gradient-to-r from-white/40 via-white/70 to-white/30 blur-[2px]" />
      </div>

      {/* Product 1: Benzoyl Peroxide Cleanser / Tube (Left) */}
      <div className="relative z-10 -mr-4 mb-3 h-[240px] w-[100px] transition-transform duration-500 hover:-translate-y-2 sm:h-[280px] sm:w-[120px] lg:h-[310px] lg:w-[130px]">
        <svg viewBox="0 0 100 240" className="h-full w-full drop-shadow-xl">
          <defs>
            <linearGradient id="tube-body" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#B3CFB7" />
              <stop offset="35%" stopColor="#CCE3CF" />
              <stop offset="85%" stopColor="#ADC9B1" />
              <stop offset="100%" stopColor="#92B097" />
            </linearGradient>
            <linearGradient id="tube-cap" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#829C85" />
              <stop offset="50%" stopColor="#A4C2A7" />
              <stop offset="100%" stopColor="#768F7A" />
            </linearGradient>
          </defs>
          <path d="M 22 10 L 78 10 L 75 22 L 25 22 Z" fill="#9FBCA3" />
          <path d="M 25 22 Q 18 100 22 195 L 78 195 Q 82 100 75 22 Z" fill="url(#tube-body)" />
          <path d="M 32 30 Q 30 110 33 185" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.45" fill="none" />
          <rect x="30" y="195" width="40" height="25" rx="3" fill="url(#tube-cap)" />
          
          <text x="50" y="65" textAnchor="middle" fill="#1C3722" fontFamily="'Playfair Display', serif" fontSize="8" fontWeight="700" letterSpacing="1.5">ACNECARE</text>
          <text x="50" y="73" textAnchor="middle" fill="#2E4F35" fontSize="4.5" letterSpacing="1.2">DERMATOLOGY</text>
          <line x1="38" y1="79" x2="62" y2="79" stroke="#2E4F35" strokeWidth="0.5" opacity="0.5" />
          <text x="50" y="93" textAnchor="middle" fill="#1C3722" fontSize="6.2" fontWeight="700">BENZOYL</text>
          <text x="50" y="102" textAnchor="middle" fill="#1C3722" fontSize="5.5" fontWeight="600">PEROXIDE</text>
          <text x="50" y="115" textAnchor="middle" fill="#245030" fontSize="5" fontWeight="bold">BP 2.5% - 5%</text>
          <text x="50" y="125" textAnchor="middle" fill="#3D5A42" fontSize="4" fontStyle="italic">Anti-Bacterial Active</text>
          <text x="50" y="152" textAnchor="middle" fill="#5A775E" fontSize="3.8">สำหรับสิวอักเสบ</text>
          <text x="50" y="166" textAnchor="middle" fill="#5A775E" fontSize="4" fontWeight="600">Medical OTC Care</text>
        </svg>
      </div>

      {/* Product 2: Salicylic Acid / Retinoid Serum Dropper (Center) */}
      <div className="relative z-20 mb-6 h-[210px] w-[85px] transition-transform duration-500 hover:-translate-y-2 sm:h-[250px] sm:w-[100px] lg:h-[280px] lg:w-[110px]">
        <svg viewBox="0 0 100 240" className="h-full w-full drop-shadow-2xl">
          <defs>
            <linearGradient id="dropper-cap" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1C211E" />
              <stop offset="50%" stopColor="#3D443E" />
              <stop offset="100%" stopColor="#1A1F1C" />
            </linearGradient>
            <linearGradient id="glass-bottle" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EAEFEB" stopOpacity="0.9" />
              <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#E0EBE2" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#CBDBCF" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="serum-liquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FAF7EB" />
              <stop offset="100%" stopColor="#EFE3C3" />
            </linearGradient>
          </defs>
          <path d="M 40 10 C 40 2, 60 2, 60 10 L 58 35 L 42 35 Z" fill="url(#dropper-cap)" />
          <rect x="36" y="35" width="28" height="18" rx="2" fill="url(#dropper-cap)" />
          <rect x="34" y="49" width="32" height="4" rx="1" fill="#D4AF37" opacity="0.9" />
          
          <path d="M 38 53 L 62 53 Q 75 58 75 75 L 75 200 Q 75 210 65 210 L 35 210 Q 25 210 25 200 L 25 75 Q 25 58 38 53 Z" fill="url(#glass-bottle)" />
          <path d="M 28 85 L 72 85 L 72 198 Q 72 206 63 206 L 37 206 Q 28 206 28 198 Z" fill="url(#serum-liquid)" opacity="0.8" />

          <rect x="30" y="90" width="40" height="95" rx="3" fill="#FFFFFF" opacity="0.95" stroke="#E3EAE4" strokeWidth="0.5" />
          <text x="50" y="108" textAnchor="middle" fill="#1C3722" fontFamily="'Playfair Display', serif" fontSize="6" fontWeight="700">ACNECARE</text>
          <text x="50" y="115" textAnchor="middle" fill="#3D5A42" fontSize="3.5" letterSpacing="0.8">ACTIVE SERUM</text>
          <line x1="36" y1="120" x2="64" y2="120" stroke="#7A9A7E" strokeWidth="0.4" />
          
          <text x="50" y="132" textAnchor="middle" fill="#1C3722" fontSize="5.5" fontWeight="700">SALICYLIC</text>
          <text x="50" y="140" textAnchor="middle" fill="#245030" fontSize="5" fontWeight="bold">BHA 2.0%</text>
          <text x="50" y="152" textAnchor="middle" fill="#4B664F" fontSize="3.5" fontStyle="italic">ละลายสิวอุดตัน</text>
          <text x="50" y="174" textAnchor="middle" fill="#6A856D" fontSize="3.5" fontWeight="600">30 ml • Cleanse Pores</text>

          <path d="M 30 65 L 30 200" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.7" fill="none" />
        </svg>
      </div>

      {/* Product 3: Barrier Repair Ceramide Cream Jar (Right) */}
      <div className="relative z-10 -ml-4 mb-2 h-[150px] w-[130px] transition-transform duration-500 hover:-translate-y-2 sm:h-[180px] sm:w-[155px] lg:h-[200px] lg:w-[170px]">
        <svg viewBox="0 0 160 180" className="h-full w-full drop-shadow-xl">
          <defs>
            <linearGradient id="jar-lid" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1E2420" />
              <stop offset="40%" stopColor="#3E4940" />
              <stop offset="70%" stopColor="#252D26" />
              <stop offset="100%" stopColor="#151A16" />
            </linearGradient>
            <linearGradient id="jar-body" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#B3CFB7" />
              <stop offset="35%" stopColor="#CCE3CF" />
              <stop offset="85%" stopColor="#ADC9B1" />
              <stop offset="100%" stopColor="#92B097" />
            </linearGradient>
          </defs>
          
          <rect x="25" y="25" width="110" height="32" rx="4" fill="url(#jar-lid)" />
          <path d="M 28 32 L 132 32" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.25" />

          <path d="M 28 57 L 132 57 Q 138 60 138 72 L 138 135 Q 138 148 126 148 L 34 148 Q 22 148 22 135 L 22 72 Q 22 60 28 57 Z" fill="url(#jar-body)" />
          <rect x="34" y="65" width="92" height="68" rx="2" fill="#FFFFFF" opacity="0.95" />
          
          <text x="80" y="82" textAnchor="middle" fill="#1C3722" fontFamily="'Playfair Display', serif" fontSize="7" fontWeight="700">ACNECARE</text>
          <text x="80" y="89" textAnchor="middle" fill="#3D5A42" fontSize="4">BARRIER REPAIR</text>
          <line x1="55" y1="94" x2="105" y2="94" stroke="#7A9A7E" strokeWidth="0.5" />
          
          <text x="80" y="105" textAnchor="middle" fill="#1C3722" fontSize="5.5" fontWeight="700">CERAMIDE + CENTELLA</text>
          <text x="80" y="114" textAnchor="middle" fill="#245030" fontSize="4.5" fontWeight="bold">ฟื้นฟูผิวหลังทายาสิว</text>
          <text x="80" y="125" textAnchor="middle" fill="#6A856D" fontSize="3.8">50 g • Non-Comedogenic</text>

          <path d="M 28 70 L 28 138" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none" />
        </svg>
      </div>
    </div>
  );
}

// ── Category SVG Visual Thumbnails for Acne Types ─────────────────
export function CategoryVisual({ type }: { type: string }) {
  switch (type) {
    case "whitehead":
      return (
        <div className="relative flex h-full w-full items-center justify-center p-3">
          <svg viewBox="0 0 120 140" className="h-full w-full drop-shadow-md">
            {/* Whitehead diagram on pore */}
            <rect x="25" y="40" width="70" height="70" rx="8" fill="#F4EFE6" stroke="#D3DFC4" strokeWidth="1" />
            <circle cx="60" cy="70" r="18" fill="#FFFFFF" stroke="#E2CDB5" strokeWidth="2" />
            <circle cx="60" cy="70" r="8" fill="#FBF8EE" />
            <text x="60" y="102" textAnchor="middle" fill="#27482E" fontSize="6" fontWeight="bold">สิวหัวขาว (Whitehead)</text>
          </svg>
        </div>
      );
    case "blackhead":
      return (
        <div className="relative flex h-full w-full items-center justify-center p-3">
          <svg viewBox="0 0 120 140" className="h-full w-full drop-shadow-md">
            <rect x="25" y="40" width="70" height="70" rx="8" fill="#F4EFE6" stroke="#D3DFC4" strokeWidth="1" />
            <circle cx="60" cy="70" r="18" fill="#FFFFFF" stroke="#3D453E" strokeWidth="2" />
            <circle cx="60" cy="70" r="9" fill="#222823" />
            <text x="60" y="102" textAnchor="middle" fill="#27482E" fontSize="6" fontWeight="bold">สิวหัวดำ (Blackhead)</text>
          </svg>
        </div>
      );
    case "papule":
      return (
        <div className="relative flex h-full w-full items-center justify-center p-3">
          <svg viewBox="0 0 120 140" className="h-full w-full drop-shadow-md">
            <rect x="25" y="40" width="70" height="70" rx="8" fill="#FBEAEA" stroke="#E5BEBE" strokeWidth="1" />
            <circle cx="60" cy="70" r="20" fill="#E87272" opacity="0.3" />
            <circle cx="60" cy="70" r="13" fill="#D64848" />
            <text x="60" y="102" textAnchor="middle" fill="#B53A3A" fontSize="6" fontWeight="bold">สิวตุ่มแดง (Papule)</text>
          </svg>
        </div>
      );
    case "pustule":
      return (
        <div className="relative flex h-full w-full items-center justify-center p-3">
          <svg viewBox="0 0 120 140" className="h-full w-full drop-shadow-md">
            <rect x="25" y="40" width="70" height="70" rx="8" fill="#FBF3E6" stroke="#ECD8B8" strokeWidth="1" />
            <circle cx="60" cy="70" r="22" fill="#E56A6A" opacity="0.35" />
            <circle cx="60" cy="70" r="14" fill="#D84E4E" />
            <circle cx="60" cy="70" r="6" fill="#FFFBE6" stroke="#E2BA4B" strokeWidth="1" />
            <text x="60" y="102" textAnchor="middle" fill="#9C521E" fontSize="6" fontWeight="bold">สิวตุ่มหนอง (Pustule)</text>
          </svg>
        </div>
      );
    case "nodule":
      return (
        <div className="relative flex h-full w-full items-center justify-center p-3">
          <svg viewBox="0 0 120 140" className="h-full w-full drop-shadow-md">
            <rect x="25" y="40" width="70" height="70" rx="8" fill="#F6E7E7" stroke="#DCAEAE" strokeWidth="1" />
            <circle cx="60" cy="70" r="26" fill="#BF3535" opacity="0.4" />
            <circle cx="60" cy="70" r="16" fill="#A82828" />
            <text x="60" y="102" textAnchor="middle" fill="#8E1F1F" fontSize="5.5" fontWeight="bold">สิวหัวช้าง/ซีสต์ (พบแพทย์)</text>
          </svg>
        </div>
      );
    case "oily":
    default:
      return (
        <div className="relative flex h-full w-full items-center justify-center p-3">
          <svg viewBox="0 0 120 140" className="h-full w-full drop-shadow-md">
            <rect x="25" y="40" width="70" height="70" rx="8" fill="#EBF2ED" stroke="#BED8C3" strokeWidth="1" />
            <path d="M 60 52 C 50 68, 45 76, 45 84 A 15 15 0 0 0 75 84 C 75 76, 70 68, 60 52 Z" fill="#6EA575" />
            <text x="60" y="102" textAnchor="middle" fill="#244E29" fontSize="5.8" fontWeight="bold">ผิวมัน &amp; รูขุมขนกว้าง</text>
          </svg>
        </div>
      );
  }
}

// ── Medical Flatlay Visual for Promo Banner ───────────────────────
export function PromoFlatlayVisual() {
  return (
    <div className="relative flex h-[240px] w-full max-w-[380px] items-center justify-center sm:h-[280px]">
      <BotanicalLeaves className="absolute -right-6 -top-4 h-48 w-48 rotate-45 opacity-90" />
      <BotanicalLeaves className="absolute -bottom-6 -left-6 h-40 w-40 -rotate-45 opacity-80" />
      
      {/* Medical Stethoscope / Capsule Badge */}
      <div className="absolute left-6 top-6 h-28 w-28 rounded-full border-4 border-white/80 bg-gradient-to-br from-[#FAF5EC] to-[#E9DFCF] shadow-lg flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <svg className="h-6 w-6 text-[#213C27] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="font-display text-[9px] font-bold tracking-wider text-[#233B27]">DERMA RX</span>
        </div>
      </div>

      {/* Adapalene Tube Diagonal */}
      <div className="relative z-10 -rotate-12 transition-transform duration-500 hover:rotate-0">
        <svg viewBox="0 0 100 220" className="h-48 w-24 sm:h-56 sm:w-28 drop-shadow-2xl">
          <rect x="36" y="10" width="28" height="22" rx="3" fill="#1C221E" />
          <path d="M 28 32 L 72 32 Q 80 38 80 55 L 80 185 Q 80 198 68 198 L 32 198 Q 20 198 20 185 L 20 55 Q 20 38 28 32 Z" fill="#E8EFE9" stroke="#CCDACC" strokeWidth="1" />
          <rect x="26" y="65" width="48" height="85" rx="2" fill="#FFFFFF" />
          <text x="50" y="80" textAnchor="middle" fill="#1C3722" fontSize="5" fontWeight="bold">ACNECARE</text>
          <text x="50" y="90" textAnchor="middle" fill="#245030" fontSize="5" fontWeight="bold">ADAPALENE</text>
          <text x="50" y="99" textAnchor="middle" fill="#1C3722" fontSize="4.5">GEL 0.1%</text>
          <text x="50" y="110" textAnchor="middle" fill="#4B664F" fontSize="3.5" fontStyle="italic">Topical Retinoid</text>
          <text x="50" y="125" textAnchor="middle" fill="#2C4831" fontSize="3.5">ลดสิวอุดตันเรื้อรัง</text>
        </svg>
      </div>

      {/* Azelaic Acid Cream Layered */}
      <div className="relative z-20 ml-2 mt-8 rotate-12 transition-transform duration-500 hover:rotate-6">
        <svg viewBox="0 0 100 220" className="h-44 w-20 sm:h-52 sm:w-24 drop-shadow-2xl">
          <path d="M 22 20 L 78 20 L 72 170 L 28 170 Z" fill="#D2E4D6" />
          <rect x="34" y="170" width="32" height="20" rx="3" fill="#9FBCA3" />
          <text x="50" y="60" textAnchor="middle" fill="#1C3722" fontSize="5.5" fontWeight="bold">AZELAIC ACID</text>
          <text x="50" y="72" textAnchor="middle" fill="#245030" fontSize="6" fontWeight="bold">20% GEL</text>
          <text x="50" y="85" textAnchor="middle" fill="#1C3722" fontSize="4">ลดรอยดำ รอยแดง</text>
          <text x="50" y="96" textAnchor="middle" fill="#3D5A42" fontSize="3.5">และต้านการอักเสบ</text>
        </svg>
      </div>
    </div>
  );
}

// ── Medical Medication Card Visual ─────────────────────────────────
export function MedicationCardVisual({ id }: { id: string }) {
  switch (id) {
    case "benzoyl-peroxide":
      return (
        <div className="relative flex h-48 w-full items-center justify-center bg-[#F4F1EA] p-4 sm:h-56">
          <BotanicalLeaves className="absolute -left-2 bottom-0 h-28 w-28 opacity-80" />
          <svg viewBox="0 0 100 200" className="h-full w-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105">
            <rect x="28" y="45" width="44" height="110" rx="10" fill="#BFD8C3" />
            <rect x="42" y="24" width="16" height="22" fill="#233B27" rx="3" />
            <path d="M 32 24 L 68 24 L 72 32 L 28 32 Z" fill="#233B27" />
            <rect x="34" y="68" width="32" height="60" rx="3" fill="#FFFFFF" opacity="0.95" />
            <text x="50" y="84" textAnchor="middle" fill="#1C3722" fontSize="4.5" fontWeight="bold">BENZOYL</text>
            <text x="50" y="92" textAnchor="middle" fill="#1C3722" fontSize="4.2" fontWeight="bold">PEROXIDE</text>
            <text x="50" y="103" textAnchor="middle" fill="#233B27" fontSize="5.5" fontWeight="bold">2.5% - 5%</text>
            <text x="50" y="114" textAnchor="middle" fill="#3D5A42" fontSize="3">ฆ่าเชื้อสิวอักเสบ</text>
          </svg>
        </div>
      );
    case "salicylic-acid":
      return (
        <div className="relative flex h-48 w-full items-center justify-center bg-[#F4F1EA] p-4 sm:h-56">
          <BotanicalLeaves className="absolute -right-2 top-2 h-28 w-28 opacity-80 scale-x-[-1]" />
          <svg viewBox="0 0 100 200" className="h-full w-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105">
            <path d="M 38 12 C 38 5, 62 5, 62 12 L 60 38 L 40 38 Z" fill="#1F2620" />
            <rect x="36" y="38" width="28" height="16" rx="2" fill="#1F2620" />
            <rect x="34" y="52" width="32" height="4" rx="1" fill="#D4AF37" />
            <rect x="28" y="56" width="44" height="100" rx="8" fill="#F0DCB8" stroke="#D3B88C" strokeWidth="1" />
            <rect x="34" y="75" width="32" height="55" rx="2" fill="#FFFFFF" />
            <text x="50" y="90" textAnchor="middle" fill="#1C3722" fontSize="4.5" fontWeight="bold">SALICYLIC</text>
            <text x="50" y="100" textAnchor="middle" fill="#233B27" fontSize="5.5" fontWeight="bold">BHA 2%</text>
            <text x="50" y="110" textAnchor="middle" fill="#3D5A42" fontSize="3.2">ละลายสิวอุดตัน</text>
          </svg>
        </div>
      );
    case "adapalene":
      return (
        <div className="relative flex h-48 w-full items-center justify-center bg-[#F4F1EA] p-4 sm:h-56">
          <BotanicalLeaves className="absolute -left-2 top-0 h-24 w-24 opacity-70" />
          <svg viewBox="0 0 100 200" className="h-full w-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105">
            <path d="M 28 35 L 72 35 L 68 150 L 32 150 Z" fill="#C2DBC6" />
            <rect x="38" y="150" width="24" height="18" rx="2" fill="#2D4833" />
            <rect x="32" y="60" width="36" height="60" rx="2" fill="#FFFFFF" />
            <text x="50" y="76" textAnchor="middle" fill="#1C3722" fontSize="4.5" fontWeight="bold">ADAPALENE</text>
            <text x="50" y="86" textAnchor="middle" fill="#233B27" fontSize="5" fontWeight="bold">GEL 0.1%</text>
            <text x="50" y="96" textAnchor="middle" fill="#3D5A42" fontSize="3.2">เรตินอยด์รักษาสิว</text>
            <text x="50" y="105" textAnchor="middle" fill="#3D5A42" fontSize="3">ปรับการผลัดเซลล์</text>
          </svg>
        </div>
      );
    case "azelaic-acid":
    default:
      return (
        <div className="relative flex h-48 w-full items-center justify-center bg-[#F4F1EA] p-4 sm:h-56">
          <BotanicalLeaves className="absolute -right-2 bottom-0 h-24 w-24 opacity-70 scale-x-[-1]" />
          <svg viewBox="0 0 100 200" className="h-full w-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105">
            <path d="M 26 30 L 74 30 L 70 145 L 30 145 Z" fill="#E8D2C5" />
            <rect x="38" y="145" width="24" height="18" rx="2" fill="#4B664F" />
            <rect x="32" y="55" width="36" height="60" rx="2" fill="#FFFFFF" />
            <text x="50" y="72" textAnchor="middle" fill="#1C3722" fontSize="4.2" fontWeight="bold">AZELAIC</text>
            <text x="50" y="81" textAnchor="middle" fill="#233B27" fontSize="5" fontWeight="bold">ACID 20%</text>
            <text x="50" y="92" textAnchor="middle" fill="#3D5A42" fontSize="3.2">ลดรอยดำ รอยแดง</text>
            <text x="50" y="100" textAnchor="middle" fill="#3D5A42" fontSize="3">ต้านการอักเสบ</text>
          </svg>
        </div>
      );
  }
}
