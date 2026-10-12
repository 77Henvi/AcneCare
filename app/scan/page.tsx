"use client";

import { useState } from "react";
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
import { AlertTriangleIcon, CameraScanIcon, SparklesIcon } from "@/components/purelis/Icons";

type Stage = "capture" | "checking" | "retake" | "analyzing" | "skin-type" | "error";

const SKIN_TYPE_GUIDANCE: Record<SkinType, string> = {
  normal: "ไม่มันหรือแห้งตึงมากเป็นพิเศษ",
  oily: "ผิวมันวาวหรือมันทั่วใบหน้า",
  dry: "ผิวแห้ง ตึง หรือลอกเป็นขุย",
  combination: "มันบริเวณทีโซน แต่แก้มแห้งหรือปกติ",
};

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

  async function handleCapture(canvas: HTMLCanvasElement) {
    setPreviewUrl(canvas.toDataURL("image/jpeg", 0.85));
    setStage("checking");

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
    } catch {
      setStage("error");
    }
  }

  function handleSkinTypeSubmit() {
    if (!pendingResult || !selectedSkinType) return;

    const recommendations = buildRecommendations(pendingResult, selectedSkinType);
    const id = newScanId();
    saveScan({
      id,
      createdAt: new Date().toISOString(),
      modelVersion: pendingResult.modelVersion,
      skinType: selectedSkinType,
      result: pendingResult,
      recommendations,
    });
    router.push(`/result/${id}`);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12 space-y-6">
      <div className="text-center sm:text-left">
        <span className="font-display text-xs font-bold uppercase tracking-wider text-[#3D6345]">AI SKIN SCANNER</span>
        <h1 className="mt-1 font-display text-3xl font-bold text-[#1C3221]">สแกนผิวและตรวจจับสิว</h1>
        <p className="mt-1 text-xs sm:text-sm text-ink/70">
          หันหน้าตรง อยู่ในที่ที่มีแสงสว่างเพียงพอ ไม่สวมหน้ากากหรือใช้ฟิลเตอร์แต่งภาพ
        </p>
      </div>

      <AnimatePresence mode="wait">
        {stage !== "analyzing" && stage !== "skin-type" && (
          <motion.div key="camera" variants={fade} initial="hidden" animate="show" exit="exit">
            <Camera onCapture={handleCapture} />
          </motion.div>
        )}

        {stage === "checking" && (
          <motion.div key="checking" variants={fade} initial="hidden" animate="show" exit="exit" className="text-center py-8">
            <div className="inline-block h-9 w-9 animate-spin rounded-full border-3 border-[#213C27] border-t-transparent mb-3" />
            <p className="font-display text-sm font-bold text-[#213C27]">
              กำลังตรวจสอบคุณภาพภาพ (แสง, ความคมชัด, ระยะใบหน้า)…
            </p>
          </motion.div>
        )}

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

        {stage === "analyzing" && (
          <motion.div key="analyzing" variants={fade} initial="hidden" animate="show" exit="exit" className="space-y-5">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-[#233B27]/40 shadow-2xl">
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="ภาพที่ถ่าย" className="h-full w-full object-cover" />
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

        {stage === "error" && (
          <motion.div key="error" variants={fade} initial="hidden" animate="show" exit="exit" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            เกิดข้อผิดพลาดระหว่างการวิเคราะห์ กรุณาลองใหม่อีกครั้ง
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
