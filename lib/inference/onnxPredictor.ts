import type { InferenceSession } from "onnxruntime-web";
import type { AcneType } from "@/lib/taxonomy";
import type { AcneFinding, PredictionResult, Predictor } from "./types";
import { toAcneType, toRegion } from "./utils";

// ลำดับต้องตรงกับ model.names ตอนเทรน
const CLASS_NAMES = ["Blackheads", "Cysts", "Nodules", "Papules", "Pustules", "Whiteheads"];
const NUM_CLASSES = CLASS_NAMES.length;
const NUM_BOXES = 8400;
const SIZE = 640;
const IOU_THRESHOLD = 0.45;

// nodule/cyst ผูกกับกฎส่งต่อแพทย์ จึงตั้งเกณฑ์ต่ำกว่า
// ยอมให้เตือนเกินดีกว่าพลาดเคสที่ควรพบแพทย์
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
    const union =
        (a.x2 - a.x1) * (a.y2 - a.y1) + (b.x2 - b.x1) * (b.y2 - b.y1) - inter;
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

export class OnnxPredictor implements Predictor {
    readonly modelVersion = "acne-onnx-v0.1";
    private modelUrl: string;
    private sessionPromise: Promise<InferenceSession> | null = null;

    constructor(modelUrl = "/models/acne-v0.1.onnx") {
        this.modelUrl = modelUrl;
    }

    // สร้าง session ตอนเรียกใช้จริงเท่านั้น (ฝั่ง browser)
    // เพราะ index.ts ถูก import ฝั่ง server ด้วย ห้ามโหลดโมเดลตอน import
    private getSession(): Promise<InferenceSession> {
        if (!this.sessionPromise) {
            this.sessionPromise = (async () => {
                const ort = await import("onnxruntime-web");
                ort.env.wasm.wasmPaths = "/ort/";
                return ort.InferenceSession.create(this.modelUrl);
            })();
        }
        return this.sessionPromise;
    }

    async predict(
        image: HTMLImageElement | HTMLCanvasElement
    ): Promise<PredictionResult> {
        const ort = await import("onnxruntime-web");
        const session = await this.getSession();

        const srcW = image instanceof HTMLImageElement ? image.naturalWidth : image.width;
        const srcH = image instanceof HTMLImageElement ? image.naturalHeight : image.height;

        // Letterbox: ย่อภาพโดยคงสัดส่วน แล้วเติมขอบสีเทาให้เป็น 640x640
        // (ตรงกับวิธีที่ Ultralytics ใช้ตอนเทรน)
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

        // แปลงเป็น tensor [1, 3, 640, 640] ค่า 0..1 แยกช่อง R, G, B
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
        const out = outputs[session.outputNames[0]].data as Float32Array;
        // out จัดเรียงเป็น [ค่า 10 ตัว][กล่อง 8400 กล่อง] ค่าที่ c ของกล่อง i อยู่ที่ out[c * 8400 + i]

        const candidates: Box[] = [];
        for (let i = 0; i < NUM_BOXES; i++) {
            let best = -1;
            let bestScore = 0;
            for (let c = 0; c < NUM_CLASSES; c++) {
                const s = out[(4 + c) * NUM_BOXES + i];
                if (s > bestScore) {
                    bestScore = s;
                    best = c;
                }
            }
            if (best < 0) continue;

            const type = toAcneType(CLASS_NAMES[best]);
            if (!type || type === "no_visible_acne") continue;
            if (bestScore < MIN_CONFIDENCE[type]) continue;

            const cx = out[0 * NUM_BOXES + i];
            const cy = out[1 * NUM_BOXES + i];
            const w = out[2 * NUM_BOXES + i];
            const h = out[3 * NUM_BOXES + i];
            candidates.push({
                x1: cx - w / 2,
                y1: cy - h / 2,
                x2: cx + w / 2,
                y2: cy + h / 2,
                score: bestScore,
                type,
            });
        }

        const acne: AcneFinding[] = nms(candidates).map((b) => {
            // แปลงจุดกึ่งกลางกลับเป็นพิกัดบนภาพต้นฉบับ (ถอด padding และ scale)
            const cx = ((b.x1 + b.x2) / 2 - padX) / scale;
            const cy = ((b.y1 + b.y2) / 2 - padY) / scale;
            return {
                type: b.type,
                confidence: b.score,
                region: toRegion(cx, cy, srcW, srcH),
            };
        });

        console.log("ONNX detections:", acne.length, acne);

        return {
            modelVersion: this.modelVersion,
            // placeholder: ต่อกับ lib/quality-check ภายหลัง
            imageQuality: { score: 1, usable: true, reasons: [] },
            acne,
        };
    }
}