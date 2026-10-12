import { PredictionResult } from "@/lib/inference/types";
import { SkinType } from "@/lib/taxonomy";
import { getAcneRecommendations, getSkinTypeRecommendations, Recommendation } from "./rules";

export function buildRecommendations(result: PredictionResult, skinType: SkinType): Recommendation[] {
  return [
    ...getSkinTypeRecommendations(skinType),
    ...getAcneRecommendations(result.acne),
  ];
}

export { DISCLAIMER_TH } from "./rules";
export type { Recommendation } from "./rules";
