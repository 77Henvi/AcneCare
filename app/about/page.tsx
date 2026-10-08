"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangleIcon, ShieldCheckIcon, FileTextIcon, CameraScanIcon } from "@/components/purelis/Icons";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function AboutPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-3xl px-4 py-8 sm:py-12 space-y-8"
    >
      <motion.div variants={item}>
        <span className="font-display text-xs font-bold uppercase tracking-wider text-[#3D6345]">
          MEDICAL INFORMATION &amp; ETHICS
        </span>
        <h1 className="mt-1 font-display text-3xl font-bold text-[#1C3221]">เกี่ยวกับระบบ AcneCare AI</h1>
        <p className="mt-1 text-xs sm:text-sm text-ink/70">
          ระบบต้นแบบตรวจประเมินสิวเบื้องต้น พร้อมระบุข้อมูลตัวยาที่เหมาะกับคุณ
        </p>
      </motion.div>

      {/* Warning Box */}
      <motion.div variants={item} className="rounded-2xl border border-red-200 bg-red-50/75 p-6 text-sm text-red-900 space-y-2.5 shadow-sm">
        <div className="font-display font-bold flex items-center gap-2 text-base text-red-900">
          <AlertTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span>ระบบนี้ไม่ใช่เครื่องมือวินิจฉัยโรคทางการแพทย์ (Not a Medical Diagnostic Device)</span>
        </div>
        <p className="text-xs leading-relaxed text-red-800">
          ผลลัพธ์ทั้งหมดเป็นการประเมินจากลักษณะภาพถ่ายใบหน้าเบื้องต้นด้วยระบบ AI (Computer Vision)
          ไม่สามารถใช้ทดแทนการตรวจวินิจฉัย การสั่งจ่ายยา หรือคำแนะนำโดยแพทย์ผิวหนังผู้เชี่ยวชาญได้
          หากคุณมีสิวอักเสบรุนแรง สิวหัวช้าง หรือมีอาการเจ็บเรื้อรัง ควรเข้ารับการตรวจจากแพทย์ผิวหนังโดยตรง
        </p>
      </motion.div>

      {/* Privacy Box */}
      <motion.div variants={item} className="space-y-3.5 rounded-2xl border border-sand-300 bg-white p-6 sm:p-7 shadow-xs">
        <h2 className="font-display text-xl font-bold text-[#1C3221] flex items-center gap-2.5">
          <ShieldCheckIcon className="h-5 w-5 text-teal-700" />
          <span>ความเป็นส่วนตัวและความปลอดภัย (Client-Side Privacy)</span>
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-ink/75 font-sans">
          กระบวนการตรวจสอบคุณภาพภาพและการวิเคราะห์ใบหน้าทั้งหมดถูกออกแบบให้ประมวลผลบนเครื่องของคุณเอง
          (Client-side execution) ระบบไม่มีการส่งภาพถ่ายใบหน้าจริงขึ้นสู่เซิร์ฟเวอร์ภายนอก เพื่อรักษาความลับและความเป็นส่วนตัวสูงสุด
        </p>
      </motion.div>

      {/* Reference Box */}
      {/* Reference Box */}
      <motion.div variants={item} className="space-y-3.5 rounded-2xl border border-sand-300 bg-white p-6 sm:p-7 shadow-xs">
        <h2 className="font-display text-xl font-bold text-[#1C3221] flex items-center gap-2.5">
          <FileTextIcon className="h-5 w-5 text-teal-700" />
          <span>แหล่งอ้างอิงของข้อมูล</span>
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-ink/75 font-sans">
          ข้อมูลชนิดสิวและตัวยาในระบบนี้รวบรวมจากเอกสารต่อไปนี้ เพื่อให้ความรู้เบื้องต้น
          ไม่ใช่แนวทางเวชปฏิบัติของหน่วยงานใด และไม่ใช่คำแนะนำในการสั่งจ่ายยา
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-xs sm:text-sm leading-relaxed text-ink/75 font-sans">
          <li>
            Acne Therapark ภาคตจวิทยา คณะแพทยศาสตร์ศิริราชพยาบาล มหาวิทยาลัยมหิดล (นิทรรศการ METex 2022)
            — ใช้สำหรับการจำแนกชนิดสิว 6 ชนิด{" "}
            <a
              href="https://www.si.mahidol.ac.th/metc/met/th/images/exhibition/METex2022/Acne/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-olive-700 underline-offset-2 hover:underline"
            >
              เปิดเว็บไซต์
            </a>
          </li>
          <li>
            เชิดชัย สุนทรภาส. แนวปฏิบัติการใช้ยารักษาสิวในร้านยา. สาขาวิชาเภสัชกรรมคลินิก คณะเภสัชศาสตร์ มหาวิทยาลัยขอนแก่น
            — ใช้สำหรับระดับความรุนแรง ตัวยาทาและความเข้มข้น ข้อมูลที่ปรากฏในเอกสารนี้อ้างอิงแนวทางของ DST, AAD, SEA และ EDF
          </li>
          <li>
            เบญญาภา เพชรปวรรักษ์, ศุภาพิชญ์ แก้วลี. ยารักษาสิว. ฉลาดใช้ยา (Rama RDU) งานเภสัชกรรมคลินิก
            คณะแพทยศาสตร์โรงพยาบาลรามาธิบดี มหาวิทยาลัยมหิดล — ใช้สำหรับผลข้างเคียงและข้อควรระวังของยา
          </li>
        </ol>
        {/* TODO(ทีม): ถ้ายังใช้ข้อมูลจาก Wikipedia หรือ AI ในส่วนอื่นของระบบ ให้เพิ่มรายการที่ระบุชื่อบทความ/วันที่เข้าถึง
            หรือระบุว่าสร้างด้วย AI และยังไม่ผ่านการตรวจโดยแพทย์ */}
      </motion.div>


      <motion.div variants={item} className="pt-2 text-center">
        <Link href="/scan">
          <motion.span
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-none bg-[#213C27] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-md hover:bg-[#142618] transition-all cursor-pointer"
          >
            <CameraScanIcon className="h-4 w-4 text-[#A7D9B0]" />
            <span>ไปที่หน้าสแกนผิว AI</span>
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
