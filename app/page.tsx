"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroScanVisual from "@/components/HeroScanVisual";
import HeroBlobBackground from "@/components/HeroBlobBackground";
import RotatingBadge from "@/components/RotatingBadge";
import FloatingPreviewCard from "@/components/FloatingPreviewCard";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Honest, non-clinical facts about the system itself — never a fabricated
// accuracy/percentage claim, per the design doc's medical-safety guardrail.
const facts = [
  { value: "7", label: "ชนิดสิวตามหลักการแพทย์" },
  { value: "5", label: "บริเวณใบหน้าที่วิเคราะห์" },
  { value: "0", label: "ภาพต้นฉบับที่ต้องอัปโหลดขึ้นเซิร์ฟเวอร์" },
];

export default function LandingPage() {
  return (
    <div className="space-y-14 sm:space-y-20">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[1.75rem] border border-sand-300/60 bg-teal-50/40 px-5 py-10 sm:rounded-[2.25rem] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-10 xl:gap-16">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.p variants={item} className="text-xs font-medium uppercase tracking-[0.15em] text-teal-600 sm:text-sm">
              AI Skin Analysis — ต้นแบบ
            </motion.p>

            <motion.h1 variants={item} className="text-balance leading-[0.98]">
              <span className="block font-display text-4xl font-medium text-teal-900 sm:text-5xl lg:text-6xl">
                รู้จัก
              </span>
              <span className="block font-display text-5xl font-bold tracking-tight text-teal-600 sm:text-6xl lg:text-7xl xl:text-8xl">
                ผิวคุณ
              </span>
              <span className="block font-display text-4xl font-medium text-teal-900 sm:text-5xl lg:text-6xl">
                ให้ลึกขึ้น
              </span>
            </motion.h1>

            <motion.p variants={item} className="max-w-md text-sm text-ink/70 sm:text-base">
              ถ่ายรูปหน้า แล้วให้ AI ช่วยประเมินลักษณะผิวและลักษณะสิวเบื้องต้น พร้อมคำแนะนำการดูแลผิวที่ปลอดภัย
              — ไม่ใช่เครื่องมือวินิจฉัยโรคและไม่ทดแทนคำแนะนำของแพทย์
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
              <Link href="/scan" className="inline-block">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-card bg-teal-600 px-6 py-3.5 text-sm font-medium text-white shadow-[0_10px_24px_-8px_rgba(37,96,79,0.55)] hover:bg-teal-900 transition-colors"
                >
                  เริ่มสแกนผิว
                  <span aria-hidden>→</span>
                </motion.span>
              </Link>
              <Link
                href="/about"
                className="rounded-card border border-teal-900/15 px-5 py-3.5 text-sm font-medium text-ink/70 hover:border-teal-400 hover:text-teal-600 transition-colors"
              >
                เกี่ยวกับความปลอดภัย
              </Link>
            </motion.div>

            <motion.dl variants={item} className="grid max-w-md grid-cols-3 gap-3 border-t border-sand-300/80 pt-6 sm:gap-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="font-display text-xl text-teal-900 sm:text-2xl">{f.value}</dd>
                  <dd className="mt-0.5 text-[11px] leading-snug text-ink/55 sm:text-xs">{f.label}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* ── Visual side: blobs + scan visual + floating chips ─────── */}
          <div className="relative mx-auto flex w-full max-w-[300px] items-center justify-center py-6 lg:max-w-none lg:py-0">
            <HeroBlobBackground />

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="w-full max-w-[220px] sm:max-w-[250px] lg:max-w-[270px]"
            >
              <HeroScanVisual />
            </motion.div>

            {/* rotating badge — top-right, hidden on the smallest screens to avoid clutter */}
            <div className="absolute -right-1 -top-1 hidden sm:block lg:-right-3 lg:top-2">
              <RotatingBadge />
            </div>

            {/* floating example-output chips — desktop/tablet only; mobile keeps the hero clean */}
            <div className="absolute -left-2 bottom-6 hidden md:block lg:-left-8 lg:bottom-10">
              <FloatingPreviewCard title="ผิวมัน · 84%" subtitle="ลักษณะผิวที่ AI ประเมิน" delay={0.7} />
            </div>
            <div className="absolute -right-2 bottom-0 hidden md:block lg:-right-6 lg:bottom-2">
              <FloatingPreviewCard title="สิวตุ่มแดง" subtitle="แก้มซ้าย" delay={0.95} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature cards ────────────────────────────────────────────── */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[
          { title: "ตรวจคุณภาพภาพ", body: "เช็กแสง ความเบลอ และขนาดใบหน้าก่อนวิเคราะห์" },
          { title: "ประเมินลักษณะผิว", body: "จำแนกผิวมัน ผิวแห้ง ผิวผสม หรือผิวปกติ" },
          { title: "ประเมินลักษณะสิว", body: "แยกชนิดสิวตามหลักการแพทย์ พร้อมคำแนะนำที่เหมาะสม" },
        ].map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            whileHover={{ y: -3, borderColor: "#3C8272" }}
            className="rounded-card border border-sand-300 bg-surface p-5 transition-colors"
          >
            <h2 className="font-medium text-teal-900">{f.title}</h2>
            <p className="mt-1.5 text-sm text-ink/65">{f.body}</p>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}
