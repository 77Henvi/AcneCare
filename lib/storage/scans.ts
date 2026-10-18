import { PredictionResult } from "@/lib/inference/types";
import { SkinType } from "@/lib/taxonomy";
import { Recommendation } from "@/lib/recommendation/engine";

export interface ScanRecord {
  id: string;
  createdAt: string;
  modelVersion: string;
  skinType?: SkinType;
  /** ภาพย่อ (data URL) ใช้วาดกรอบตอนแสดงผล (ไม่มีในรายการเก่า หรือถ้าพื้นที่เก็บเต็ม) */
  image?: string;
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
  const existing = listScans();

  // localStorage มีโควตาจำกัด ถ้าเต็มให้ทิ้งภาพย่อของรายการเก่าก่อน แล้วค่อยทิ้งภาพของรายการนี้
  // สร้างทีละรูปแบบเมื่อจำเป็น เพื่อไม่ต้อง stringify ประวัติทั้งก้อนซ้ำโดยไม่จำเป็น
  const attempts: Array<() => ScanRecord[]> = [
    () => [scan, ...existing],
    () => [scan, ...existing.map(withoutImage)],
    () => [withoutImage(scan), ...existing.map(withoutImage)],
  ];
  for (const build of attempts) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(build()));
      return;
    } catch {
      // ลองรูปแบบที่เล็กลงในรอบถัดไป
    }
  }
  throw new Error("บันทึกผลการสแกนไม่สำเร็จ (พื้นที่จัดเก็บในเบราว์เซอร์เต็ม)");
}

function withoutImage(scan: ScanRecord): ScanRecord {
  const { image: _image, ...rest } = scan;
  return rest;
}

export function listScans(): ScanRecord[] {
  if (typeof window === "undefined") return [];
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) return parsed as ScanRecord[];
  } catch {
    // ตกลงมาเก็บสำรองด้านล่าง
  }
  // ข้อมูลเสียหาย ให้ถือว่าไม่มีประวัติ แทนที่จะทำให้ทั้งหน้าพัง แต่เก็บสำเนาไว้
  // ก่อนที่ saveScan ครั้งต่อไปจะเขียนทับ เพื่อให้กู้คืนได้
  if (raw) {
    try {
      window.localStorage.setItem(`${KEY}:corrupt`, raw);
    } catch {
      // พื้นที่เต็ม ไม่มีอะไรทำต่อได้
    }
  }
  return [];
}

export function getScan(id: string): ScanRecord | undefined {
  return listScans().find((s) => s.id === id);
}

/** ลบผลการสแกนรายการเดียว (จุดสลับไป `DELETE /api/scans/{id}` เมื่อมี backend) */
export function deleteScan(id: string): void {
  if (typeof window === "undefined") return;
  const rest = listScans().filter((s) => s.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(rest));
}

/** ล้างประวัติการสแกนทั้งหมด (จุดสลับไป `DELETE /api/scans` เมื่อมี backend) */
export function clearScans(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function newScanId(): string {
  return `scan_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}
