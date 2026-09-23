import { PredictionResult } from "@/lib/inference/types";
import { getAcneRecommendations, getSkinTypeRecommendations, Recommendation } from "./rules";

export function buildRecommendations(result: PredictionResult): Recommendation[] {
  return [
    ...getSkinTypeRecommendations(result.skinType),
    ...getAcneRecommendations(result.acne),
  ];
}

export { DISCLAIMER_TH } from "./rules";
export type { Recommendation } from "./rules";
