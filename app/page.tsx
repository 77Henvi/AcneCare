import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-teal-600/80">AI Skin Analysis — ต้นแบบ</p>
        <h1 className="font-display text-4xl leading-tight text-teal-900">
          ถ่ายรูปหน้า ให้ AI ช่วยดูลักษณะผิวเบื้องต้น
        </h1>
        <p className="max-w-md text-ink/70">
          ระบบนี้ประเมินลักษณะผิวและลักษณะสิวจากภาพถ่าย เพื่อให้คำแนะนำการดูแลผิวเบื้องต้นที่ปลอดภัย
          ไม่ใช่เครื่องมือวินิจฉัยโรคและไม่ทดแทนคำแนะนำของแพทย์
        </p>
        <Link
          href="/scan"
          className="inline-flex items-center rounded-card bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-900 transition-colors"
        >
          เริ่มสแกนผิว
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { title: "ตรวจคุณภาพภาพ", body: "เช็กแสง ความเบลอ และขนาดใบหน้าก่อนวิเคราะห์" },
          { title: "ประเมินลักษณะผิว", body: "จำแนกผิวมัน ผิวแห้ง ผิวผสม หรือผิวปกติ" },
          { title: "ประเมินลักษณะสิว", body: "แยกชนิดสิวตามหลักการแพทย์ พร้อมคำแนะนำที่เหมาะสม" },
        ].map((f) => (
          <div key={f.title} className="rounded-card border border-sand-300 bg-surface p-5">
            <h2 className="font-medium text-teal-900">{f.title}</h2>
            <p className="mt-1.5 text-sm text-ink/65">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
