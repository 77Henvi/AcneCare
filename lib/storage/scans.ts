import { PredictionResult } from "@/lib/inference/types";
import { Recommendation } from "@/lib/recommendation/engine";

export interface ScanRecord {
  id: string;
  createdAt: string;
  modelVersion: string;
  result: PredictionResult;
  recommendations: Recommendation[];
}

const KEY = "skin-scanner:scans";

/**
 * Temporary persistence so /history and /result/[id] work before the
 * backend (FastAPI + Supabase, per design doc §12/§23) exists. Swap point:
 * replace these three functions with calls to `POST /api/scan`,
 * `GET /api/scans`, and `GET /api/scans/{id}` — nothing in the page
 * components needs to change since they only import from this file.
 */
export function saveScan(scan: ScanRecord): void {
  if (typeof window === "undefined") return;
  const all = listScans();
  all.unshift(scan);
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function listScans(): ScanRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as ScanRecord[]) : [];
}

export function getScan(id: string): ScanRecord | undefined {
  return listScans().find((s) => s.id === id);
}

export function newScanId(): string {
  return `scan_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}
