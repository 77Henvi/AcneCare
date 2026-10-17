import type { InferenceSession } from "onnxruntime-web";
import type { AcneType } from "@/lib/taxonomy";
import type { AcneFinding, PredictionResult, Predictor } from "./types";
import { analyzeFace } from "./faceLandmarker";
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

function decodeDetections(dims: readonly number[], out: Float32Array): Box[] {
    const candidates: Box[] = [];

    if (dims.length !== 3 || dims[0] !== 1) {
        throw new Error(`Unsupported ONNX output shape: [${dims.join(", ")}]`);
    }

    if (dims[2] === 6) {
        const numDetections = dims[1];
        if (out.length !== numDetections * 6) {
            throw new Error("ONNX output data length does not match its dimensions");
        }

        for (let i = 0; i < numDetections; i++) {
            const offset = i * 6;
            const score = out[offset + 4];
            const classIndex = Math.round(out[offset + 5]);
            if (
                !Number.isFinite(score) ||
                score < 0.1 ||
                classIndex < 0 ||
                classIndex >= NUM_CLASSES
            ) {
                continue;
            }

            const type = toAcneType(CLASS_NAMES[classIndex]);
            if (!type || type === "no_visible_acne" || score < MIN_CONFIDENCE[type]) {
                continue;
            }

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

    const channelsFirst = dims[1] === NUM_CLASSES + 4;
    const channelsLast = dims[2] === NUM_CLASSES + 4;
    if (!channelsFirst && !channelsLast) {
        throw new Error(`Unsupported ONNX output shape: [${dims.join(", ")}]`);
    }

    const rowSize = NUM_CLASSES + 4;
    const numBoxes = channelsFirst ? dims[2] : dims[1];
    if (out.length !== rowSize * numBoxes) {
        throw new Error("ONNX output data length does not match its dimensions");
    }

    for (let i = 0; i < numBoxes; i++) {
        let maxScore = 0;
        let maxClass = -1;

        for (let classIndex = 0; classIndex < NUM_CLASSES; classIndex++) {
            const scoreIndex = channelsFirst
                ? (4 + classIndex) * numBoxes + i
                : i * rowSize + 4 + classIndex;
            const score = out[scoreIndex];
            if (score > maxScore) {
                maxScore = score;
                maxClass = classIndex;
            }
        }

        if (maxClass < 0 || maxScore < 0.1) continue;

        const type = toAcneType(CLASS_NAMES[maxClass]);
        if (!type || type === "no_visible_acne" || maxScore < MIN_CONFIDENCE[type]) {
            continue;
        }

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

export class OnnxPredictor implements Predictor {
    readonly modelVersion = "acne-yolo26s-mediapipe-640";
    private modelUrl: string;
    private sessionPromise: Promise<InferenceSession> | null = null;

    constructor(modelUrl = "/models/best.onnx") {
        this.modelUrl = modelUrl;
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

    async predict(image: HTMLImageElement | HTMLCanvasElement): Promise<PredictionResult> {
        if (!image) throw new Error("ไม่มีข้อมูลภาพส่งเข้ามา");

        const srcW = image instanceof HTMLImageElement ? image.naturalWidth : image.width;
        const srcH = image instanceof HTMLImageElement ? image.naturalHeight : image.height;
        if (srcW === 0 || srcH === 0) {
            throw new Error("ขนาดภาพเป็น 0 (กล้องอาจจะยังไม่เปิด หรือรูปยังโหลดไม่เสร็จ)");
        }

        const [ort, session, face] = await Promise.all([
            getOrt(),
            this.getSession(),
            analyzeFace(image, srcW, srcH),
        ]);

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

        const candidates = decodeDetections(outputTensor.dims, outputTensor.data as Float32Array);
        const acne: AcneFinding[] = nms(candidates).map((box) => {
            const rawCx = ((box.x1 + box.x2) / 2 - padX) / scale;
            const rawCy = ((box.y1 + box.y2) / 2 - padY) / scale;
            const cx = Math.max(0, Math.min(srcW, rawCx));
            const cy = Math.max(0, Math.min(srcH, rawCy));

            return {
                type: box.type,
                confidence: box.score,
                region: face?.locateRegion(cx, cy) ?? toRegion(cx, cy, srcW, srcH),
            };
        });

        return {
            modelVersion: this.modelVersion,
            imageQuality: { score: 1, usable: true, reasons: [] },
            faceOrientation: face?.orientation ?? {
                detected: false,
                direction: "not_detected",
                yawDegrees: null,
                pitchDegrees: null,
                rollDegrees: null,
            },
            acne,
        };
    }
}
