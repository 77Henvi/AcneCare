"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Camera from "@/components/Camera";
import ScanLineOverlay from "@/components/ScanLineOverlay";
import { checkImageQuality, QUALITY_REASON_TH } from "@/lib/quality-check";
import { PredictionResult } from "@/lib/inference/types";
import { activePredictor } from "@/lib/inference";
import { buildRecommendations } from "@/lib/recommendation/engine";
import { newScanId, saveScan } from "@/lib/storage/scans";
import { SKIN_TYPE_LABEL_TH, SKIN_TYPES, SkinType } from "@/lib/taxonomy";
import { AlertTriangleIcon } from "@/components/purelis/Icons";

type Stage = "capture" | "retake" | "analyzing" | "skin-type" | "error";

const SKIN_TYPE_GUIDANCE: Record<SkinType, string> = {
  normal: "ไม่มันหรือแห้งตึงมากเป็นพิเศษ",
  oily: "ผิวมันวาวหรือมันทั่วใบหน้า",
  dry: "ผิวแห้ง ตึง หรือลอกเป็นขุย",
  combination: "มันบริเวณทีโซน แต่แก้มแห้งหรือปกติ",
};

// คำแนะนำตามบริเวณ แสดงเป็นข้อมูลเท่านั้น ไม่ต้องกดเลือกก่อนถ่าย/อัปโหลด
const AREA_TIPS = [
  { label: "แก้ม", hint: "ถ่ายทีละซีก เห็นแก้มเต็มกรอบ" },
  { label: "หน้าผาก", hint: "เปิดผมออก ให้เห็นแนวไรผม" },
  { label: "จมูก", hint: "ถ่ายใกล้ ให้เห็นปีกจมูกทั้งสองข้าง" },
  { label: "คาง", hint: "เห็นคางและรอบปากชัดเจน" },
];

const PHOTO_TIPS = [
  "ถ่ายทีละบริเวณ ใกล้ ๆ ให้ผิวเต็มกรอบ และถือกล้องตรง ไม่เอียง",
  "ใช้แสงสว่างพอ ไม่มีเงาบัง และปิดฟิลเตอร์ความงาม",
  "เอาผม มือ หรือแว่นออกจากบริเวณที่ถ่าย",
];

// ย่อภาพก่อนเก็บลง localStorage (ใช้วาดกรอบตอนแสดงผล) เพื่อไม่ให้โควตาเต็มเร็ว
const THUMBNAIL_MAX_SIDE = 800;

function makeThumbnail(canvas: HTMLCanvasElement): string {
  const scale = Math.min(1, THUMBNAIL_MAX_SIDE / Math.max(canvas.width, canvas.height));
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(canvas.width * scale));
  out.height = Math.max(1, Math.round(canvas.height * scale));
  out.getContext("2d")?.drawImage(canvas, 0, 0, out.width, out.height);
  return out.toDataURL("image/jpeg", 0.75);
}

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

