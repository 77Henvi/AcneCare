"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Camera from "@/components/Camera";
import { checkImageQuality, QUALITY_REASON_TH } from "@/lib/quality-check";
import { activePredictor } from "@/lib/inference";
import { buildRecommendations } from "@/lib/recommendation/engine";
import { newScanId, saveScan } from "@/lib/storage/scans";

type Stage = "capture" | "checking" | "retake" | "analyzing" | "error";

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

      {stage !== "analyzing" && <Camera onCapture={handleCapture} />}

      {stage === "checking" && (
        <p className="text-sm text-ink/60">กำลังตรวจสอบคุณภาพภาพ…</p>
      )}

      {stage === "retake" && (
        <div className="rounded-card border border-caution-500/30 bg-caution-50 p-4 text-sm text-caution-500">
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
        </div>
      )}

      {stage === "analyzing" && (
        <div className="space-y-4">
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="ภาพที่ถ่าย" className="aspect-square w-full rounded-card object-cover" />
          )}
          <p className="text-center text-sm text-ink/60">กำลังวิเคราะห์ภาพด้วย AI…</p>
        </div>
      )}

      {stage === "error" && (
        <p className="text-sm text-caution-500">เกิดข้อผิดพลาดระหว่างการวิเคราะห์ กรุณาลองใหม่อีกครั้ง</p>
      )}
    </div>
  );
}
