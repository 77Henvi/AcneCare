import { ImageQuality } from "@/lib/inference/types";

/**
 * Lightweight heuristic quality gate that runs entirely in the browser
 * before an image is sent to the acne/skin-type models (design doc §21).
 * This is intentionally simple (brightness + a crude blur proxy via edge
 * variance) — good enough to reject obviously bad photos and cheap to run
 * on every frame. It is NOT a replacement for a trained quality model; swap
 * this out later if false accepts/rejects become a problem.
 */
export function checkImageQuality(canvas: HTMLCanvasElement): ImageQuality {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { score: 0, usable: false, reasons: ["read_error"] };
  }

  const { width, height } = canvas;
  const { data } = ctx.getImageData(0, 0, width, height);

  let sum = 0;
  let edgeSum = 0;
  const step = 4 * 4; // sample every 4th pixel for speed
  let samples = 0;

  for (let i = 0; i < data.length; i += step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    sum += luma;

    // เทียบความสว่างกับพิกเซลที่สุ่มถัดไป (เดิมเอาค่าสีแดงมาเทียบกับ luma ทำให้ผิวที่อมแดงดูคมเสมอ)
    if (i + step + 2 < data.length) {
      const nextLuma = 0.299 * data[i + step] + 0.587 * data[i + step + 1] + 0.114 * data[i + step + 2];
      edgeSum += Math.abs(nextLuma - luma);
    }
    samples++;
  }

  const brightness = sum / samples / 255; // 0..1
  const edgeVariance = edgeSum / samples; // proxy for sharpness

  const reasons: string[] = [];
  if (brightness < 0.2) reasons.push("low_light");
  if (brightness > 0.9) reasons.push("overexposed");
  // ทดสอบกับภาพสิว 1280px: ภาพคมได้ราว 8-10 ภาพเบลอ (Gaussian blur 8px) ได้ราว 2.4
  // ชุด images test v0.3: ภาพที่ใช้ได้ส่วนใหญ่ >= 4 แต่ภาพผิวเรียบบางรูปได้ 3.3-4.0 จึงตั้งที่ 3
  if (edgeVariance < 3) reasons.push("blurry");
  if (width < 480 || height < 480) reasons.push("resolution_too_low");

  const brightnessScore = 1 - Math.abs(brightness - 0.5) * 2;
  const sharpnessScore = Math.min(edgeVariance / 10, 1);
  const score = Math.max(0, Math.min(1, brightnessScore * 0.5 + sharpnessScore * 0.5));

  return { score: Math.round(score * 100) / 100, usable: reasons.length === 0, reasons };
}

export const QUALITY_REASON_TH: Record<string, string> = {
  low_light: "แสงน้อยเกินไป",
  overexposed: "แสงจ้าเกินไป",
  blurry: "ภาพเบลอ",
  resolution_too_low: "ความละเอียดภาพต่ำเกินไป",
  read_error: "ไม่สามารถอ่านภาพได้",
};