export default function ScanPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("capture");
  const [qualityReasons, setQualityReasons] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingResult, setPendingResult] = useState<PredictionResult | null>(null);
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType | null>(null);
  const [inferenceError, setInferenceError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  // กดถ่าย/อัปโหลดซ้ำระหว่างที่ยังวิเคราะห์ภาพก่อนหน้าไม่เสร็จ (Camera ยังค้างอยู่ช่วง animation)
  // จะทำให้ผลของภาพหนึ่งไปจับคู่กับภาพย่อของอีกภาพ
  const busyRef = useRef(false);

  // เริ่มโหลดโมเดลทันทีที่เปิดหน้า เพื่อไม่ให้การสแกนครั้งแรกต้องรอ
  useEffect(() => {
    activePredictor.preload();
  }, []);

  async function handleCapture(canvas: HTMLCanvasElement) {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      await analyzeCapture(canvas);
    } finally {
      busyRef.current = false;
    }
  }

  async function analyzeCapture(canvas: HTMLCanvasElement) {
    setPreviewUrl(makeThumbnail(canvas));
    setInferenceError(null);
    setSaveError(null);
    setPendingResult(null);
    setSelectedSkinType(null);

    const quality = checkImageQuality(canvas);

    if (!quality.usable) {
      setQualityReasons(quality.reasons);
      setStage("retake");
      return;
    }

    setStage("analyzing");
    try {
      const result = await activePredictor.predict(canvas);
      result.imageQuality = quality;
      setPendingResult(result);
      setStage("skin-type");
    } catch (error) {
      console.error("ONNX inference failed:", error);
      setInferenceError(error instanceof Error ? error.message : String(error));
      setStage("error");
    }
  }

  function handleSkinTypeSubmit() {
    if (!pendingResult || !selectedSkinType) return;

    const recommendations = buildRecommendations(pendingResult, selectedSkinType);
    const id = newScanId();
    try {
      saveScan({
        id,
        createdAt: new Date().toISOString(),
        modelVersion: pendingResult.modelVersion,
        skinType: selectedSkinType,
        image: previewUrl ?? undefined,
        result: pendingResult,
        recommendations,
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : String(error));
      return;
    }
    router.push(`/result/${id}`);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12 space-y-6">
      <div className="text-center sm:text-left">
        <span className="font-display text-xs font-bold uppercase tracking-wider text-[#3D6345]">AI SKIN SCANNER</span>
        <h1 className="mt-1 font-display text-3xl font-bold text-[#1C3221]">สแกนผิวและตรวจจับสิว</h1>
        <p className="mt-1 text-xs sm:text-sm text-ink/70">
          ถ่ายหรืออัปโหลดภาพผิวที่ต้องการตรวจ เพื่อให้ระบบ AI วิเคราะห์สิวได้แม่นยำ
        </p>
      </div>

      {/* คำแนะนำการถ่ายภาพ (แบบสั้น) */}
      {stage === "capture" && (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          className="rounded-2xl border border-[#DFD7CB] bg-[#F7F4EE] p-4 shadow-xs space-y-2"
        >
          <h2 className="font-display text-sm font-bold text-[#1B3120]">ถ่ายภาพให้ได้ผลดี</h2>
          <ul className="list-disc space-y-1 pl-5 text-xs leading-relaxed text-[#3E5544]">
            {PHOTO_TIPS.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <dl className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4">
            {AREA_TIPS.map((area) => (
              <div key={area.label} className="rounded-lg bg-white/70 px-2.5 py-2">
                <dt className="font-display text-xs font-bold text-[#1C3221]">{area.label}</dt>
                <dd className="mt-0.5 text-[11px] leading-snug text-ink/60">{area.hint}</dd>
              </div>
            ))}
          </dl>
          <p className="text-[11px] text-[#364F3C]">
            เป็นการคัดกรองเบื้องต้นด้วย AI ไม่ใช่การวินิจฉัยทางการแพทย์
          </p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {stage !== "analyzing" && stage !== "skin-type" && (
          <motion.div key="camera" variants={fade} initial="hidden" animate="show" exit="exit" className="space-y-4">
            <Camera onCapture={handleCapture} />
            {/* ข้อความของ stage ที่ยังแสดงกล้อง อยู่ใน child เดียวกับกล้อง เพราะ AnimatePresence mode="wait" แสดงได้ทีละ child */}
            {stage === "retake" && (
              <motion.div
                key="retake"
                variants={fade}
                initial="hidden"
                animate="show"
                exit="exit"
                className="rounded-2xl border border-red-200 bg-red-50/85 p-6 text-sm text-red-800 space-y-3.5 shadow-sm"
              >
                <div className="font-display font-bold flex items-center gap-2 text-base text-red-900">
                  <AlertTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span>ไม่สามารถวิเคราะห์ได้อย่างแม่นยำ กรุณาถ่ายภาพใหม่</span>
                </div>
                <ul className="list-disc pl-5 text-xs space-y-1 text-red-700">
                  {qualityReasons.map((r) => (
                    <li key={r}>{QUALITY_REASON_TH[r] ?? r}</li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStage("capture")}
                  className="rounded-none bg-red-700 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-800 shadow"
                >
                  ถ่ายภาพใหม่อีกครั้ง
                </motion.button>
              </motion.div>
            )}

            {stage === "error" && (
              <motion.div key="error" variants={fade} initial="hidden" animate="show" exit="exit" className="space-y-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                <p className="font-bold">เกิดข้อผิดพลาดระหว่างการวิเคราะห์</p>
                <p>รายละเอียด: {inferenceError ?? "ไม่พบรายละเอียดข้อผิดพลาด"}</p>
                <button
                  type="button"
                  onClick={() => setStage("capture")}
                  className="rounded bg-red-700 px-4 py-2 text-xs font-bold text-white hover:bg-red-800"
                >
                  ลองใหม่
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {stage === "analyzing" && (
          <motion.div key="analyzing" variants={fade} initial="hidden" animate="show" exit="exit" className="space-y-5">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-[#233B27]/40 shadow-2xl">
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="ภาพที่ถ่าย" className="h-full w-full object-contain" />
              )}
              <ScanLineOverlay />
            </div>
            <div className="text-center py-2 space-y-1.5">
              <motion.p
                className="font-display text-lg font-bold text-[#1F3924]"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                กำลังตรวจจับลักษณะสิวด้วย AI…
              </motion.p>
              <p className="text-xs text-ink/60">เมื่อสแกนเสร็จ คุณจะเลือกประเภทผิวด้วยตนเอง</p>
            </div>
          </motion.div>
        )}

        {stage === "skin-type" && (
          <motion.section
            key="skin-type"
            variants={fade}
            initial="hidden"
            animate="show"
            exit="exit"
            className="space-y-5 border-t border-sand-300 pt-6"
          >
            <div>
              <h2 className="font-display text-xl font-bold text-[#1C3221]">เลือกประเภทผิวของคุณ</h2>
              <p className="mt-1 text-sm text-ink/65">ผลตรวจสิวพร้อมแล้ว โปรดเลือกตามลักษณะผิวที่พบเป็นประจำ</p>
            </div>
            <fieldset className="grid gap-3 sm:grid-cols-2">
              <legend className="sr-only">ประเภทผิว</legend>
              {SKIN_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={selectedSkinType === type}
                  onClick={() => setSelectedSkinType(type)}
                  className={`min-h-20 border p-4 text-left transition-colors ${selectedSkinType === type
                      ? "border-[#233B27] bg-[#EAF2EC] ring-1 ring-[#233B27]"
                      : "border-sand-300 bg-white hover:border-[#567A5B]"
                    }`}
                >
                  <span className="block font-display text-base font-bold text-[#1C3221]">
                    {SKIN_TYPE_LABEL_TH[type]}
                  </span>
                  <span className="mt-1 block text-xs text-ink/60">{SKIN_TYPE_GUIDANCE[type]}</span>
                </button>
              ))}
            </fieldset>
            {saveError && <p className="text-sm text-red-700">{saveError}</p>}
            <motion.button
              whileHover={{ scale: selectedSkinType ? 1.02 : 1 }}
              whileTap={{ scale: selectedSkinType ? 0.98 : 1 }}
              type="button"
              disabled={!selectedSkinType}
              onClick={handleSkinTypeSubmit}
              className="w-full bg-[#213C27] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#142618] disabled:cursor-not-allowed disabled:bg-ink/30"
            >
              ดูผลการสแกน
            </motion.button>
          </motion.section>
        )}

      </AnimatePresence>
    </div>
  );
}
