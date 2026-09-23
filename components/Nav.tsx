"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "หน้าแรก" },
  { href: "/scan", label: "สแกนผิว" },
  { href: "/history", label: "ประวัติ" },
  { href: "/about", label: "เกี่ยวกับ" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-20 mx-auto flex max-w-3xl justify-center px-5">
      <div className="flex w-full items-center justify-between gap-4 rounded-full border border-sand-300/70 bg-surface/80 px-5 py-2.5 shadow-[0_1px_2px_rgba(27,33,30,0.04),0_8px_24px_-12px_rgba(27,33,30,0.15)] backdrop-blur-md">
        <Link href="/" className="font-display text-base text-teal-900">
          skin scanner
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className="relative px-3 py-1.5">
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-teal-50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative ${active ? "text-teal-900" : "text-ink/60 hover:text-teal-600"} transition-colors`}>
                  {l.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
