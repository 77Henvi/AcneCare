import { AcneType, FaceRegion } from "@/lib/taxonomy";

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

export type FaceOrientation =
  | {
      detected: true;
      direction: "front" | "left" | "right";
      yawDegrees: number;
      pitchDegrees: number;
      rollDegrees: number;
    }
  | {
      detected: false;
      direction: "not_detected";
      yawDegrees: null;
      pitchDegrees: null;
      rollDegrees: null;
    };

export interface PredictionResult {
  modelVersion: string;
  imageQuality: ImageQuality;
  faceOrientation?: FaceOrientation;
  acne: AcneFinding[];
}

// Every real predictor (Teachable Machine export, later an object-detection
// model, etc.) must implement this. The rest of the app only ever talks to
// this interface — see design doc §2 ("pluggable inference module").
export interface Predictor {
  readonly modelVersion: string;
  predict(image: HTMLImageElement | HTMLCanvasElement): Promise<PredictionResult>;
}
