"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroScanVisual from "@/components/HeroScanVisual";
import HeroBlobBackground from "@/components/HeroBlobBackground";
import RotatingBadge from "@/components/RotatingBadge";
import FloatingPreviewCard from "@/components/FloatingPreviewCard";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// Honest, non-clinical facts about the system itself
const facts = [
  { value: "7", label: "ชนิดสิวตามหลักการแพทย์" },
  { value: "5", label: "บริเวณใบหน้าที่วิเคราะห์" },
  { value: "0", label: "ภาพส่งขึ้นเซิร์ฟเวอร์ (ปลอดภัย)" },
];

export default function LandingPage() {
  return (
    <div className="space-y-10 sm:space-y-14 lg:space-y-16">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2rem] border border-sand-300/80 bg-gradient-to-br from-teal-50/70 via-teal-50/40 to-sand-100/30 p-6 sm:p-10 lg:p-12 xl:p-14 shadow-[0_4px_24px_-10px_rgba(27,33,30,0.05)]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* Left Content Column (7 cols on lg) */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6 sm:space-y-7 lg:col-span-7"
          >
            <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-teal-600/20 bg-teal-50/80 px-3.5 py-1 text-xs font-medium text-teal-900 shadow-sm backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-pulse"></span>
              <span>AI Skin Analysis — ต้นแบบ</span>
            </motion.div>

            <motion.h1 variants={item} className="font-display tracking-tight text-teal-900">
              <span className="block text-3xl font-medium sm:text-4xl lg:text-5xl">
                รู้จัก
              </span>
              <span className="block text-4xl font-bold text-teal-600 sm:text-5xl lg:text-6xl my-0.5">
                ผิวคุณ
              </span>
              <span className="block text-3xl font-medium sm:text-4xl lg:text-5xl">
                ให้ลึกขึ้น
              </span>
            </motion.h1>

            <motion.p variants={item} className="max-w-xl text-sm leading-relaxed text-ink/75 sm:text-base">
              ถ่ายรูปหน้า แล้วให้ AI ช่วยประเมินลักษณะผิวและลักษณะสิวเบื้องต้น พร้อมคำแนะนำการดูแลผิวที่ปลอดภัย
              <span className="mt-2 block text-xs text-ink/55">
                * ไม่ใช่เครื่องมือวินิจฉัยโรคทางการแพทย์ และไม่ทดแทนคำแนะนำของแพทย์ผู้เชี่ยวชาญ
              </span>
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap items-center gap-3 pt-1 sm:gap-4">
              <Link href="/scan" className="inline-block">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-card bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(37,96,79,0.45)] hover:bg-teal-900 transition-colors cursor-pointer"
                >
                  เริ่มสแกนผิว
                  <span aria-hidden>→</span>
                </motion.span>
              </Link>
              <Link
                href="/about"
                className="rounded-card border border-teal-900/20 bg-surface/70 px-5 py-3.5 text-sm font-medium text-ink/80 hover:border-teal-600 hover:text-teal-900 hover:bg-surface transition-all"
              >
                เกี่ยวกับความปลอดภัย
              </Link>
            </motion.div>

            <motion.dl variants={item} className="grid grid-cols-3 gap-3 border-t border-sand-300/80 pt-6 sm:gap-6 max-w-xl">
              {facts.map((f) => (
                <div key={f.label} className="space-y-1">
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="font-display text-2xl font-bold text-teal-900 sm:text-3xl">{f.value}</dd>
                  <dd className="text-[11px] font-medium leading-snug text-ink/65 sm:text-xs">{f.label}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* Right Visual Stage (5 cols on lg) */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="relative flex w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[380px] items-center justify-center p-4 sm:p-6">
              <HeroBlobBackground />

              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                className="relative w-full max-w-[220px] sm:max-w-[260px]"
              >
                <HeroScanVisual />
              </motion.div>

              {/* rotating badge — top-right */}
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-10">
                <RotatingBadge />
              </div>

              {/* floating example-output chips */}
              <div className="absolute -left-2 bottom-6 sm:-left-4 sm:bottom-8 z-10">
                <FloatingPreviewCard title="ผิวมัน · 84%" subtitle="ลักษณะผิวที่ AI ประเมิน" delay={0.7} />
              </div>
              <div className="absolute -right-2 -bottom-2 sm:-right-4 sm:bottom-0 z-10">
                <FloatingPreviewCard title="สิวตุ่มแดง" subtitle="แก้มซ้าย" delay={0.95} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature cards ────────────────────────────────────────────── */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[
          {
            num: "01",
            title: "ตรวจคุณภาพภาพ",
            body: "เช็กระดับแสง ความคมชัด และระยะใบหน้าก่อนส่งวิเคราะห์ เพื่อความแม่นยำสูงสุด",
          },
          {
            num: "02",
            title: "ประเมินลักษณะผิว",
            body: "จำแนกสภาพผิว (ผิวมัน ผิวแห้ง ผิวผสม หรือผิวธรรมดา) ด้วยระบบ AI Computer Vision",
          },
          {
            num: "03",
            title: "ประเมินลักษณะสิว",
            body: "จำแนก 7 ชนิดสิวตามหลักการแพทย์ผิวหนัง พร้อมแนวทางดูแลผิวที่ปลอดภัยและถูกวิธี",
          },
        ].map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            whileHover={{ y: -3, borderColor: "#3C8272" }}
            className="group rounded-card border border-sand-300/80 bg-surface p-5 sm:p-6 shadow-sm transition-all hover:shadow-md hover:border-teal-400"
          >
            <span className="font-display text-xs font-bold tracking-widest text-teal-600/70">{f.num}</span>
            <h2 className="mt-1 font-display text-base font-semibold text-teal-900 group-hover:text-teal-600 transition-colors">
              {f.title}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-ink/70 sm:text-sm">{f.body}</p>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}
