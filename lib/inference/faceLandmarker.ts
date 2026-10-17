import type { FaceLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { FaceOrientation } from "./types";
import type { FaceRegion } from "@/lib/taxonomy";

interface Point {
  x: number;
  y: number;
}

interface FaceGeometry {
  orientation: FaceOrientation;
  locateRegion: (x: number, y: number) => FaceRegion;
}

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

async function getFaceLandmarker(): Promise<FaceLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision = await import("@mediapipe/tasks-vision");
      const fileset = await vision.FilesetResolver.forVisionTasks("/mediapipe/wasm");
      return vision.FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: "/models/face_landmarker.task" },
        runningMode: "IMAGE",
        numFaces: 1,
        outputFacialTransformationMatrixes: true,
      });
    })().catch((error: unknown) => {
      landmarkerPromise = null;
      throw error;
    });
  }
  return landmarkerPromise;
}

function angleDegrees(start: Point, end: Point): number {
  return Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);
}

function toPoint(landmark: NormalizedLandmark, width: number, height: number): Point {
  return { x: landmark.x * width, y: landmark.y * height };
}

function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export async function analyzeFace(
  image: HTMLImageElement | HTMLCanvasElement,
  width: number,
  height: number,
): Promise<FaceGeometry | null> {
  const result = (await getFaceLandmarker()).detect(image);
  const landmarks = result.faceLandmarks[0];
  if (!landmarks || landmarks.length < 455) return null;

  const point = (index: number) => toPoint(landmarks[index], width, height);
  const rightEye = point(33);
  const leftEye = point(263);
  const nose = point(1);
  const chin = point(152);
  const mouthBottom = point(14);
  const eyeCenter = { x: (rightEye.x + leftEye.x) / 2, y: (rightEye.y + leftEye.y) / 2 };
  const eyeDistance = distance(rightEye, leftEye);

  if (!Number.isFinite(eyeDistance) || eyeDistance < 1) return null;

  const horizontal = {
    x: (leftEye.x - rightEye.x) / eyeDistance,
    y: (leftEye.y - rightEye.y) / eyeDistance,
  };
  let vertical = { x: -horizontal.y, y: horizontal.x };
  if ((chin.x - eyeCenter.x) * vertical.x + (chin.y - eyeCenter.y) * vertical.y < 0) {
    vertical = { x: -vertical.x, y: -vertical.y };
  }

  const project = (p: Point) => ({
    u: (p.x - eyeCenter.x) * horizontal.x + (p.y - eyeCenter.y) * horizontal.y,
    v: (p.x - eyeCenter.x) * vertical.x + (p.y - eyeCenter.y) * vertical.y,
  });

  const noseLocal = project(nose);
  const chinLocal = project(chin);
  const mouthLocal = project(mouthBottom);
  const noseLeft = project(point(98));
  const noseRight = project(point(327));
  const noseWidth = Math.abs(noseRight.u - noseLeft.u);
  const matrix = result.facialTransformationMatrixes[0]?.data;
  const radiansToDegrees = 180 / Math.PI;
  const modelYawDegrees =
    matrix?.length === 16
      ? Math.asin(Math.max(-1, Math.min(1, -matrix[2]))) * radiansToDegrees
      : Math.atan2(noseLocal.u, eyeDistance * 0.55) * radiansToDegrees;
  const yawDegrees = -modelYawDegrees; // Positive yaw means the user's head turns right.
  const pitchDegrees =
    matrix?.length === 16
      ? Math.atan2(matrix[6], matrix[10]) * radiansToDegrees
      : 0;
  const rollDegrees =
    matrix?.length === 16
      ? Math.atan2(matrix[1], matrix[0]) * radiansToDegrees
      : angleDegrees(rightEye, leftEye);
  const direction = yawDegrees < -12 ? "left" : yawDegrees > 12 ? "right" : "front";
  const orientation: FaceOrientation = {
    detected: true,
    direction,
    yawDegrees: Math.round(yawDegrees),
    pitchDegrees: Math.round(pitchDegrees),
    rollDegrees: Math.round(rollDegrees),
  };

  return {
    orientation,
    locateRegion(x, y) {
      const local = project({ x, y });
      const noseTop = -eyeDistance * 0.12;
      const noseBottom = noseLocal.v + eyeDistance * 0.12;
      const noseHalfWidth = Math.max(noseWidth * 0.72, eyeDistance * 0.13);
      if (
        local.v >= noseTop &&
        local.v <= noseBottom &&
        Math.abs(local.u - noseLocal.u) <= noseHalfWidth
      ) {
        return "nose";
      }
      if (local.v < 0) return "forehead";

      const chinStart = mouthLocal.v + (chinLocal.v - mouthLocal.v) * 0.45;
      if (local.v > chinStart) return "chin";

      return local.u < noseLocal.u ? "right_cheek" : "left_cheek";
    },
  };
}
