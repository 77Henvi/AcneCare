import type { InferenceSession } from "onnxruntime-web";
import type { AcneType } from "@/lib/taxonomy";
import type { AcneFinding, PredictionResult, Predictor } from "./types";
import { toAcneType, toRegion } from "./utils";

// ลำดับต้องตรงกับ model.names ตอนเทรน
const CLASS_NAMES = ["Blackheads", "Cysts", "Nodules", "Papules", "Pustules", "Whiteheads"];
const NUM_CLASSES = CLASS_NAMES.length;
const SIZE = 640;
const IOU_THRESHOLD = 0.45;

const MIN_CONFIDENCE: Record<AcneType, number> = {
    no_visible_acne: 1,
    whitehead: 0.25,
    blackhead: 0.25,
    papule: 0.25,
    pustule: 0.25,
    nodule: 0.15,
    cyst: 0.15,
};

interface Box {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    score: number;
    type: AcneType;
}

function iou(a: Box, b: Box): number {
    const ix = Math.max(0, Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1));
    const iy = Math.max(0, Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1));
    const inter = ix * iy;
    const union = (a.x2 - a.x1) * (a.y2 - a.y1) + (b.x2 - b.x1) * (b.y2 - b.y1) - inter;
    return union <= 0 ? 0 : inter / union;
}

// NMS แยกตามชนิดสิว
function nms(boxes: Box[]): Box[] {
    const sorted = [...boxes].sort((a, b) => b.score - a.score);
    const kept: Box[] = [];
    for (const box of sorted) {
        if (!kept.some((k) => k.type === box.type && iou(k, box) > IOU_THRESHOLD)) {
            kept.push(box);
        }
    }
    return kept;
}

// Helper ป้องกันปัญหา Dynamic Import ในบาง Bundler
async function getOrt() {
    const ortModule = await import("onnxruntime-web");
    return ortModule.default || ortModule;
}

export class OnnxPredictor implements Predictor {
    readonly modelVersion = "acne-onnx-v0.1";
    private modelUrl: string;
    private sessionPromise: Promise<InferenceSession> | null = null;

    constructor(modelUrl = "/models/acne-v0.1.onnx") {
        this.modelUrl = modelUrl;
    }

    private getSession(): Promise<InferenceSession> {
        if (!this.sessionPromise) {
            this.sessionPromise = (async () => {
                const ort = await getOrt();
                ort.env.wasm.wasmPaths = "/ort/";
                return ort.InferenceSession.create(this.modelUrl);
            })();
        }
        return this.sessionPromise;
    }

