"use client";

import { Moon, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const initialTheme =
        document.documentElement.dataset.theme === "light" ? "light" : "dark";
      setTheme(initialTheme);
      setMounted(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(nextTheme);
        setTheme(nextTheme);
      }}
      className="group relative flex h-11 min-w-11 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-background/85 text-foreground shadow-[0_10px_24px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-300 hover:border-primary/35 hover:text-primary dark:bg-background/75 dark:shadow-[0_12px_28px_rgba(0,0,0,0.32)]"
      aria-label={mounted ? `Switch to ${nextTheme} mode` : "Toggle theme"}
      title={mounted ? `Switch to ${nextTheme} mode` : "Toggle theme"}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--signal-rgb),0.16),transparent_68%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
