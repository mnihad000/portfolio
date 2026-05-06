"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSiteTheme } from "@/components/providers/site-theme-provider";
import ThemeToggle from "@/components/ui/theme-toggle";

type NavItem = {
  label: string;
  href: string;
};

type LightTab = {
  label: string;
  targetId: string;
};

type IndicatorPosition = {
  left: number;
  width: number;
  opacity: number;
};

const DARK_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experiences", href: "/experiences" },
  { label: "Contact", href: "/contact" },
];

const LIGHT_TABS: LightTab[] = [
  { label: "Home", targetId: "home" },
  { label: "About", targetId: "about" },
  { label: "Projects", targetId: "projects" },
  { label: "Contact", targetId: "contact" },
];

function DarkModeNav() {
  const pathname = usePathname();
  const activeHref = useMemo(() => {
    if (DARK_NAV_ITEMS.some((item) => item.href === pathname)) {
      return pathname;
    }
    if (pathname === "/") return "/";
    const nestedMatch = DARK_NAV_ITEMS.find(
      (item) => item.href !== "/" && pathname.startsWith(`${item.href}/`)
    );
    return nestedMatch?.href ?? "/";
  }, [pathname]);

  return (
    <ul className="relative flex w-fit items-center gap-1">
      {DARK_NAV_ITEMS.map((item) => (
        <li key={item.href} className="relative">
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
  );
}

function LightModeTabs() {
  const [position, setPosition] = useState<IndicatorPosition>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [selected, setSelected] = useState(0);
  const tabsRef = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const syncSelectedIndicator = () => {
      const selectedTab = tabsRef.current[selected];
      if (!selectedTab) {
        return;
      }

      const { width } = selectedTab.getBoundingClientRect();
      setPosition({
        left: selectedTab.offsetLeft,
        width,
        opacity: 1,
      });
    };

    syncSelectedIndicator();
  }, [selected]);

  useEffect(() => {
    let frameId = 0;

    const updateSelectedFromScroll = () => {
      frameId = 0;

      const viewportHeight = window.innerHeight;
      const focusLine = Math.min(
        Math.max(viewportHeight * 0.32, 140),
        viewportHeight * 0.5
      );

      let nextSelected = selected;
      let bestDistance = Number.POSITIVE_INFINITY;

      LIGHT_TABS.forEach((tab, index) => {
        const section = document.getElementById(tab.targetId);
        if (!section) {
          return;
        }

        const rect = section.getBoundingClientRect();
        const isInRange = rect.top <= focusLine && rect.bottom >= focusLine;

        if (isInRange) {
          nextSelected = index;
          bestDistance = -1;
          return;
        }

        if (bestDistance === -1) {
          return;
        }

        const distance = Math.min(
          Math.abs(rect.top - focusLine),
          Math.abs(rect.bottom - focusLine)
        );

        if (distance < bestDistance) {
          bestDistance = distance;
          nextSelected = index;
        }
      });

      setSelected((current) => (current === nextSelected ? current : nextSelected));
    };

    const scheduleUpdate = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateSelectedFromScroll);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [selected]);

  const handleTabClick = (index: number) => {
    setSelected(index);

    const tab = LIGHT_TABS[index];
    if (!tab) {
      return;
    }

    const target = document.getElementById(tab.targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full border border-white/70 bg-white/28 p-1.5 shadow-[0_14px_40px_rgba(15,23,42,0.12)] ring-1 ring-black/6 backdrop-blur-xl supports-[backdrop-filter]:bg-white/22">
        <ul className="relative mx-auto flex w-fit items-center gap-1 overflow-hidden rounded-full border border-white/65 bg-white/14 px-1 py-1 text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl">
          {LIGHT_TABS.map((tab, index) => (
            <li
              key={tab.label}
              ref={(element) => {
                tabsRef.current[index] = element;
              }}
              onClick={() => handleTabClick(index)}
              onMouseEnter={(event) => {
                const target = event.currentTarget;
                const { width } = target.getBoundingClientRect();

                setPosition({
                  left: target.offsetLeft,
                  width,
                  opacity: 1,
                });
              }}
              className={`relative z-10 block cursor-pointer rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em] transition-colors duration-200 md:px-6 md:py-3 md:text-sm ${
                selected === index
                  ? "text-neutral-950"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {tab.label}
            </li>
          ))}
          <motion.li
            animate={{
              left: position.left,
              width: position.width,
              opacity: position.opacity,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 34,
            }}
            className="pointer-events-none absolute bottom-1 top-1 z-0"
          >
            <span className="absolute left-0 top-0 h-4 w-4 border-l-[3px] border-t-[3px] border-neutral-950 md:h-5 md:w-5" />
            <span className="absolute right-0 top-0 h-4 w-4 border-r-[3px] border-t-[3px] border-neutral-950 md:h-5 md:w-5" />
            <span className="absolute bottom-0 left-0 h-4 w-4 border-b-[3px] border-l-[3px] border-neutral-950 md:h-5 md:w-5" />
            <span className="absolute bottom-0 right-0 h-4 w-4 border-b-[3px] border-r-[3px] border-neutral-950 md:h-5 md:w-5" />
          </motion.li>
        </ul>
      </div>

      <ThemeToggle variant="light" />
    </div>
  );
}

function NavHeader() {
  const pathname = usePathname();
  const { mounted, theme } = useSiteTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showLightTabs = mounted && theme === "light" && pathname === "/";

  if (showLightTabs) {
    return (
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <div className="pointer-events-auto">
          <LightModeTabs />
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        className={`pointer-events-auto relative flex items-center gap-2 rounded-full border px-2 py-1.5 backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "border-white/20 bg-black/70 shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
            : "border-white/10 bg-black/45"
        }`}
        aria-label="Primary"
      >
        <DarkModeNav />
        <ThemeToggle />
      </nav>
    </div>
  );
}

export default NavHeader;