    async predict(image: HTMLImageElement | HTMLCanvasElement): Promise<PredictionResult> {
        if (!image) throw new Error("ไม่มีข้อมูลภาพส่งเข้ามา");

        const srcW = image instanceof HTMLImageElement ? image.naturalWidth : image.width;
        const srcH = image instanceof HTMLImageElement ? image.naturalHeight : image.height;

        if (srcW === 0 || srcH === 0) {
            throw new Error("ขนาดภาพเป็น 0 (กล้องอาจจะยังไม่เปิด หรือรูปยังโหลดไม่เสร็จ)");
        }

        const ort = await getOrt();
        const session = await this.getSession();

        const scale = Math.min(SIZE / srcW, SIZE / srcH);
        const newW = Math.round(srcW * scale);
        const newH = Math.round(srcH * scale);
        const padX = Math.floor((SIZE - newW) / 2);
        const padY = Math.floor((SIZE - newH) / 2);

        const canvas = document.createElement("canvas");
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "rgb(114,114,114)";
        ctx.fillRect(0, 0, SIZE, SIZE);
        ctx.drawImage(image, padX, padY, newW, newH);
        const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

        const plane = SIZE * SIZE;
        const input = new Float32Array(3 * plane);
        for (let i = 0; i < plane; i++) {
            input[i] = data[i * 4] / 255;
            input[plane + i] = data[i * 4 + 1] / 255;
            input[2 * plane + i] = data[i * 4 + 2] / 255;
        }

        const outputs = await session.run({
            [session.inputNames[0]]: new ort.Tensor("float32", input, [1, 3, SIZE, SIZE]),
        });
        
        const outputTensor = outputs[session.outputNames[0]];
        const out = outputTensor.data as Float32Array;
        const dims = outputTensor.dims;

        console.log("Model Output Dims:", dims);

        const candidates: Box[] = [];

        if (dims.length === 3 && dims[2] === 6) {
            // กรณี 1: End-to-End
            const numDetections = dims[1]; 
            for (let i = 0; i < numDetections; i++) {
                const o = i * 6;
                const score = out[o + 4];
                const cls = Math.round(out[o + 5]);
                
                // ดักจับคะแนนต่ำและ Class ผิดพลาด
                if (score < 0.1 || cls < 0 || cls >= NUM_CLASSES) continue;

                const type = toAcneType(CLASS_NAMES[cls]);
                if (!type || type === "no_visible_acne" || score < MIN_CONFIDENCE[type]) continue;

                candidates.push({ x1: out[o], y1: out[o + 1], x2: out[o + 2], y2: out[o + 3], score, type });
            }
        } else if (dims.length === 3 && dims[1] === NUM_CLASSES + 4) {
            // กรณี 2: Standard YOLO แบบเก่า -> Shape: [1, 10, 8400]
            const numBoxes = dims[2];
            for (let i = 0; i < numBoxes; i++) {
                let maxScore = 0;
                let maxClass = -1;
                for (let c = 0; c < NUM_CLASSES; c++) {
                    const score = out[(4 + c) * numBoxes + i];
                    if (score > maxScore) { maxScore = score; maxClass = c; }
                }

                // --- บรรทัดสำคัญที่แก้ปัญหา Crash ---
                if (maxClass === -1 || maxScore < 0.1) continue;

                const type = toAcneType(CLASS_NAMES[maxClass]);
                if (!type || type === "no_visible_acne" || maxScore < MIN_CONFIDENCE[type]) continue;

                const cx = out[0 * numBoxes + i];
                const cy = out[1 * numBoxes + i];
                const w = out[2 * numBoxes + i];
                const h = out[3 * numBoxes + i];

                candidates.push({ x1: cx - w / 2, y1: cy - h / 2, x2: cx + w / 2, y2: cy + h / 2, score: maxScore, type });
            }
        } else if (dims.length === 3 && dims[2] === NUM_CLASSES + 4) {
            // กรณี 3: Standard YOLO แบบใหม่ (Ultralytics >= 8.1)
            const numBoxes = dims[1]; 
            const rowSize = dims[2];  
            
            for (let i = 0; i < numBoxes; i++) {
                let maxScore = 0;
                let maxClass = -1;
                const offset = i * rowSize;

                for (let c = 0; c < NUM_CLASSES; c++) {
                    const score = out[offset + 4 + c];
                    if (score > maxScore) { maxScore = score; maxClass = c; }
                }

                // --- บรรทัดสำคัญที่แก้ปัญหา Crash ---
                if (maxClass === -1 || maxScore < 0.1) continue;

                const type = toAcneType(CLASS_NAMES[maxClass]);
                if (!type || type === "no_visible_acne" || maxScore < MIN_CONFIDENCE[type]) continue;

                const cx = out[offset + 0];
                const cy = out[offset + 1];
                const w = out[offset + 2];
                const h = out[offset + 3];

                candidates.push({ x1: cx - w / 2, y1: cy - h / 2, x2: cx + w / 2, y2: cy + h / 2, score: maxScore, type });
            }
        } else {
            console.error("Unknown output shape:", dims);
        }

        const acne: AcneFinding[] = nms(candidates).map((b) => {
            const rawCx = ((b.x1 + b.x2) / 2 - padX) / scale;
            const rawCy = ((b.y1 + b.y2) / 2 - padY) / scale;
            const cx = Math.max(0, Math.min(srcW, rawCx));
            const cy = Math.max(0, Math.min(srcH, rawCy));

            return {
                type: b.type,
                confidence: b.score,
                region: toRegion(cx, cy, srcW, srcH),
            };
        });

        console.log("ONNX detections:", acne.length, acne);

        return {
            modelVersion: this.modelVersion,
            imageQuality: { score: 1, usable: true, reasons: [] },
            acne,
        };
    }
}