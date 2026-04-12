"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experiences", href: "/experiences" },
  { label: "Contact", href: "/contact" },
];

function NavHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const activeHref = useMemo(() => {
    if (NAV_ITEMS.some((item) => item.href === pathname)) {
      return pathname;
    }
    if (pathname === "/") return "/";
    const nestedMatch = NAV_ITEMS.find(
      (item) => item.href !== "/" && pathname.startsWith(`${item.href}/`)
    );
    return nestedMatch?.href ?? "/";
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <nav
        className={`pointer-events-auto relative rounded-full border px-2 py-1.5 backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "border-white/20 bg-black/70 shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
            : "border-white/10 bg-black/45"
        }`}
        aria-label="Primary"
      >
        <ul className="relative flex w-fit items-center">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="relative">
              {/*
                Static active pill is intentionally more reliable than a moving cursor.
              */}
              <Link
                href={item.href}
                className={`group relative z-10 flex min-h-11 items-center overflow-hidden rounded-full px-4 py-2.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors md:px-6 md:text-sm ${
                  activeHref === item.href
                    ? "text-white"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {activeHref === item.href ? (
                  <span className="pointer-events-none absolute inset-0 rounded-full border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.06)_100%)] shadow-[inset_0_0_12px_rgba(255,255,255,0.08)]" />
                ) : null}
                <span className="relative z-10">{item.label}</span>
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span className="absolute inset-0 rounded-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08)_0,transparent_30%,transparent_70%,rgba(255,255,255,0.06)_100%)]" />
                  <span className="absolute inset-0 rounded-full bg-[length:100%_3px] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] mix-blend-screen" />
                  <span className="absolute inset-0 rounded-full shadow-[0_0_14px_rgba(255,255,255,0.14)]" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default NavHeader;
