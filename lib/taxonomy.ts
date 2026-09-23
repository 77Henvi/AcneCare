// Single source of truth for class labels. Matches the taxonomy defined in
// the AI Skin Analysis design doc (ref: Siriraj Acne Therapark), so the
// dataset your friends label, the trained model's output classes, and this
// UI all agree on the same strings. If the taxonomy changes, change it here
// only — everything else imports from this file.

export type SkinType = "normal" | "oily" | "dry" | "combination";

export type AcneType =
  | "no_visible_acne"
  | "whitehead"
  | "blackhead"
  | "papule"
  | "pustule"
  | "nodule"
  | "cyst";

export type FaceRegion =
  | "forehead"
  | "left_cheek"
  | "right_cheek"
  | "nose"
  | "chin";

export const SKIN_TYPES: SkinType[] = ["normal", "oily", "dry", "combination"];

export const ACNE_TYPES: AcneType[] = [
  "no_visible_acne",
  "whitehead",
  "blackhead",
  "papule",
  "pustule",
  "nodule",
  "cyst",
];

export const FACE_REGIONS: FaceRegion[] = [
  "forehead",
  "left_cheek",
  "right_cheek",
  "nose",
  "chin",
];

export const ACNE_LABEL_TH: Record<AcneType, string> = {
  no_visible_acne: "ไม่พบลักษณะสิวที่ชัดเจน",
  whitehead: "สิวหัวขาว (สิวอุดตันหัวปิด)",
  blackhead: "สิวหัวดำ (สิวอุดตันหัวเปิด)",
  papule: "สิวตุ่มแดง",
  pustule: "สิวตุ่มหนอง",
  nodule: "สิวหัวช้าง",
  cyst: "สิวซีสต์",
};

export const SKIN_TYPE_LABEL_TH: Record<SkinType, string> = {
  normal: "ผิวปกติ",
  oily: "ผิวมัน",
  dry: "ผิวแห้ง",
  combination: "ผิวผสม",
};

export const FACE_REGION_LABEL_TH: Record<FaceRegion, string> = {
  forehead: "หน้าผาก",
  left_cheek: "แก้มซ้าย",
  right_cheek: "แก้มขวา",
  nose: "จมูก",
  chin: "คาง",
};

// Severity drives the safety layer (see lib/recommendation). Never let the
// UI branch on the raw string label directly for anything safety-related —
// always go through this map, so a taxonomy edit can't silently break the
// "refer to a dermatologist" guardrail.
export type Severity = "none" | "low" | "moderate" | "refer";

export const ACNE_SEVERITY: Record<AcneType, Severity> = {
  no_visible_acne: "none",
  whitehead: "low",
  blackhead: "low",
  papule: "moderate",
  pustule: "moderate",
  nodule: "refer",
  cyst: "refer",
};
