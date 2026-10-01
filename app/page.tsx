"use client";

import HeroSection from "@/components/purelis/HeroSection";
import TrustBar from "@/components/purelis/TrustBar";
import CategorySection from "@/components/purelis/CategorySection";
import PromoBanner from "@/components/purelis/PromoBanner";
import NewArrivalsSection from "@/components/purelis/NewArrivalsSection";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 4-Point Trust Feature Bar ───────────────────────────────── */}
      <TrustBar />

      {/* ── Shop By Category (6 items) ──────────────────────────────── */}
      <CategorySection />

      {/* ── Sitewide Promo Banner (Up to 25% Off) ───────────────────── */}
      <PromoBanner />

      {/* ── New Arrivals (4 products with Add to Cart) ──────────────── */}
      <NewArrivalsSection />
    </div>
  );
}
