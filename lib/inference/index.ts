import { OnnxPredictor } from "./onnxPredictor";

export * from "./types";
export { CONFIDENCE_THRESHOLDS } from "./onnxPredictor";

// เปลี่ยนโมเดล: วางไฟล์ .onnx ไว้ใน public/models/ แล้วแก้ชื่อไฟล์ตรงนี้ที่เดียว
// จากนั้นรีเฟรชหน้าเว็บด้วย Ctrl+Shift+R (ชื่อไฟล์ไม่รวม .onnx จะถูกบันทึกเป็นเวอร์ชันโมเดลในประวัติด้วย)
const MODEL_FILE = "acne-v0.3.onnx";

// ลำดับต้องตรงกับ model.names ตอนเทรน ถ้าโมเดลใหม่เรียงต่างจากนี้ให้แก้ตรงนี้ด้วย
const CLASS_NAMES = [
  "Blackheads", // index 0: สิวหัวดำ
  "Cysts", // index 1: สิวซีสต์
  "Nodules", // index 2: สิวหัวช้าง
  "Papules", // index 3: สิวตุ่มแดง
  "Pustules", // index 4: สิวตุ่มหนอง
  "Whiteheads", // index 5: สิวหัวขาว
];

export const activePredictor = new OnnxPredictor(`/models/${MODEL_FILE}`, {
  modelVersion: MODEL_FILE.replace(/\.onnx$/, ""),
  classNames: CLASS_NAMES,
});
