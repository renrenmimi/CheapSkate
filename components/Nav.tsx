"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "My Deals" },
  { href: "/compare", label: "Price Compare" },
  { href: "/settings", label: "Customize" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {LINKS.map(({ href, label }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-green text-white"
                : "text-ink-soft hover:bg-green-tint hover:text-green-deep"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
