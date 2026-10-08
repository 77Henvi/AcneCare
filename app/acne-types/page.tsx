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
      "ตุ่มสีขาวหรือสีเนื้อใต้ผิวหนัง ไม่มีหัว เกิดจากการอุดตันของขุมขนแบบ \"หัวปิด\" สาเหตุส่วนใหญ่เกี่ยวข้องกับการเปลี่ยนแปลงของฮอร์โมนและเครื่องสำอางตกค้าง หากปล่อยไว้โดยไม่ดูแลอย่างถูกวิธี มีโอกาสกลายเป็นสิวอักเสบได้",
    signs: [
      "ตุ่มนูนเล็ก สีขาวหรือสีเนื้อ ไม่มีหัว",
      "ไม่แดง กดแล้วไม่รู้สึกเจ็บ",
      "บีบออกยากเพราะรากสิวค่อนข้างลึก",
    ]
  },
  {
    type: "blackhead",
    visual: "blackhead",
    en: "Open Comedone",
    description:
      "ตุ่มสีดำเล็ก ๆ เกิดจากน้ำมันในผิวทำปฏิกิริยากับออกซิเจนในอากาศ ท่อไขมันขยายตัวและมีเคราติน เมลานิน และไขมันที่ถูกออกซิไดซ์อุดแน่นอยู่จึงเห็นเป็นสีดำ มีโอกาสพัฒนาเป็นสิวอักเสบได้สูง",
    signs: [
      "ตุ่มนูนมีจุดสีดำอยู่ตรงกลาง",
      "ท่อไขมันขยายตัว",
      "ไม่ควรบีบเอง การกดสิวควรทำโดยผู้เชี่ยวชาญด้วยอุปกรณ์ที่ผ่านการฆ่าเชื้อ",
    ]
  },
];


const INFLAMMATORY: AcneEntry[] = [
  {
    type: "papule",
    visual: "papule",
    en: "Papule",
    description:
      "สิวอักเสบลักษณะเป็นตุ่มเล็ก ๆ สีแดง เจ็บเมื่อสัมผัส หากแกะเกาอาจพัฒนาเป็นสิวตุ่มขนาดใหญ่หรือสิวตุ่มหนองได้ เบื้องต้นควรเลือกผลิตภัณฑ์ล้างหน้าสูตรอ่อนโยนและงดการสครับหน้า",
    signs: ["ตุ่มเล็กสีแดง", "เจ็บเมื่อกดหรือสัมผัส", "แกะเกาอาจกลายเป็นตุ่มใหญ่หรือตุ่มหนอง"],
  },
  {
    type: "pustule",
    visual: "pustule",
    en: "Pustule",
    description:
      "สิวตุ่มแดงที่มีหัวหนองอยู่บริเวณกลางตุ่ม เป็นสิวอักเสบที่เกิดจากการติดเชื้อแบคทีเรียแทรกซ้อน ควรทำความสะอาดหน้าอย่างถูกวิธี งดการขัดผิว และสามารถใช้ยาแต้มสิวเพื่อลดการอักเสบได้ (ปรึกษาเภสัชกร)",
    signs: [
      "ตุ่มแดงมีหัวหนองอยู่ตรงกลาง",
      "ไม่ควรบีบเอง เพราะแบคทีเรียอาจซึมลึก ทำให้อักเสบรุนแรง ติดเชื้อ และเกิดรอยแผลลึกที่รักษาได้ยาก",
    ]
  },
  {
    type: "nodule",
    visual: "nodule",
    en: "Nodule",
    description:
      "สิวอักเสบแบบก้อนลึก ขนาดใหญ่ แข็ง อาจรวมตัวกันเป็นแพ เกิดจากการติดเชื้อแบคทีเรีย หายช้าและมักทิ้งแผลเป็น ปวดและทรมานมาก ควรพบแพทย์ผิวหนัง ไม่สามารถรักษาได้ด้วยยาด้วยตนเอง",
    signs: [
      "ก้อนแดงลึกใต้ผิว ขนาดใหญ่ แข็ง",
      "อาจรวมตัวกันเป็นแพ",
      "ปวดมาก",
      "มักทิ้งแผลเป็นก้อนนูนหรือหลุมสิวขนาดใหญ่",
    ]
  },
  {
    type: "cyst",
    visual: "nodule",
    en: "Cyst",
    description:
      "สิวอักเสบประเภทที่รุนแรงที่สุด เป็นถุงน้ำใต้ผิวหนังที่เต็มไปด้วยหนองปนเลือด ขนาดใหญ่หลายเซนติเมตร ปวดและทรมานมาก หากปล่อยไว้อาจกลายเป็นฝีหนองและทิ้งรอยสิวหรือหลุมสิวขนาดใหญ่ ควรรับการรักษาจากแพทย์เท่านั้น",
    signs: [
      "ถุงน้ำใต้ผิวหนังเต็มไปด้วยหนองปนเลือด",
      "ขนาดใหญ่หลายเซนติเมตร",
      "ปวดมาก",
      "อาจกลายเป็นฝีหนอง",
    ]
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
              เพราะมักทิ้งรอยสิวและหลุมสิว และอาจกลายเป็นฝีหนอง
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
          ACNE TYPES &amp; CLASSIFICATION
        </span>
        <h1 className="font-display text-3xl font-bold leading-[1.3] text-[#1C3221] sm:text-4xl">
          ชนิดของสิว 6 ชนิด
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-ink/70 sm:mx-0 sm:text-base">
          สิวแบ่งออกเป็น 2 ประเภทหลัก คือ สิวอุดตัน (หัวขาว หัวดำ) และสิวอักเสบ (ตุ่มแดง ตุ่มหนอง หัวช้าง ซีสต์)
          สิวอุดตันที่มีเชื้อแบคทีเรียเข้ามาสามารถพัฒนาเป็นสิวอักเสบได้
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
            <p className="text-xs text-ink/55 sm:text-sm">เกิดจากการอุดตันของต่อมไขมัน ไม่แดง กดแล้วไม่เจ็บ แต่อาจพัฒนาเป็นสิวอักเสบได้หากมีเชื้อแบคทีเรียเข้ามา</p>
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
            <p className="text-xs text-ink/55 sm:text-sm">สิวอุดตันที่มีเชื้อแบคทีเรีย C. acnes เข้ามาเจริญเติบโตและกระตุ้นให้เกิดการอักเสบ อาจทิ้งแผลเป็นได้</p>
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
        </p>
        <Link href="/scan" className="mt-5 inline-block">
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
