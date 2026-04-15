export const THEME_STORAGE_KEY = "portfolio-theme";
export const THEME_CHANGE_EVENT = "portfolio-themechange";

export type ThemeMode = "light" | "dark";

export const THEME_BOOTSTRAP_SCRIPT = `(() => {
  try {
    const storageKey = "${THEME_STORAGE_KEY}";
    const root = document.documentElement;
    const storedTheme = window.localStorage.getItem(storageKey);
    const hasStoredTheme = storedTheme === "light" || storedTheme === "dark";
    const systemPrefersDark =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = hasStoredTheme
      ? storedTheme
      : systemPrefersDark
        ? "dark"
        : "light";

    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    root.dataset.theme = theme;
  } catch {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
    document.documentElement.dataset.theme = "dark";
  }
})();`;

export function getDocumentTheme(): ThemeMode {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const isDark = theme === "dark";

  root.classList.toggle("dark", isDark);
  root.style.colorScheme = theme;
  root.dataset.theme = theme;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    window.dispatchEvent(
      new CustomEvent<ThemeMode>(THEME_CHANGE_EVENT, {
        detail: theme,
      })
    );
  }
}
