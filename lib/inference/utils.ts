import { ACNE_TYPES, AcneType, FaceRegion } from "@/lib/taxonomy";

// ชื่อคลาสจากโมเดลอาจไม่ตรงกับ taxonomy เป๊ะ (เช่น "Papules", "white head")
// ฟังก์ชันนี้ปรับรูปแบบให้ก่อน แล้วค่อยเทียบกับ AcneType
// ถ้าชื่อในโมเดลต่างจากนี้มาก ให้เพิ่มใน ALIASES
const ALIASES: Record<string, AcneType> = {
    // "comedone_closed": "whitehead",
    // "comedone_open": "blackhead",
};

export function toAcneType(raw: string): AcneType | null {
    const key = raw.trim().toLowerCase().replace(/[\s-]+/g, "_");
    if (key in ALIASES) return ALIASES[key];
    if ((ACNE_TYPES as string[]).includes(key)) return key as AcneType;
    // รองรับรูปพหูพจน์ เช่น "papules" -> "papule"
    const singular = key.replace(/s$/, "");
    if ((ACNE_TYPES as string[]).includes(singular)) return singular as AcneType;
    return null;
}

// แบ่งบริเวณแบบหยาบจากตำแหน่งในภาพ (ใช้ได้ถ้ารูปเป็นใบหน้าตรงและเต็มเฟรม)
// x, y = จุดกึ่งกลางของกล่อง, w, h = ขนาดภาพที่ใช้อ้างอิง
// ทางกายวิภาค: ซีกซ้ายของภาพ (nx < 0.5) คือ "แก้มขวา" ของใบหน้าผู้ใช้, ซีกขวาของภาพคือ "แก้มซ้าย"
export function toRegion(x: number, y: number, w: number, h: number): FaceRegion {
    const nx = x / w;
    const ny = y / h;
    if (ny < 0.3) return "forehead";
    if (ny > 0.8) return "chin";
    if (nx > 0.4 && nx < 0.6 && ny > 0.4 && ny < 0.7) return "nose";
    return nx < 0.5 ? "right_cheek" : "left_cheek";
}