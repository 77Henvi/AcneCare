import { ACNE_TYPES, AcneType } from "@/lib/taxonomy";

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
