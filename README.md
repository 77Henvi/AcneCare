# Skin Scanner — Web Scaffold

Next.js + TypeScript + Tailwind scaffold for the AI Skin Analysis MVP, matching
the architecture in the design doc (client-side inference, rule-based
recommendation engine, taxonomy per Siriraj reference).

**Status:** scan inference runs in-browser with the YOLO26s ONNX model at
`public/models/best.onnx`. The model detects six acne classes; its results are
not a clinically validated diagnosis.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — go to `/scan`, allow camera or upload a photo,
and it'll walk through quality check → model analysis → result page → history.

## What's real vs. mocked right now

| Piece | Status |
|---|---|
| Pages (`/`, `/scan`, `/result/[id]`, `/history`, `/about`) | Real |
| Image quality check (brightness/blur heuristic) | Real, runs in-browser |
| Acne/skin-type taxonomy | Real — matches the design doc & medical reference |
| Recommendation engine (incl. mandatory dermatologist referral for nodule/cyst) | Real, rule-based |
| Visual design (glass nav, hero, scan animation, staggered result reveal) | Real, `framer-motion` |
| Acne detection | Real ONNX inference in the browser using `public/models/best.onnx` |
| Face direction and regions | MediaPipe Face Landmarker runs locally in the browser; no face image is uploaded |
| Scan history/persistence | **Mocked** — browser `localStorage`, see below |

## Design direction

Redesigned against two Pinterest references (AI-skincare landing page with a
face-scan overlay + stats sidebar; an editorial skincare brand with an
oversized serif wordmark) while **keeping the original color tokens** from
`tailwind.config.ts` — nothing in the palette changed, only layout,
typography scale, and motion.

- **One deliberate motion moment per screen**, not animation everywhere:
  a scan-line + corner-bracket overlay while the AI is "analyzing"
  (`components/ScanLineOverlay.tsx`), a staggered reveal on the result page,
  and a sliding active-tab pill in the nav.
- **No fabricated stats.** The landing page intentionally does not show a
  made-up "95% accurate" number — see the medical-safety guardrail in the
  design doc. The stat row shows only true, structural facts (class count,
  region count, "0 raw images uploaded").
- Stack: `framer-motion` for the animation listed above; everything else is
  plain Tailwind transitions.


## Model details and replacement

The active model is `public/models/best.onnx`, loaded by
`lib/inference/onnxPredictor.ts` using `onnxruntime-web` and WASM. It expects
RGB float input shaped `[1, 3, 640, 640]` and YOLO output shaped
`[1, 10, 8400]`. The six output classes must remain in this order:
`Blackheads`, `Cysts`, `Nodules`, `Papules`, `Pustules`, `Whiteheads`.
The original PyTorch checkpoint can be kept locally at
`models/source/best.pt` for future exports; it is git-ignored and outside
`public/`, so Next.js does not serve it as a downloadable asset.

Face landmarks are estimated locally with MediaPipe Face Landmarker using
`public/models/face_landmarker.task` and the WASM files in
`public/mediapipe/wasm/`. The face landmarks provide an approximate head
direction and a face-aligned coordinate system for assigning each acne
detection to the forehead, cheeks, nose, or chin. If no face is found, the
result uses the older image-relative estimate and marks the face as not
detected. Direction and region estimates are approximate, especially for
strongly turned faces, and are not medical measurements.
The model is distributed by the
[MediaPipe team](https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task);
the browser runtime package `@mediapipe/tasks-vision` is under Apache 2.0.
Images remain on-device.

To replace the model, export a compatible ONNX model to
`public/models/best.onnx`; if its input size, class order, or output layout
changes, update the corresponding preprocessing and decoder in
`lib/inference/onnxPredictor.ts` as well. The `Predictor` interface keeps the
scan page independent from model implementation.

## Other swap points

**1. Real backend/database** (`lib/storage/scans.ts`)
Once FastAPI + Supabase are up (per design doc §12/§23), replace the three
functions in this file (`saveScan`, `listScans`, `getScan`) with calls to
`POST /api/scan`, `GET /api/scans`, `GET /api/scans/{id}`. Pages don't need
to change since they only import from this file.

**2. Taxonomy changes**
If the acne class list changes, edit `lib/taxonomy.ts` only — labels,
severity mapping, and the mandatory-referral rule all derive from there.

## Folder structure

```
app/            Next.js App Router pages
components/     Camera, ResultCard, Disclaimer, Nav
lib/inference/  ONNX predictor, face landmark analyzer, and pluggable model interface
lib/quality-check/  Client-side image quality gate
lib/recommendation/ Rule-based recommendation engine (safety rules live here)
lib/storage/    Scan persistence (localStorage now, Supabase later)
lib/taxonomy.ts Single source of truth for skin-type/acne/region labels
```
