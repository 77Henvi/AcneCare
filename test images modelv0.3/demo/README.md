# ภาพ demo สำหรับ pitch (โมเดล acne-v0.3)

14 ภาพสำหรับสาธิตเว็บ เลือกจากภาพที่ **v0.3 ไม่เคยเห็นตอนเทรน** (ไม่อยู่ใน train/valid ของ acnev0.3) และไม่มีลายน้ำ

## วิธีที่เลือก

- รันไฟล์ `public/models/acne-v0.3.onnx` ด้วยขั้นตอนเดียวกับเว็บ (letterbox 640, เกณฑ์ความมั่นใจเดียวกับใน `onnxPredictor.ts`) แล้วเทียบกับป้ายของชุดข้อมูลต้นทาง
- เลือกเฉพาะภาพที่โมเดลทายตรงกับป้าย **คัดภาพที่โมเดลทำได้ดีมาโชว์** ห้ามใช้ภาพชุดนี้เป็นตัวเลขความแม่นยำ
- ไม่ใช้ภาพจากแหล่ง `acne_detection_v1` (ป้ายมาจากระดับความรุนแรงของภาพ ไม่ใช่ชนิดสิว) และไม่ใช้ภาพจาก `acne_photos` (ไม่รู้ที่มา)
- ไม่มีภาพสิวหัวช้าง (nodule) ที่ดีและโมเดลไม่เคยเห็น จึงใช้สิวซีสต์ (12–14) แสดงคำแนะนำ “ควรพบแพทย์ผิวหนัง” แทน

## รายการภาพ

| ไฟล์ | โมเดลตรวจพบ | ป้ายในชุดข้อมูล | ไฟล์ต้นทาง |
|---|---|---|---|
| 01_fullface.jpg | สิวตุ่มแดง 2 | สิวตุ่มแดง 2 | `0364_nacnev2_clean2_cubeil__test__levle1_186_png__11945dd1c463_jpg.rf.6b7bd5cffb35ce3f18522a87819c6f68.jpg` |
| 02_fullface.jpg | สิวตุ่มแดง 2, สิวตุ่มหนอง 1 | สิวตุ่มแดง 2, สิวตุ่มหนอง 1 | `0371_nacnev2_clean2_cubeil__train__levle1_476_png__0b817a9fabd5_jpg.rf.bcd0e964153bd8c91a765292fb15ebfe.jpg` |
| 03_fullface.jpg | สิวตุ่มแดง 8, สิวตุ่มหนอง 1 | สิวตุ่มแดง 9, สิวตุ่มหนอง 1 | `0374_nacnev2_clean2_cubeil__train__levle2_119__f0991f12f92f_jpg.rf.5197879e6961e84d9d3ebc231ed5f4c4.jpg` |
| 04_blackhead.jpg | สิวหัวดำ 7 | สิวหัวดำ 7 | `acneprediction__valid__blackhead-55-_JPG__ac44082c9575_jpg.jpg` |
| 05_blackhead.jpg | สิวหัวดำ 12 | สิวหัวดำ 15 | `cubeil__train__Screenshot-2024-11-27-205805_png_png_png__4cf8d7d14db2_jpg.jpg` |
| 06_whitehead.jpg | สิวหัวขาว 18, สิวหัวดำ 1 | สิวหัวขาว 17 | `cubeil__train__aug_2_14_0_3580_jpeg__a21114b650d2_jpg.jpg` |
| 07_whitehead.jpg | สิวหัวขาว 77 | สิวหัวขาว 61 | `cubeil__train__aug_2_11_0_4864_jpeg__d56f77d346a6_jpg.jpg` |
| 08_papule.jpg | สิวตุ่มแดง 1 | สิวตุ่มแดง 1 | `acneprediction__valid__white_head_-13-__9576eb78aff8_jpg.jpg` |
| 09_pustule.jpg | สิวตุ่มหนอง 1 | สิวตุ่มหนอง 1 | `cubeil__train__aug_5_123_0_9800_jpeg__1b3ebcde148f_jpg.jpg` |
| 10_pustule.jpg | สิวตุ่มหนอง 1 | สิวตุ่มหนอง 1 | `cubeil__valid__01F3MMZ5Y0XG30V9VSBY6CY23P_jpeg__ea5f40c4b8a4_jpg.jpg` |
| 11_pustule.jpg | สิวตุ่มหนอง 1 | สิวตุ่มหนอง 1 | `cubeil__valid__5_124__c2d509edb9cc_jpg.jpg` |
| 12_cyst.jpg | สิวซีสต์ 1 | สิวซีสต์ 1 | `skin_problems__valid__image-24-__aaa530a869c6_jpg.jpg` |
| 13_cyst.jpg | สิวซีสต์ 3, สิวตุ่มแดง 1 | สิวซีสต์ 3 | `cubeil__valid__3_63__59c950f9db33_jpg.jpg` |
| 14_cyst.jpg | สิวซีสต์ 3 | สิวซีสต์ 2 | `cubeil__train__aug_3_64_0_133_jpeg__d19adccbae46_jpg.jpg` |

ผลบนเว็บอาจต่างจากตารางเล็กน้อย เพราะตารางนี้รันด้วย Python (การย่อภาพต่างจาก canvas ของเบราว์เซอร์นิดหน่อย)

## ข้อควรระวัง

- ภาพมาจากชุดข้อมูลสาธารณะบน Roboflow (CC BY 4.0 ตามผู้อัปโหลด) ลิขสิทธิ์ของภาพต้นทางยังไม่ได้ตรวจ อัปโหลดไว้ที่ branch `test` เพื่อสาธิตใน pitch เท่านั้น ไม่ควรนำไปเผยแพร่ต่อหรือใช้เชิงพาณิชย์ (repo นี้เป็น public)
- ภาพชุดข้อมูลถูกย่อ/ยืดเป็น 640×640 มาตั้งแต่ต้นทาง
