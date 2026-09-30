"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#3D6345]">MEDICAL INFORMATION &amp; ETHICS</span>
        <h1 className="mt-1 font-serif text-3xl font-bold text-[#1C3221]">เกี่ยวกับระบบ AcneCare AI</h1>
        <p className="mt-1 text-xs sm:text-sm text-ink/70">
          ระบบต้นแบบตรวจประเมินผิวและสิวเบื้องต้น พร้อมจับคู่ตัวยามาตรฐานทางการแพทย์
        </p>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50/70 p-5 text-sm text-red-900 space-y-2">
        <p className="font-bold flex items-center gap-2">
          <span>⚠️</span> ระบบนี้ไม่ใช่เครื่องมือวินิจฉัยโรคทางการแพทย์ (Not a Medical Diagnostic Device)
        </p>
        <p className="text-xs leading-relaxed text-red-800">
          ผลลัพธ์ทั้งหมดเป็นการประเมินจากลักษณะภาพถ่ายใบหน้าเบื้องต้นด้วยระบบ AI (Computer Vision)
          ไม่สามารถใช้ทดแทนการตรวจวินิจฉัย การสั่งจ่ายยา หรือคำแนะนำโดยแพทย์ผิวหนังผู้เชี่ยวชาญได้
          หากคุณมีสิวอักเสบรุนแรง สิวหัวช้าง หรือมีอาการเจ็บเรื้อรัง ควรเข้ารับการตรวจจากแพทย์ผิวหนังโดยตรง
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-sand-300 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-[#1C3221]">
          🔒 ความเป็นส่วนตัวและความปลอดภัย (Client-Side Privacy)
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-ink/75">
          กระบวนการตรวจสอบคุณภาพภาพและการวิเคราะห์ใบหน้าทั้งหมดถูกออกแบบให้ประมวลผลบนเครื่องของคุณเอง
          (Client-side execution) ระบบไม่มีการส่งภาพถ่ายใบหน้าจริงขึ้นสู่เซิร์ฟเวอร์ภายนอก เพื่อรักษาความลับและความเป็นส่วนตัวสูงสุด
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-sand-300 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-[#1C3221]">
          📚 แหล่งอ้างอิงและมาตรฐานทางการแพทย์
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-ink/75">
          อนุกรมวิธานของชนิดสิว (7 Acne Types Taxonomy) และคำแนะนำการใช้ตัวยาเฉพาะที่ (Topical Active Ingredients เช่น Benzoyl Peroxide, Adapalene, BHA, Azelaic Acid) 
          อ้างอิงจากแนวทางการดูแลรักษาสิว โดยภาควิชาตจวิทยา คณะแพทยศาสตร์ศิริราชพยาบาล มหาวิทยาลัยมหิดล และสมาคมแพทย์ผิวหนังแห่งประเทศไทย
        </p>
      </div>

      <div className="pt-2 text-center">
        <Link
          href="/scan"
          className="inline-block bg-[#233B27] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow hover:bg-[#182C1B] transition-colors"
        >
          📷 ไปที่หน้าสแกนผิว AI
        </Link>
      </div>
    </div>
  );
}
