"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CategoryVisual } from "@/components/purelis/ProductVisuals";
import {
  MicroscopeIcon,
  TargetCrosshairIcon,
  StethoscopeIcon,
  AlertTriangleIcon,
  CameraScanIcon,
} from "@/components/purelis/Icons";
import { ACNE_LABEL_TH, ACNE_SEVERITY, AcneType, Severity } from "@/lib/taxonomy";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

interface AcneEntry {
  type: AcneType;
  visual: string; // key passed to CategoryVisual
  en: string;
  description: string;
  signs: string[];
}

const COMEDONAL: AcneEntry[] = [
  {
    type: "whitehead",
    visual: "whitehead",
    en: "Closed Comedone",
    description:
      "ตุ่มเล็กสีขาวนวลใต้ผิว เกิดจากไขมันและเซลล์ผิวที่ตายแล้วอุดตันอยู่ในรูขุมขนแบบ \"หัวปิด\" ไม่สัมผัสกับอากาศ จึงไม่เกิดการอักเสบและไม่เจ็บ",
    signs: ["ตุ่มนูนเล็ก ผิวเรียบ สีใกล้เคียงผิวปกติ", "กดแล้วไม่เจ็บ ไม่มีรอยแดงรอบ ๆ", "มักพบเป็นกลุ่มบริเวณหน้าผากและคาง"],
  },
  {
    type: "blackhead",
    visual: "blackhead",
    en: "Open Comedone",
    description:
      "เกิดจากกลไกเดียวกับสิวหัวขาว แต่รูขุมขนเปิดออก ทำให้ไขมันที่อุดตันสัมผัสอากาศแล้วเกิดปฏิกิริยาออกซิเดชันจนเปลี่ยนเป็นสีดำ — ไม่ใช่สิ่งสกปรกฝังแน่นตามที่เข้าใจกันทั่วไป",
    signs: ["จุดสีดำขนาดเล็กกลางรูขุมขน", "ผิวสัมผัสเป็นไตเล็ก ๆ ใต้จุดดำ", "พบบ่อยบริเวณจมูกและโซน T-zone"],
  },
];

const INFLAMMATORY: AcneEntry[] = [
  {
    type: "papule",
    visual: "papule",
    en: "Papule",
    description:
      "เกิดขึ้นเมื่อผนังรูขุมขนที่อุดตันแตกออก ทำให้ร่างกายเริ่มตอบสนองด้วยการอักเสบ กลายเป็นตุ่มนูนสีแดงขนาดเล็ก ยังไม่มีหนองให้เห็น",
    signs: ["ตุ่มนูนสีแดงหรือชมพู ไม่มีหัวหนอง", "กดแล้วรู้สึกเจ็บเล็กน้อย", "ผิวรอบตุ่มอาจบวมแดงเล็กน้อย"],
  },
  {
    type: "pustule",
    visual: "pustule",
    en: "Pustule",
    description:
      "ขั้นต่อจากสิวตุ่มแดง เมื่อเม็ดเลือดขาวเข้ามากำจัดเชื้อแบคทีเรียจำนวนมาก จนเกิดการสะสมเป็นหนองสีขาวหรือเหลืองที่ยอดตุ่ม",
    signs: ["มีหัวหนองสีขาว/เหลืองตรงกลางตุ่มแดง", "กดแล้วเจ็บ บางครั้งรู้สึกตึงบริเวณรอบ ๆ", "ไม่ควรบีบเอง เสี่ยงเชื้อแพร่กระจายและเป็นรอยดำ"],
  },
  {
    type: "nodule",
    visual: "nodule",
    en: "Nodule",
    description:
      "ก้อนอักเสบขนาดใหญ่ที่ฝังตัวลึกในชั้นผิวหนัง แข็ง ไม่มีหัวให้กดหรือบีบออก เกิดจากการอักเสบรุนแรงที่ลุกลามลึกกว่าสิวทั่วไปมาก",
    signs: ["ก้อนแข็งลึกใต้ผิว ไม่มีหัว", "เจ็บมากกว่าสิวชนิดอื่นอย่างชัดเจน", "เสี่ยงทิ้งรอยแผลเป็นถาวรสูง"],
  },
  {
    type: "cyst",
    visual: "nodule",
    en: "Cyst",
    description:
      "รุนแรงที่สุดในกลุ่มสิวอักเสบ เป็นถุงน้ำใต้ผิวหนังที่เต็มไปด้วยหนองปนเลือด ขนาดใหญ่และลึกกว่าสิวหัวช้าง สัมผัสจะรู้สึกนุ่มกว่าเล็กน้อยแต่เจ็บมาก",
    signs: ["ก้อนนุ่มกว่า nodule เล็กน้อยแต่ขนาดใหญ่กว่า", "เจ็บมาก บางครั้งมีไข้ร่วมบริเวณนั้น", "เสี่ยงแผลเป็นถาวรและการติดเชื้อซ้ำสูงที่สุด"],
  },
];

const SEVERITY_LABEL: Record<Severity, string> = {
  none: "ไม่มีนัยสำคัญ",
  low: "ความรุนแรงต่ำ",
  moderate: "ความรุนแรงปานกลาง",
  refer: "ควรพบแพทย์ผิวหนัง",
};

const SEVERITY_STYLE: Record<Severity, string> = {
  none: "bg-cream-200 text-ink/50 border-cream-400",
  low: "bg-olive-50 text-olive-700 border-olive-200",
  moderate: "bg-amber-50 text-amber-700 border-amber-200",
  refer: "bg-red-50 text-red-700 border-red-200",
};

