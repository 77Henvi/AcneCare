import type { InferenceSession } from "onnxruntime-web";
import type { AcneType } from "@/lib/taxonomy";
import type { AcneFinding, PredictionResult, Predictor } from "./types";
import { toAcneType } from "./utils";

const SIZE = 640;
const IOU_THRESHOLD = 0.45;

// กฎ "พบสิวชนิด X" = มีกล่องชนิด X ที่คะแนน >= ค่าของชนิดนั้น (ปรับตามผลบนชุด valid)
// ชนิดที่พบน้อยและต้องไม่พลาด (หัวช้าง ซีสต์) ใช้เกณฑ์ต่ำกว่า
export const CONFIDENCE_THRESHOLDS: Record<Exclude<AcneType, "no_visible_acne">, number> = {
    whitehead: 0.2, // สิวหัวขาว (สิวอุดตันหัวปิด)
    blackhead: 0.2, // สิวหัวดำ (สิวอุดตันหัวเปิด)
    papule: 0.2, // สิวตุ่มแดง
    pustule: 0.15, // สิวตุ่มหนอง
    nodule: 0.15, // สิวหัวช้าง
    cyst: 0.15, // สิวซีสต์
};

export interface OnnxPredictorOptions {
    modelVersion: string;
    /** ลำดับต้องตรงกับ model.names ตอนเทรน */
    classNames: readonly string[];
}

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

function nms(boxes: Box[]): Box[] {
    const sorted = [...boxes].sort((a, b) => b.score - a.score);
    const kept: Box[] = [];
    for (const box of sorted) {
        if (!kept.some((candidate) => candidate.type === box.type && iou(candidate, box) > IOU_THRESHOLD)) {
            kept.push(box);
        }
    }
    return kept;
}

function decodeDetections(
    dims: readonly number[],
    out: Float32Array,
    classTypes: readonly (AcneType | null)[],
): Box[] {
    const candidates: Box[] = [];
    const numClasses = classTypes.length;

    if (dims.length !== 3 || dims[0] !== 1) {
        throw new Error(`Unsupported ONNX output shape: [${dims.join(", ")}]`);
    }

    // คืน type ของคลาสที่คะแนนผ่านเกณฑ์ หรือ null ถ้าต้องข้าม
    const acceptedType = (classIndex: number, score: number): AcneType | null => {
        const type = classTypes[classIndex];
        if (!type || type === "no_visible_acne" || score < CONFIDENCE_THRESHOLDS[type]) return null;
        return type;
    };

    if (dims[2] === 6) {
        const numDetections = dims[1];
        if (out.length !== numDetections * 6) {
            throw new Error("ONNX output data length does not match its dimensions");
        }

        for (let i = 0; i < numDetections; i++) {
            const offset = i * 6;
            const score = out[offset + 4];
            const classIndex = Math.round(out[offset + 5]);
            if (!Number.isFinite(score) || classIndex < 0 || classIndex >= numClasses) continue;

            const type = acceptedType(classIndex, score);
            if (!type) continue;

            candidates.push({
                x1: out[offset],
                y1: out[offset + 1],
                x2: out[offset + 2],
                y2: out[offset + 3],
                score,
                type,
            });
        }

        return candidates;
    }

    const rowSize = numClasses + 4;
    const channelsFirst = dims[1] === rowSize;
    const channelsLast = dims[2] === rowSize;
    if (!channelsFirst && !channelsLast) {
        throw new Error(`Unsupported ONNX output shape: [${dims.join(", ")}]`);
    }

    const numBoxes = channelsFirst ? dims[2] : dims[1];
    if (out.length !== rowSize * numBoxes) {
        throw new Error("ONNX output data length does not match its dimensions");
    }

    for (let i = 0; i < numBoxes; i++) {
        let maxScore = 0;
        let maxClass = -1;

        for (let classIndex = 0; classIndex < numClasses; classIndex++) {
            const scoreIndex = channelsFirst
                ? (4 + classIndex) * numBoxes + i
                : i * rowSize + 4 + classIndex;
            const score = out[scoreIndex];
            if (score > maxScore) {
                maxScore = score;
                maxClass = classIndex;
            }
        }

        if (maxClass < 0) continue;

        const type = acceptedType(maxClass, maxScore);
        if (!type) continue;

        const coordinateIndex = (coordinate: number) =>
            channelsFirst ? coordinate * numBoxes + i : i * rowSize + coordinate;
        const cx = out[coordinateIndex(0)];
        const cy = out[coordinateIndex(1)];
        const width = out[coordinateIndex(2)];
        const height = out[coordinateIndex(3)];
        if (![cx, cy, width, height].every(Number.isFinite)) continue;

        candidates.push({
            x1: cx - width / 2,
            y1: cy - height / 2,
            x2: cx + width / 2,
            y2: cy + height / 2,
            score: maxScore,
            type,
        });
    }

    return candidates;
}

