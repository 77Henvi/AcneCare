import { ACNE_TYPES, FACE_REGIONS, SKIN_TYPES } from "@/lib/taxonomy";
import { PredictionResult, Predictor } from "./types";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomConfidence(min = 0.55, max = 0.97): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

/**
 * Stand-in predictor so the web app is fully clickable end-to-end while the
 * real Teachable Machine model is still being trained on the dataset your
 * friends are labeling.
 *
 * To swap in the real model once it's ready, implement `Predictor` in a new
 * file (e.g. teachableMachinePredictor.ts) that loads the exported TF.js
 * model and runs `model.predict()`, then change the single line in
 * `lib/inference/index.ts` that constructs the active predictor. Nothing
 * else in the app needs to change.
 */
export class MockPredictor implements Predictor {
  readonly modelVersion = "mock-v0";

  async predict(_image: HTMLImageElement | HTMLCanvasElement): Promise<PredictionResult> {
    // simulate network/inference latency so loading states can be tested
    await new Promise((r) => setTimeout(r, 900));

    const findingCount = Math.random() < 0.3 ? 0 : 1 + Math.floor(Math.random() * 2);
    const nonEmptyAcneTypes = ACNE_TYPES.filter((t) => t !== "no_visible_acne");

    const acne =
      findingCount === 0
        ? []
        : Array.from({ length: findingCount }).map(() => ({
            type: pick(nonEmptyAcneTypes),
            confidence: randomConfidence(),
            region: pick(FACE_REGIONS),
          }));

    return {
      modelVersion: this.modelVersion,
      imageQuality: { score: randomConfidence(0.7, 0.98), usable: true, reasons: [] },
      skinType: { label: pick(SKIN_TYPES), confidence: randomConfidence() },
      acne,
    };
  }
}
