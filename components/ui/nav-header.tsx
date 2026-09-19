"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const TABS = [
  { label: "Home", targetId: "home" },
  { label: "About", targetId: "about" },
  { label: "Projects", targetId: "projects" },
  { label: "Contact", targetId: "contact" },
];

const springTransition = { type: "spring", stiffness: 420, damping: 34 } as const;

function GlassDecorations() {
  return (
    <>
      <span className="liquid-nav__sheen" aria-hidden="true" />
      <span className="liquid-nav__bracket liquid-nav__bracket--left" aria-hidden="true" />
      <span className="liquid-nav__bracket liquid-nav__bracket--right" aria-hidden="true" />
      <span className="liquid-nav__register liquid-nav__register--left" aria-hidden="true" />
      <span className="liquid-nav__register liquid-nav__register--right" aria-hidden="true" />
    </>
  );
}

export default function NavHeader() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const activeTransition = reduceMotion ? { duration: 0 } : springTransition;

  useEffect(() => {
    if (pathname !== "/") return;

    const updateActiveSection = () => {
      const focusLine = Math.min(
        Math.max(window.innerHeight * 0.32, 140),
        window.innerHeight * 0.5,
      );
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
          const distance = Math.min(
            Math.abs(rect.top - focusLine),
            Math.abs(rect.bottom - focusLine),
          );
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

  const scrollToSection = (targetId: string, index: number) => {
    setSelected(index);
    document.getElementById(targetId)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3 sm:px-4">
      <nav className="liquid-nav pointer-events-auto" aria-label="Primary">
        <GlassDecorations />

        {pathname === "/" ? (
          <ul className="liquid-nav__list no-scrollbar">
            {TABS.map((tab, index) => {
              const isActive = selected === index;

              return (
                <li key={tab.label} className="liquid-nav__item">
                  <button
                    type="button"
                    className="liquid-nav__control"
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => scrollToSection(tab.targetId, index)}
                  >
                    <span className="liquid-nav__label">
                      {tab.label}
                      {isActive ? (
                        <motion.span
                          layoutId="liquid-nav-status"
                          className="liquid-nav__status"
                          transition={activeTransition}
                          aria-hidden="true"
                        />
                      ) : null}
                    </span>
                    {isActive ? (
                      <motion.span
                        layoutId="liquid-nav-underline"
                        className="liquid-nav__underline"
                        transition={activeTransition}
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="liquid-nav__list liquid-nav__list--compact">
            <li className="liquid-nav__item">
              <Link href="/" className="liquid-nav__control">
                Home
              </Link>
            </li>
            <li className="liquid-nav__item">
              <Link href="/#projects" className="liquid-nav__control">
                Projects
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}
