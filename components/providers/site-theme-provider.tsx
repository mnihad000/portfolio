"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme";

export type SiteTheme = "light" | "dark";
export type ThemeTransitionPhase = "idle" | "transitioning" | "swapped";

type SiteThemeContextValue = {
  theme: SiteTheme;
  mounted: boolean;
  isTransitioning: boolean;
  transitionPhase: ThemeTransitionPhase;
  toggleTheme: () => void;
  setTheme: (theme: SiteTheme) => void;
};

const THEME_SWAP_DELAY_MS = 720;
const THEME_TRANSITION_TOTAL_MS = 1500;

const SiteThemeContext = createContext<SiteThemeContextValue | null>(null);

function isTheme(value: string | null | undefined): value is SiteTheme {
  return value === "light" || value === "dark";
}

function getInitialTheme(): SiteTheme {
  if (typeof document === "undefined") {
    return DEFAULT_THEME as SiteTheme;
  }

  const datasetTheme = document.documentElement.dataset.theme;
  if (isTheme(datasetTheme)) {
    return datasetTheme;
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(storedTheme)) {
      return storedTheme;
    }
  } catch {
    // Ignore storage failures and fall back to the default theme.
  }

  return DEFAULT_THEME as SiteTheme;
}

function applyTheme(theme: SiteTheme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures and keep the in-memory state authoritative.
  }
}

function ThemeTransitionOverlay({
  active,
  phase,
  targetTheme,
}: {
  active: boolean;
  phase: ThemeTransitionPhase;
  targetTheme: SiteTheme | null;
}) {
  if (!active || !targetTheme) {
    return null;
  }

  const isToLight = targetTheme === "light";
  const overlayClassName =
    phase === "swapped"
      ? isToLight
        ? "bg-[#f7f4ef] text-neutral-950"
        : "bg-black text-white"
      : isToLight
        ? "bg-black text-white"
        : "bg-[#f7f4ef] text-neutral-950";

  const panelClassName =
    phase === "swapped"
      ? isToLight
        ? "border-black/10 bg-white/75"
        : "border-white/15 bg-white/[0.06]"
      : isToLight
        ? "border-white/15 bg-white/[0.06]"
        : "border-black/10 bg-black/[0.08]";

  const copyClassName =
    phase === "swapped"
      ? isToLight
        ? "text-neutral-500"
        : "text-white/55"
      : isToLight
        ? "text-white/55"
        : "text-neutral-500";

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-500 ${overlayClassName}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_42%)] opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_3px] opacity-30" />
      <div
        className={`relative mx-6 w-full max-w-2xl overflow-hidden rounded-[2rem] border px-8 py-10 text-center shadow-[0_30px_90px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-500 md:px-12 md:py-12 ${panelClassName}`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-current/15" />
        <p className={`text-[11px] uppercase tracking-[0.34em] ${copyClassName}`}>
          Mode Shift
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
          transitioning to the future
        </h2>
        <p className={`mt-4 text-sm md:text-base ${copyClassName}`}>
          {isToLight
            ? "Rebuilding the interface in a brighter register."
            : "Returning to the darker operating layer."}
        </p>
        <div className="mt-8 grid grid-cols-8 gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="h-2 rounded-full bg-current/15 transition-all duration-500"
              style={{
                opacity: phase === "swapped" ? 1 : 0.45,
                transform:
                  phase === "swapped"
                    ? "scaleX(1)"
                    : `scaleX(${0.72 + index * 0.03})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const timersRef = useRef<number[]>([]);
  const [theme, setThemeState] = useState<SiteTheme>(DEFAULT_THEME as SiteTheme);
  const [mounted, setMounted] = useState(false);
  const [transitionPhase, setTransitionPhase] =
    useState<ThemeTransitionPhase>("idle");
  const [targetTheme, setTargetTheme] = useState<SiteTheme | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function commitTheme(nextTheme: SiteTheme) {
    applyTheme(nextTheme);
    setThemeState(nextTheme);
  }

  useEffect(() => {
    const initialTheme = getInitialTheme();
    const frame = window.requestAnimationFrame(() => {
      applyTheme(initialTheme);
      setThemeState(initialTheme);
      setMounted(true);
    });

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      window.cancelAnimationFrame(frame);
      mediaQuery.removeEventListener("change", updateMotionPreference);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (theme === "light" && pathname !== "/") {
      startTransition(() => {
        router.replace("/");
      });
    }
  }, [mounted, pathname, router, theme]);

  const value = useMemo<SiteThemeContextValue>(
    () => ({
      theme,
      mounted,
      isTransitioning: transitionPhase !== "idle",
      transitionPhase,
      toggleTheme: () => {
        if (!mounted || transitionPhase === "transitioning") {
          return;
        }

        clearTimers();

        const nextTheme: SiteTheme = theme === "dark" ? "light" : "dark";
        const swapDelay = prefersReducedMotion ? 0 : THEME_SWAP_DELAY_MS;
        const totalDuration = prefersReducedMotion
          ? 120
          : THEME_TRANSITION_TOTAL_MS;

        setTargetTheme(nextTheme);
        setTransitionPhase("transitioning");

        timersRef.current.push(
          window.setTimeout(() => {
            commitTheme(nextTheme);

            if (nextTheme === "light" && pathname !== "/") {
              startTransition(() => {
                router.push("/");
              });
            }
          }, swapDelay)
        );

        timersRef.current.push(
          window.setTimeout(() => {
            setTransitionPhase("swapped");
          }, Math.min(totalDuration - 220, swapDelay + 260))
        );

        timersRef.current.push(
          window.setTimeout(() => {
            setTransitionPhase("idle");
            setTargetTheme(null);
          }, totalDuration)
        );
      },
      setTheme: (nextTheme: SiteTheme) => {
        clearTimers();
        setTransitionPhase("idle");
        setTargetTheme(null);
        commitTheme(nextTheme);
      },
    }),
    [mounted, pathname, prefersReducedMotion, router, theme, transitionPhase]
  );

  return (
    <SiteThemeContext.Provider value={value}>
      {children}
      <ThemeTransitionOverlay
        active={transitionPhase !== "idle"}
        phase={transitionPhase}
        targetTheme={targetTheme}
      />
    </SiteThemeContext.Provider>
  );
}

export function useSiteTheme() {
  const context = useContext(SiteThemeContext);

  if (!context) {
    throw new Error("useSiteTheme must be used within a SiteThemeProvider.");
  }

  return context;
}
