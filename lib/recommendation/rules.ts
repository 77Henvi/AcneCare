import { AcneFinding, SkinTypePrediction } from "@/lib/inference/types";
import { ACNE_SEVERITY } from "@/lib/taxonomy";

export interface Recommendation {
  ruleId: string;
  text: string;
  mandatory?: boolean; // cannot be dismissed by the user (e.g. refer-to-doctor)
}

/**
 * Pure rule-based recommendations — see design doc §15. An LLM, if ever
 * added, may ONLY rephrase the `text` below; it must never originate new
 * advice or decide whether the "refer" rules fire.
 */
export function getSkinTypeRecommendations(skinType: SkinTypePrediction): Recommendation[] {
  switch (skinType.label) {
    case "oily":
      return [
        { ruleId: "oily_gentle_cleanser", text: "ใช้ผลิตภัณฑ์ทำความสะอาดที่อ่อนโยน" },
        { ruleId: "oily_non_comedogenic", text: "เลือกผลิตภัณฑ์ที่ระบุว่าไม่อุดตันรูขุมขน (non-comedogenic)" },
        { ruleId: "oily_avoid_over_cleansing", text: "หลีกเลี่ยงการล้างหน้าบ่อยเกินไป เพราะอาจกระตุ้นให้ผิวผลิตน้ำมันมากขึ้น" },
      ];
    case "dry":
      return [
        { ruleId: "dry_moisturize", text: "เพิ่มความชุ่มชื้นด้วยมอยส์เจอไรเซอร์ที่เหมาะกับผิวแห้ง" },
        { ruleId: "dry_avoid_harsh_cleanser", text: "หลีกเลี่ยงผลิตภัณฑ์ทำความสะอาดที่มีฤทธิ์รุนแรงหรือมีแอลกอฮอล์สูง" },
      ];
    case "combination":
      return [
        { ruleId: "combo_zone_care", text: "ดูแลแยกโซน T-zone และบริเวณแก้มตามความต้องการของผิวแต่ละส่วน" },
      ];
    default:
      return [{ ruleId: "normal_maintain", text: "รักษากิจวัตรการดูแลผิวที่อ่อนโยนและสม่ำเสมอ" }];
  }
}

export function getAcneRecommendations(findings: AcneFinding[]): Recommendation[] {
  const recs: Recommendation[] = [];
  const types = new Set(findings.map((f) => f.type));

  if (types.has("whitehead") || types.has("blackhead")) {
    recs.push(
      { ruleId: "comedonal_gentle_exfoliation", text: "ผลัดเซลล์ผิวอย่างอ่อนโยนเป็นประจำ" },
      { ruleId: "comedonal_no_diy_extraction", text: "ไม่ควรบีบหรือกดสิวเอง" },
      { ruleId: "comedonal_avoid_comedogenic_makeup", text: "หลีกเลี่ยงเครื่องสำอางที่อุดตันรูขุมขน" },
    );
  }

  if (types.has("papule") || types.has("pustule")) {
    recs.push(
      { ruleId: "inflammatory_no_squeeze", text: "หลีกเลี่ยงการบีบหรือแกะสิว" },
      { ruleId: "inflammatory_gentle_cleanser", text: "ใช้ผลิตภัณฑ์ล้างหน้าสูตรอ่อนโยน" },
      { ruleId: "inflammatory_avoid_scrub", text: "งดการสครับหรือขัดผิวบริเวณที่อักเสบ" },
    );
  }

  // ── Mandatory safety rule — see design doc §14/§15 ──────────────────
  // Fires whenever ANY finding maps to severity "refer". This must stay a
  // direct check against ACNE_SEVERITY (not a hardcoded type list) so a
  // future taxonomy edit can't silently disable the guardrail.
  const needsReferral = findings.some((f) => ACNE_SEVERITY[f.type] === "refer");
  if (needsReferral) {
    recs.push({
      ruleId: "refer_dermatologist",
      text: "ลักษณะนี้ควรได้รับการตรวจจากแพทย์ผิวหนัง ไม่แนะนำให้รักษาด้วยตนเอง",
      mandatory: true,
    });
  }

  return recs;
}

export const DISCLAIMER_TH =
  "ผลลัพธ์เป็นการประเมินจากภาพเบื้องต้นโดย AI ไม่ใช่การวินิจฉัยทางการแพทย์ หากมีอาการรุนแรง ต่อเนื่อง เจ็บมาก หรือมีข้อกังวล ควรปรึกษาแพทย์หรือผู้เชี่ยวชาญด้านผิวหนัง";
