import { OnnxPredictor } from "./onnxPredictor";
import { Predictor } from "./types";

export * from "./types";

export const activePredictor: Predictor = new OnnxPredictor();