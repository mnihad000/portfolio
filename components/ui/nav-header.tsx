"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  THEME_CHANGE_EVENT,
  applyTheme,
  getDocumentTheme,
  type ThemeMode,
} from "@/lib/theme";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experiences", href: "/experiences" },
  { label: "Contact", href: "/contact" },
];

function NavHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => getDocumentTheme());

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

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<ThemeMode>;
      const nextTheme = customEvent.detail;

      if (nextTheme === "light" || nextTheme === "dark") {
        setTheme(nextTheme);
        return;
      }

      setTheme(getDocumentTheme());
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange as EventListener);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange as EventListener);
    };
  }, []);

  const navSurfaceStyle = scrolled
    ? {
        background: "var(--portfolio-elevated-bg)",
        borderColor: "var(--portfolio-border-strong)",
        boxShadow: "var(--portfolio-shadow-soft)",
      }
    : {
        background: "var(--portfolio-panel-bg)",
        borderColor: "var(--portfolio-border)",
      };

  const activePillStyle = {
    borderColor: "var(--portfolio-border)",
    background:
      "linear-gradient(180deg, rgba(143,245,199,0.22) 0%, rgba(143,245,199,0.06) 100%)",
    boxShadow: "inset 0 0 12px var(--portfolio-accent-glow)",
  };

  const hoverOverlayStyle = {
    background:
      "linear-gradient(to bottom, rgba(143,245,199,0.08) 0, transparent 30%, transparent 70%, rgba(143,245,199,0.06) 100%)",
  };

  const scanOverlayStyle = {
    backgroundImage:
      "linear-gradient(to bottom, rgba(143,245,199,0.04) 1px, transparent 1px)",
    backgroundSize: "100% 3px",
  };

  function handleThemeSelect(nextTheme: ThemeMode) {
    if (nextTheme === theme) return;

    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        className="pointer-events-auto relative rounded-full border px-2 py-1.5 backdrop-blur-md transition-all duration-300"
        style={navSurfaceStyle}
        aria-label="Primary"
      >
        <div className="relative flex w-fit items-center gap-1">
          <ul className="relative flex w-fit items-center">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className="group relative z-10 flex min-h-11 items-center overflow-hidden rounded-full px-3 py-2.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors md:px-5 md:text-sm"
                  style={{
                    color:
                      activeHref === item.href
                        ? "var(--portfolio-ink)"
                        : "var(--portfolio-ink-muted)",
                  }}
                >
                  {activeHref === item.href ? (
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full border"
                      style={activePillStyle}
                    />
                  ) : null}
                  <span className="relative z-10">{item.label}</span>
                  <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span
                      className="absolute inset-0 rounded-full"
                      style={hoverOverlayStyle}
                    />
                    <span
                      className="absolute inset-0 rounded-full mix-blend-screen"
                      style={scanOverlayStyle}
                    />
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{ boxShadow: "0 0 14px var(--portfolio-accent-glow)" }}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div
            className="mx-1 h-6 w-px"
            style={{ background: "var(--portfolio-terminal-border)" }}
            aria-hidden="true"
          />

          <div
            className="flex items-center rounded-full border p-1"
            style={{
              borderColor: "var(--portfolio-border)",
              background: "var(--portfolio-panel-strong-bg)",
            }}
          >
            {(["light", "dark"] as const).map((mode) => {
              const isActive = theme === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleThemeSelect(mode)}
                  className="rounded-full px-2.5 py-1.5 font-mono text-[10px] tracking-[0.16em] uppercase transition-all duration-200 md:px-3"
                  style={
                    isActive
                      ? {
                          background: "var(--portfolio-button-solid-bg)",
                          color: "var(--portfolio-button-solid-fg)",
                          boxShadow: "var(--portfolio-shadow-soft)",
                        }
                      : {
                          color: "var(--portfolio-ink-muted)",
                        }
                  }
                  aria-pressed={isActive}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavHeader;
