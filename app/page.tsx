"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroScanVisual from "@/components/HeroScanVisual";

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
    <div className="space-y-14 sm:space-y-16">
      <section className="grid items-center gap-10 pt-2 sm:pt-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 xl:gap-20">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
          <motion.p variants={item} className="text-xs uppercase tracking-wide text-teal-600/80 sm:text-sm">
            AI Skin Analysis — ต้นแบบ
          </motion.p>

          <motion.h1
            variants={item}
            className="text-balance font-display text-4xl leading-[1.1] text-teal-900 sm:text-5xl lg:text-6xl"
          >
            รู้จักผิวคุณ<span className="text-teal-400">ให้ลึกขึ้น</span>
          </motion.h1>

          <motion.p variants={item} className="max-w-md text-sm text-ink/70 sm:text-base">
            ถ่ายรูปหน้า แล้วให้ AI ช่วยประเมินลักษณะผิวและลักษณะสิวเบื้องต้น พร้อมคำแนะนำการดูแลผิวที่ปลอดภัย
            — ไม่ใช่เครื่องมือวินิจฉัยโรคและไม่ทดแทนคำแนะนำของแพทย์
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
            <Link href="/scan" className="inline-block">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center rounded-card bg-teal-600 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-teal-900 transition-colors"
              >
                เริ่มสแกนผิว
              </motion.span>
            </Link>
            <Link href="/about" className="text-sm text-ink/55 underline-offset-4 hover:text-teal-600 hover:underline">
              เกี่ยวกับความปลอดภัย
            </Link>
          </motion.div>

          <motion.dl variants={item} className="grid max-w-md grid-cols-3 gap-3 border-t border-sand-300 pt-6 sm:gap-4">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd className="font-display text-xl text-teal-900 sm:text-2xl">{f.value}</dd>
                <dd className="mt-0.5 text-[11px] leading-snug text-ink/55 sm:text-xs">{f.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="mx-auto w-full max-w-[220px] sm:max-w-[260px] lg:max-w-[280px]"
        >
          <HeroScanVisual />
        </motion.div>
      </section>

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