async function getOrt() {
    const ortModule = await import("onnxruntime-web");
    return ortModule.default || ortModule;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export class OnnxPredictor implements Predictor {
    readonly modelVersion: string;
    private modelUrl: string;
    private classTypes: (AcneType | null)[];
    private sessionPromise: Promise<InferenceSession> | null = null;

    constructor(modelUrl: string, options: OnnxPredictorOptions) {
        this.modelUrl = modelUrl;
        this.modelVersion = options.modelVersion;
        this.classTypes = options.classNames.map(toAcneType);
    }

    private getSession(): Promise<InferenceSession> {
        if (!this.sessionPromise) {
            this.sessionPromise = (async () => {
                const ort = await getOrt();
                ort.env.wasm.wasmPaths = "/ort/";
                return ort.InferenceSession.create(this.modelUrl);
            })().catch((error: unknown) => {
                this.sessionPromise = null;
                throw error;
            });
        }
        return this.sessionPromise;
    }

    /** โหลดโมเดลล่วงหน้า เพื่อไม่ให้การสแกนครั้งแรกต้องรอดาวน์โหลด */
    preload(): void {
        this.getSession().catch(() => {
            // error จริงจะแสดงตอน predict() เรียก getSession() อีกครั้ง
        });
    }

    async predict(image: HTMLImageElement | HTMLCanvasElement): Promise<PredictionResult> {
        if (!image) throw new Error("ไม่มีข้อมูลภาพส่งเข้ามา");

        const srcW = image instanceof HTMLImageElement ? image.naturalWidth : image.width;
        const srcH = image instanceof HTMLImageElement ? image.naturalHeight : image.height;
        if (srcW === 0 || srcH === 0) {
            throw new Error("ขนาดภาพเป็น 0 (กล้องอาจจะยังไม่เปิด หรือรูปยังโหลดไม่เสร็จ)");
        }

        const [ort, session] = await Promise.all([getOrt(), this.getSession()]);

        // Letterbox: ย่อภาพโดยคงสัดส่วน แล้วเติมขอบสีเทาให้เป็น 640x640
        // ให้ตรงกับ preprocessing ของ Ultralytics
        const scale = Math.min(SIZE / srcW, SIZE / srcH);
        const newW = Math.round(srcW * scale);
        const newH = Math.round(srcH * scale);
        const padX = Math.floor((SIZE - newW) / 2);
        const padY = Math.floor((SIZE - newH) / 2);

        const canvas = document.createElement("canvas");
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("ไม่สามารถสร้าง canvas สำหรับประมวลผลภาพได้");
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

        const inputName = session.inputNames[0];
        const outputName = session.outputNames[0];
        if (!inputName || !outputName) {
            throw new Error("ONNX model is missing an input or output tensor");
        }

        const outputs = await session.run({
            [inputName]: new ort.Tensor("float32", input, [1, 3, SIZE, SIZE]),
        });
        const outputTensor = outputs[outputName];
        if (!outputTensor) {
            throw new Error(`ONNX model did not return the expected output: ${outputName}`);
        }

        const candidates = decodeDetections(outputTensor.dims, outputTensor.data as Float32Array, this.classTypes);
        const acne: AcneFinding[] = [];
        for (const box of nms(candidates)) {
            // แปลงพิกัดจากภาพ letterbox 640x640 กลับเป็นสัดส่วนของภาพต้นฉบับ
            const x1 = clamp01((box.x1 - padX) / scale / srcW);
            const y1 = clamp01((box.y1 - padY) / scale / srcH);
            const x2 = clamp01((box.x2 - padX) / scale / srcW);
            const y2 = clamp01((box.y2 - padY) / scale / srcH);
            if (x2 <= x1 || y2 <= y1) continue;

            acne.push({ type: box.type, confidence: box.score, box: { x1, y1, x2, y2 } });
        }

        return {
            modelVersion: this.modelVersion,
            imageQuality: { score: 1, usable: true, reasons: [] },
            acne,
        };
    }
}
