"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Camera from "@/components/Camera";
import ScanLineOverlay from "@/components/ScanLineOverlay";
import { checkImageQuality, QUALITY_REASON_TH } from "@/lib/quality-check";
import { activePredictor } from "@/lib/inference";
import { buildRecommendations } from "@/lib/recommendation/engine";
import { newScanId, saveScan } from "@/lib/storage/scans";

type Stage = "capture" | "checking" | "retake" | "analyzing" | "error";

const fade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function ScanPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("capture");
  const [qualityReasons, setQualityReasons] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

      const recommendations = buildRecommendations(result);
      const id = newScanId();
      saveScan({
        id,
        createdAt: new Date().toISOString(),
        modelVersion: result.modelVersion,
        result,
        recommendations,
      });
      router.push(`/result/${id}`);
    } catch {
      setStage("error");
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-12 space-y-6">
      <div className="text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-[#3D6345]">AI SKIN SCANNER</span>
        <h1 className="mt-1 font-serif text-3xl font-bold text-[#1C3221]">สแกนผิวและตรวจจับสิว</h1>
        <p className="mt-1 text-xs sm:text-sm text-ink/70">
          หันหน้าตรง อยู่ในที่ที่มีแสงสว่างเพียงพอ ไม่สวมหน้ากากหรือใช้ฟิลเตอร์แต่งภาพ
        </p>
      </div>

      <AnimatePresence mode="wait">
        {stage !== "analyzing" && (
          <motion.div key="camera" variants={fade} initial="hidden" animate="show" exit="exit">
            <Camera onCapture={handleCapture} />
          </motion.div>
        )}

        {stage === "checking" && (
          <motion.div key="checking" variants={fade} initial="hidden" animate="show" exit="exit" className="text-center py-6">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-[#233B27] border-t-transparent mb-2" />
            <p className="text-sm font-medium text-[#233B27]">
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
            className="rounded-xl border border-red-200 bg-red-50/80 p-5 text-sm text-red-800 space-y-3"
          >
            <p className="font-bold flex items-center gap-2">
              <span>⚠️</span> ไม่สามารถวิเคราะห์ได้อย่างแม่นยำ กรุณาถ่ายภาพใหม่
            </p>
            <ul className="list-disc pl-5 text-xs space-y-1 text-red-700">
              {qualityReasons.map((r) => (
                <li key={r}>{QUALITY_REASON_TH[r] ?? r}</li>
              ))}
            </ul>
            <button
              onClick={() => setStage("capture")}
              className="rounded bg-red-700 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-800"
            >
              ถ่ายภาพใหม่อีกครั้ง
            </button>
          </motion.div>
        )}

        {stage === "analyzing" && (
          <motion.div key="analyzing" variants={fade} initial="hidden" animate="show" exit="exit" className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-[#233B27]/30 shadow-lg">
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="ภาพที่ถ่าย" className="h-full w-full object-cover" />
              )}
              <ScanLineOverlay />
            </div>
            <div className="text-center py-2 space-y-1">
              <motion.p
                className="font-serif text-lg font-bold text-[#1F3924]"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                กำลังวิเคราะห์สภาพผิวและจำแนกชนิดสิวด้วย AI…
              </motion.p>
              <p className="text-xs text-ink/60">กำลังจับคู่ตัวยาและแนวทางการดูแลผิวที่ปลอดภัย</p>
            </div>
          </motion.div>
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
