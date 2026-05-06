"use client";

import { Moon, SunMedium } from "lucide-react";
import { useSiteTheme } from "@/components/providers/site-theme-provider";

type ThemeToggleProps = {
  variant?: "dark" | "light";
};

export default function ThemeToggle({ variant = "dark" }: ThemeToggleProps) {
  const { isTransitioning, mounted, theme, toggleTheme } = useSiteTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";
  const isLightVariant = variant === "light";

  const className = isLightVariant
    ? "group relative flex h-12 min-w-12 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white/76 text-neutral-900 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-md transition-all duration-300 hover:border-black/20 hover:text-black disabled:cursor-not-allowed disabled:opacity-65"
    : "group relative flex h-11 min-w-11 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.06] text-white shadow-[0_10px_24px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-65";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={isTransitioning}
      className={className}
      aria-label={mounted ? `Switch to ${nextTheme} mode` : "Toggle theme"}
      title={mounted ? `Switch to ${nextTheme} mode` : "Toggle theme"}
    >
      <span
        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
          isLightVariant
            ? "bg-[radial-gradient(circle_at_top,rgba(17,17,17,0.08),transparent_68%)]"
            : "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_68%)]"
        }`}
      />
      <SunMedium
        className={`absolute h-4 w-4 transition-all duration-300 ${
          theme === "light"
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-1 scale-75 opacity-0"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ${
          theme === "dark"
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-1 scale-75 opacity-0"
        }`}
      />
    </button>
  );
}
