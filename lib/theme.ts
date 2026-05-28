export type SiteTheme = "light" | "dark";

export const DEFAULT_THEME: SiteTheme = "light";
const DARKMODE_ROUTE_PREFIX = "/darkmode";
export const SITE_INTRO_SESSION_KEY = "nihad-site-intro-played";
export const SITE_INTRO_VIDEO_SRC = "/intro/Video%20Project%206.mp4";
export const SITE_INTRO_EXIT_DURATION_MS = 400;

export const THEME_BOOTSTRAP_SCRIPT = `
  (() => {
    const root = document.documentElement;
    const pathname = window.location.pathname;
    const fallbackTheme =
      pathname === "${DARKMODE_ROUTE_PREFIX}" ||
      pathname.startsWith("${DARKMODE_ROUTE_PREFIX}/")
        ? "dark"
        : "${DEFAULT_THEME}";

    root.dataset.theme = fallbackTheme;
    root.classList.toggle("dark", fallbackTheme === "dark");
    root.style.colorScheme = fallbackTheme;

    try {
      root.dataset.siteIntro =
        window.sessionStorage.getItem("${SITE_INTRO_SESSION_KEY}") === "true"
          ? "played"
          : "pending";
    } catch {
      root.dataset.siteIntro = "pending";
    }
  })();
`;
