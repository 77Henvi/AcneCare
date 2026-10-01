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
    <header className="sticky top-3 z-20 mx-auto flex w-full max-w-5xl justify-center px-4 sm:top-5 sm:px-6 lg:max-w-6xl lg:px-8">
      <div className="flex w-full items-center justify-between gap-3 rounded-full border border-sand-300/80 bg-surface/85 px-4 py-2.5 shadow-[0_2px_16px_rgba(27,33,30,0.06)] backdrop-blur-md sm:px-6 sm:py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight text-teal-900 sm:text-base">
          <span className="inline-block h-2 w-2 rounded-full bg-teal-600"></span>
          skin scanner
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto text-xs sm:gap-2 sm:text-sm">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className="relative px-2 py-1.5 sm:px-3">
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
