import Link from "next/link";

const links = [
  { href: "/", label: "หน้าแรก" },
  { href: "/scan", label: "สแกนผิว" },
  { href: "/history", label: "ประวัติ" },
  { href: "/about", label: "เกี่ยวกับ" },
];

export default function Nav() {
  return (
    <header className="border-b border-sand-300 bg-canvas/90 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-lg text-teal-900">
          Skin Scanner
        </Link>
        <nav className="flex gap-5 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-ink/70 hover:text-teal-600 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