function AcneCard({ entry }: { entry: AcneEntry }) {
  const severity = ACNE_SEVERITY[entry.type];
  return (
    <motion.div
      variants={item}
      className="flex flex-col gap-6 rounded-2xl border border-sand-300 bg-white p-6 shadow-xs sm:flex-row sm:p-7"
    >
      <div className="mx-auto h-36 w-36 flex-shrink-0 overflow-hidden rounded-xl bg-[#F4EFE6] sm:mx-0 sm:h-40 sm:w-40">
        <CategoryVisual type={entry.visual} />
      </div>

      <div className="flex-1 space-y-3.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h3 className="font-display text-xl font-bold text-[#1C3221] sm:text-2xl">
            {ACNE_LABEL_TH[entry.type]}
          </h3>
          <span className="rounded-full border border-sand-300 bg-cream-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink/50">
            {entry.en}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-ink/75">{entry.description}</p>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">ลักษณะที่สังเกตได้</p>
          <ul className="mt-1.5 space-y-1">
            {entry.signs.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-ink/70">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-olive-600" aria-hidden />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${SEVERITY_STYLE[severity]}`}
        >
          {severity === "refer" && <StethoscopeIcon className="h-3.5 w-3.5" />}
          {SEVERITY_LABEL[severity]}
        </span>

        {severity === "refer" && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs leading-relaxed text-red-800">
            <AlertTriangleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
            <span>
              ลักษณะนี้ควรได้รับการตรวจและรักษาโดยแพทย์ผิวหนังโดยตรง ไม่แนะนำให้บีบ กด หรือรักษาด้วยตนเอง
              เพราะเสี่ยงอักเสบลุกลามและทิ้งรอยแผลเป็นถาวร
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AcneTypesPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-4xl space-y-14 px-4 py-10 sm:py-14"
    >
      {/* ── Header ───────────────────────────────────────────────────── */}
      <motion.div variants={item} className="space-y-3 text-center sm:text-left">
        <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#3D6345]">
          ACNE TAXONOMY &amp; CLASSIFICATION
        </span>
        <h1 className="font-display text-3xl font-bold leading-[1.3] text-[#1C3221] sm:text-4xl">
          จำแนกชนิดสิว 6 แบบ อย่างละเอียด
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink/70 sm:mx-0 sm:text-base">
          สิวแบ่งออกเป็น 2 กลุ่มใหญ่ตามกลไกการเกิด คือ กลุ่มสิวอุดตันที่ยังไม่มีการอักเสบ
          และกลุ่มสิวอักเสบที่มีเชื้อแบคทีเรียเข้ามาเกี่ยวข้อง — เข้าใจความแตกต่างจะช่วยให้ดูแลผิวได้ถูกวิธีมากขึ้น
        </p>
      </motion.div>

      {/* ── Comedonal group ──────────────────────────────────────────── */}
      <motion.section variants={item} className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-olive-50 text-olive-700">
            <MicroscopeIcon className="h-4.5 w-4.5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-[#1C3221] sm:text-2xl">กลุ่มสิวอุดตัน (Comedonal)</h2>
            <p className="text-xs text-ink/55 sm:text-sm">ไขมันและเซลล์ผิวอุดตันรูขุมขน ยังไม่มีการอักเสบ</p>
          </div>
        </div>
        <motion.div variants={container} className="space-y-5">
          {COMEDONAL.map((e) => (
            <AcneCard key={e.type} entry={e} />
          ))}
        </motion.div>
      </motion.section>

      {/* ── Inflammatory group ───────────────────────────────────────── */}
      <motion.section variants={item} className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-50 text-red-700">
            <TargetCrosshairIcon className="h-4.5 w-4.5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-[#1C3221] sm:text-2xl">กลุ่มสิวอักเสบ (Inflammatory)</h2>
            <p className="text-xs text-ink/55 sm:text-sm">มีเชื้อแบคทีเรียเข้ามาเจริญเติบโตจนเกิดการอักเสบ</p>
          </div>
        </div>
        <motion.div variants={container} className="space-y-5">
          {INFLAMMATORY.map((e) => (
            <AcneCard key={e.type} entry={e} />
          ))}
        </motion.div>
      </motion.section>

      {/* ── Footer note + CTA ────────────────────────────────────────── */}
      <motion.div variants={item} className="space-y-5 rounded-2xl border border-sand-300 bg-white p-6 text-center sm:p-8">
        <p className="mx-auto max-w-xl text-xs leading-relaxed text-ink/60 sm:text-sm">
          เนื้อหาข้างต้นมีไว้เพื่อให้ความรู้เบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์ หากต้องการประเมินผิวของคุณเอง
          สามารถเริ่มสแกนด้วย AI หรืออ่านรายละเอียดเพิ่มเติมเกี่ยวกับความปลอดภัยของระบบได้ที่หน้า
          <Link href="/about" className="font-semibold text-olive-700 underline-offset-2 hover:underline">
            เกี่ยวกับระบบ
          </Link>
        </p>
        <Link href="/scan">
          <motion.span
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-none bg-[#213C27] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-md transition-all hover:bg-[#142618] cursor-pointer"
          >
            <CameraScanIcon className="h-4 w-4 text-[#A7D9B0]" />
            <span>เริ่มสแกนผิว AI</span>
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
