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
      // overwrite the mock's own quality score with the real client-side check
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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-teal-900">สแกนผิว</h1>
        <p className="mt-1 text-sm text-ink/65">
          หันหน้าตรง อยู่ในที่มีแสงเพียงพอ ไม่ใส่หน้ากากหรือฟิลเตอร์
        </p>
      </div>

      <AnimatePresence mode="wait">
        {stage !== "analyzing" && (
          <motion.div key="camera" variants={fade} initial="hidden" animate="show" exit="exit">
            <Camera onCapture={handleCapture} />
          </motion.div>
        )}

        {stage === "checking" && (
          <motion.p key="checking" variants={fade} initial="hidden" animate="show" exit="exit" className="text-sm text-ink/60">
            กำลังตรวจสอบคุณภาพภาพ…
          </motion.p>
        )}

        {stage === "retake" && (
          <motion.div
            key="retake"
            variants={fade}
            initial="hidden"
            animate="show"
            exit="exit"
            className="rounded-card border border-caution-500/30 bg-caution-50 p-4 text-sm text-caution-500"
          >
            <p className="font-medium">ไม่สามารถวิเคราะห์ได้อย่างแม่นยำ กรุณาถ่ายภาพใหม่</p>
            <ul className="mt-2 list-disc pl-5">
              {qualityReasons.map((r) => (
                <li key={r}>{QUALITY_REASON_TH[r] ?? r}</li>
              ))}
            </ul>
            <button
              onClick={() => setStage("capture")}
              className="mt-3 rounded-card bg-caution-500 px-3 py-1.5 text-xs font-medium text-white"
            >
              ลองใหม่
            </button>
          </motion.div>
        )}

        {stage === "analyzing" && (
          <motion.div key="analyzing" variants={fade} initial="hidden" animate="show" exit="exit" className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-card">
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="ภาพที่ถ่าย" className="h-full w-full object-cover" />
              )}
              <ScanLineOverlay />
            </div>
            <motion.p
              className="text-center text-sm text-ink/60"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              กำลังวิเคราะห์ภาพด้วย AI…
            </motion.p>
          </motion.div>
        )}

        {stage === "error" && (
          <motion.p key="error" variants={fade} initial="hidden" animate="show" exit="exit" className="text-sm text-caution-500">
            เกิดข้อผิดพลาดระหว่างการวิเคราะห์ กรุณาลองใหม่อีกครั้ง
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
