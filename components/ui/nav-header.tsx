"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const TABS = [
  { label: "Home", targetId: "home" },
  { label: "About", targetId: "about" },
  { label: "Projects", targetId: "projects" },
  { label: "Contact", targetId: "contact" },
];

export default function NavHeader() {
  const pathname = usePathname();
  const [selected, setSelected] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const tabsRef = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const tab = tabsRef.current[selected];
    if (tab) {
      setIndicator({ left: tab.offsetLeft, width: tab.getBoundingClientRect().width, opacity: 1 });
    }
  }, [selected]);

  useEffect(() => {
    if (pathname !== "/") return;
    const updateActiveSection = () => {
      const focusLine = Math.min(Math.max(window.innerHeight * 0.32, 140), window.innerHeight * 0.5);
      let nextSelected = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      TABS.forEach((tab, index) => {
        const section = document.getElementById(tab.targetId);
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top <= focusLine && rect.bottom >= focusLine) {
          nextSelected = index;
          bestDistance = -1;
        } else if (bestDistance !== -1) {
          const distance = Math.min(Math.abs(rect.top - focusLine), Math.abs(rect.bottom - focusLine));
          if (distance < bestDistance) {
            nextSelected = index;
            bestDistance = distance;
          }
        }
      });
      setSelected((current) => (current === nextSelected ? current : nextSelected));
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [pathname]);

  if (pathname.startsWith("/projects/")) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3 sm:px-4">
      <nav className="pointer-events-auto max-w-full rounded-full border border-white/70 bg-white/28 p-1.5 shadow-[0_14px_40px_rgba(15,23,42,0.12)] ring-1 ring-black/6 backdrop-blur-xl supports-[backdrop-filter]:bg-white/22" aria-label="Primary">
        {pathname === "/" ? (
          <ul className="no-scrollbar relative flex max-w-full items-center gap-1 overflow-x-auto overflow-y-hidden rounded-full border border-white/65 bg-white/14 px-1 py-1 text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
            {TABS.map((tab, index) => (
              <li key={tab.label} ref={(element) => { tabsRef.current[index] = element; }} className={`relative z-10 shrink-0 cursor-pointer rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.12em] transition-colors sm:px-4 sm:tracking-[0.18em] md:px-6 md:py-3 md:text-sm md:tracking-[0.24em] ${selected === index ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-800"}`} onClick={() => { setSelected(index); document.getElementById(tab.targetId)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
                {tab.label}
              </li>
            ))}
            <motion.li animate={indicator} transition={{ type: "spring", stiffness: 420, damping: 34 }} className="pointer-events-none absolute bottom-1 top-1 z-0">
              <span className="absolute inset-0 rounded-full border border-black/10 bg-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]" />
            </motion.li>
          </ul>
        ) : (
          <ul className="flex items-center gap-1 rounded-full border border-white/65 bg-white/14 px-1 py-1 text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
            <li><Link href="/" className="flex min-h-10 items-center rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-neutral-500 transition-colors hover:text-neutral-900 md:px-6 md:text-sm md:tracking-[0.2em]">Home</Link></li>
            <li><Link href="/#projects" className="flex min-h-10 items-center rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-neutral-500 transition-colors hover:text-neutral-900 md:px-6 md:text-sm md:tracking-[0.2em]">Projects</Link></li>
          </ul>
        )}
      </nav>
    </div>
  );
}
