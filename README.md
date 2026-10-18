# Skin Scanner — Web Scaffold

Next.js + TypeScript + Tailwind scaffold for the AI Skin Analysis MVP, matching
the architecture in the design doc (client-side inference, rule-based
recommendation engine, taxonomy per Siriraj reference).

**Status:** scan inference runs in-browser with a YOLO26s ONNX model
(`public/models/acne-v0.3.onnx` by default, see "Model details" below). The
model detects six acne classes on close-up photos of one skin area (cheek,
forehead, nose or chin) that the user picks before uploading; its results are
not a clinically validated diagnosis.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — go to `/scan`, pick the skin area, then allow camera or upload a photo,
and it'll walk through quality check → model analysis → result page → history.

## What's real vs. mocked right now

| Piece | Status |
|---|---|
| Pages (`/`, `/scan`, `/result/[id]`, `/history`, `/about`) | Real |
| Image quality check (brightness/blur heuristic) | Real, runs in-browser |
| Acne/skin-type taxonomy | Real — matches the design doc & medical reference |
| Recommendation engine (incl. mandatory dermatologist referral for nodule/cyst) | Real, rule-based |
| Visual design (glass nav, hero, scan animation, staggered result reveal) | Real, `framer-motion` |
| Acne detection | Real ONNX inference in the browser (model file set in `lib/inference/index.ts`) |
| Skin area | Not used — the app does not guess or ask for a position on the face; boxes come straight from the detector |
| Result | Acne types found + count per type + the photo with bounding boxes; nodule and cyst both show "see a dermatologist" |
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

The active model is the `MODEL_FILE` constant in `lib/inference/index.ts`
(currently `public/models/acne-v0.3.onnx`), loaded by `lib/inference/onnxPredictor.ts`
using `onnxruntime-web` and WASM. It expects RGB float input shaped
`[1, 3, 640, 640]` and YOLO output shaped `[1, 10, 8400]` (the `[1, N, 6]`
end-to-end layout is also decoded). The six output classes must follow the
order in `data.yaml` used for training; the default is `Blackheads`, `Cysts`,
`Nodules`, `Papules`, `Pustules`, `Whiteheads`.

A finding is reported when a box of that type scores at least that type's value in `CONFIDENCE_THRESHOLDS` (0.2 for whitehead/blackhead/papule/pustule, 0.15 for nodule/cyst, in `onnxPredictor.ts`). Boxes are stored as 0..1
fractions of the photo so the result page can overlay them at any size.

To switch models, copy the `.onnx` to `public/models/`, change `MODEL_FILE` in
`lib/inference/index.ts` (and `CLASS_NAMES` if the class order differs), then
hard-refresh the page. If its input size or output layout changes, update
the preprocessing and decoder in `lib/inference/onnxPredictor.ts` as well. The
`Predictor` interface keeps the scan page independent from model
implementation. Images remain on-device.

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
lib/inference/  ONNX predictor and pluggable model interface
lib/quality-check/  Client-side image quality gate
lib/recommendation/ Rule-based recommendation engine (safety rules live here)
lib/storage/    Scan persistence (localStorage now, Supabase later)
lib/taxonomy.ts Single source of truth for skin-type/acne/skin-area labels
```
