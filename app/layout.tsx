import type { Metadata } from "next";
import "./globals.css";
import { TreatmentProvider } from "@/lib/treatmentContext";
import AnnouncementBar from "@/components/purelis/AnnouncementBar";
import Navbar from "@/components/purelis/Navbar";
import Footer from "@/components/purelis/Footer";
import MedicationDrawer from "@/components/purelis/MedicationDrawer";

export const metadata: Metadata = {
  title: "AcneCare AI — ประเมินผิวและสิวเบื้องต้น พร้อมจับคู่ตัวยารักษา",
  description: "ตรวจวิเคราะห์สิว 6 ชนิดและสภาพผิวด้วย AI พร้อมจับคู่ตัวยาและเวชสำอางที่เหมาะสมตามหลักการแพทย์ผิวหนัง",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="scroll-smooth">
      <body className="min-h-screen bg-[#FAF8F5] font-sans antialiased text-[#1A221E] selection:bg-[#27482E] selection:text-white">
        <TreatmentProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="min-h-[calc(100vh-280px)]">{children}</main>
          <Footer />
          <MedicationDrawer />
        </TreatmentProvider>
      </body>
    </html>
  );
}
