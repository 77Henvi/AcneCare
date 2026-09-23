import { MockPredictor } from "./mockPredictor";
import { Predictor } from "./types";

export * from "./types";

// ── Swap point ──────────────────────────────────────────────────────────
// This is the ONE line to change when the real trained model is ready.
// e.g.:
//   import { TeachableMachinePredictor } from "./teachableMachinePredictor";
//   export const activePredictor: Predictor = new TeachableMachinePredictor({
//     skinTypeModelUrl: process.env.NEXT_PUBLIC_TFJS_MODEL_URL_SKIN_TYPE!,
//     acneModelUrl: process.env.NEXT_PUBLIC_TFJS_MODEL_URL_ACNE!,
//   });
export const activePredictor: Predictor = new MockPredictor();
