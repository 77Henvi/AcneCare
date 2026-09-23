# Skin Scanner — Web Scaffold

Next.js + TypeScript + Tailwind scaffold for the AI Skin Analysis MVP, matching
the architecture in the design doc (client-side inference, rule-based
recommendation engine, taxonomy per Siriraj reference).

**Status:** fully clickable end-to-end right now using a **mock predictor**
(random but taxonomy-correct predictions) so the frontend can be built and
demoed while the dataset is being labeled and the real model is being
trained in parallel.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — go to `/scan`, allow camera or upload a photo,
and it'll walk through quality check → mock analysis → result page → history.

## What's real vs. mocked right now

| Piece | Status |
|---|---|
| Pages (`/`, `/scan`, `/result/[id]`, `/history`, `/about`) | Real |
| Image quality check (brightness/blur heuristic) | Real, runs in-browser |
| Acne/skin-type taxonomy | Real — matches the design doc & medical reference |
| Recommendation engine (incl. mandatory dermatologist referral for nodule/cyst) | Real, rule-based |
| AI prediction | **Mocked** — random output, see below |
| Scan history/persistence | **Mocked** — browser `localStorage`, see below |

## Swap points (do these once the other pieces are ready)

**1. Real trained model** (`lib/inference/`)
Once the Teachable Machine model is exported as TensorFlow.js:
1. Add `tfjs` dependency and write `lib/inference/teachableMachinePredictor.ts`
   implementing the `Predictor` interface from `lib/inference/types.ts`.
2. Change the single line in `lib/inference/index.ts` that constructs
   `activePredictor`.
3. Nothing else in the app changes — every page only imports `activePredictor`.

**2. Real backend/database** (`lib/storage/scans.ts`)
Once FastAPI + Supabase are up (per design doc §12/§23), replace the three
functions in this file (`saveScan`, `listScans`, `getScan`) with calls to
`POST /api/scan`, `GET /api/scans`, `GET /api/scans/{id}`. Pages don't need
to change since they only import from this file.

**3. Taxonomy changes**
If the acne class list changes, edit `lib/taxonomy.ts` only — labels,
severity mapping, and the mandatory-referral rule all derive from there.

## Folder structure

```
app/            Next.js App Router pages
components/     Camera, ResultCard, Disclaimer, Nav
lib/inference/  Pluggable model interface + mock predictor
lib/quality-check/  Client-side image quality gate
lib/recommendation/ Rule-based recommendation engine (safety rules live here)
lib/storage/    Scan persistence (localStorage now, Supabase later)
lib/taxonomy.ts Single source of truth for skin-type/acne/region labels
```
