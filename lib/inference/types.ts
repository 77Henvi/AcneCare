import { AcneType } from "@/lib/taxonomy";

// พิกัดกล่องเป็นสัดส่วน 0..1 เทียบกับภาพต้นฉบับ (ไม่ขึ้นกับขนาดที่แสดงผล)
export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface AcneFinding {
  type: AcneType;
  confidence: number;
  box: BoundingBox;
}

export interface ImageQuality {
  score: number; // 0..1
  usable: boolean;
  reasons: string[]; // e.g. ["blurry", "low_light"] — empty if usable
}

export interface PredictionResult {
  modelVersion: string;
  imageQuality: ImageQuality;
  acne: AcneFinding[];
}

// Every real predictor (Teachable Machine export, later an object-detection
// model, etc.) must implement this. The rest of the app only ever talks to
// this interface — see design doc §2 ("pluggable inference module").
export interface Predictor {
  readonly modelVersion: string;
  predict(image: HTMLImageElement | HTMLCanvasElement): Promise<PredictionResult>;
}
