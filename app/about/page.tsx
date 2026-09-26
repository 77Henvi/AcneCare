export default function AboutPage() {
  return (
    <div className="prose-sm mx-auto max-w-2xl space-y-5">
      <h1 className="font-display text-2xl text-teal-900">เกี่ยวกับระบบนี้</h1>

      <p className="text-sm text-ink/75">
        Skin Scanner เป็นระบบต้นแบบที่ใช้ AI ช่วยประเมินลักษณะผิวและลักษณะสิวจากภาพถ่ายใบหน้าเบื้องต้น
        เพื่อให้คำแนะนำการดูแลผิวเบื้องต้นที่ปลอดภัย
      </p>

      <div className="rounded-card border border-caution-500/30 bg-caution-50 p-4 text-sm text-caution-500">
        <p className="font-medium">ระบบนี้ไม่ใช่เครื่องมือวินิจฉัยโรค</p>
        <p className="mt-1">
          ผลลัพธ์ทั้งหมดเป็นการประเมินจากลักษณะภาพเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการตรวจวินิจฉัยโดยแพทย์ผิวหนังได้
          หากมีอาการรุนแรง ต่อเนื่อง หรือมีข้อกังวลใด ๆ ควรปรึกษาแพทย์
        </p>
      </div>

      <h2 className="font-display text-lg text-teal-900">ความเป็นส่วนตัว</h2>
      <p className="text-sm text-ink/75">
        การวิเคราะห์ภาพเกิดขึ้นบนอุปกรณ์ของผู้ใช้เอง (client-side) เป็นหลัก ระบบไม่จำเป็นต้องส่งภาพใบหน้าต้นฉบับขึ้นเซิร์ฟเวอร์
        ในทุกกรณี
      </p>

      <h2 className="font-display text-lg text-teal-900">แหล่งอ้างอิงทางการแพทย์</h2>
      <p className="text-sm text-ink/75">
        อนุกรมวิธานของชนิดสิวที่ใช้ในระบบนี้อ้างอิงจากเนื้อหาเรื่องสิว โดยภาควิชาตจวิทยา คณะแพทยศาสตร์ศิริราชพยาบาล
        มหาวิทยาลัยมหิดล
      </p>
    </div>
  );
}
