import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Skin Scanner — AI Skin Analysis",
  description: "ประเมินลักษณะผิวและสิวเบื้องต้นด้วย AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="font-sans antialiased selection:bg-teal-100 selection:text-teal-900">
        <Nav />
        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:max-w-6xl lg:px-8 lg:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
