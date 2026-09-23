import { AcneType, FaceRegion, SkinType } from "@/lib/taxonomy";

export interface SkinTypePrediction {
  label: SkinType;
  confidence: number;
}

export interface AcneFinding {
  type: AcneType;
  confidence: number;
  region: FaceRegion;
}

export interface ImageQuality {
  score: number; // 0..1
  usable: boolean;
  reasons: string[]; // e.g. ["blurry", "low_light"] — empty if usable
}

export interface PredictionResult {
  modelVersion: string;
  imageQuality: ImageQuality;
  skinType: SkinTypePrediction;
  acne: AcneFinding[];
}

// Every real predictor (Teachable Machine export, later an object-detection
// model, etc.) must implement this. The rest of the app only ever talks to
// this interface — see design doc §2 ("pluggable inference module").
export interface Predictor {
  readonly modelVersion: string;
  predict(image: HTMLImageElement | HTMLCanvasElement): Promise<PredictionResult>;
}
