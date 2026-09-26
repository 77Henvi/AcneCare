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
      <body className="font-sans antialiased">
        <Nav />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
