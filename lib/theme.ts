export type SiteTheme = "light" | "dark";

export const DEFAULT_THEME: SiteTheme = "light";
const DARKMODE_ROUTE_PREFIX = "/darkmode";

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
  })();
`;
